from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from ..database import db
from ..models import AccountGroup, StaffMember
from ..services.auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    supported_roles,
    verify_password,
)

auth_bp = Blueprint('auth', __name__)


def _account_payload(account: AccountGroup) -> dict:
    return {
        'id': account.id,
        'name': account.name,
        'timezone': account.timezone,
        'branding': {
            'primaryColor': account.brand_primary,
            'logoUrl': account.logo_url,
        },
        'geofence': {
            'lat': account.geofence_lat,
            'lon': account.geofence_lon,
            'radiusMeters': account.geofence_radius,
        },
    }


def _staff_payload(staff: StaffMember) -> dict:
    return {
        'id': staff.id,
        'full_name': staff.full_name,
        'email': staff.email,
        'role': staff.role,
        'status': staff.status,
        'assigned_account_ids': [account.id for account in staff.accounts],
        'invite_expires_at': staff.invite_expires_at.isoformat() if staff.invite_expires_at else None,
    }


def _token_from_header() -> str | None:
    header = request.headers.get('Authorization', '')
    parts = header.split()
    if len(parts) == 2 and parts[0].lower() == 'bearer':
        return parts[1]
    return None


def _respond_with_token(staff: StaffMember, status_code: int = 200):
    token_data = create_access_token(staff.id, staff.role)
    return (
        jsonify(
            {
                'access_token': token_data['token'],
                'token_type': 'bearer',
                'expires_at': token_data['expires_at'],
                'staff': _staff_payload(staff),
                'accounts': [_account_payload(account) for account in staff.accounts],
            }
        ),
        status_code,
    )


@auth_bp.route('/auth/signup', methods=['POST'])
def signup():
    payload = request.json or {}
    full_name = payload.get('full_name')
    email = payload.get('email')
    password = payload.get('password')
    if not (full_name and email and password):
        return jsonify({'error': 'full_name, email, and password are required'}), 400
    role = payload.get('role', 'Owner_admin')
    if role not in supported_roles():
        return jsonify({'error': 'Unsupported role'}), 400
    if StaffMember.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    friendly_name = full_name.strip()
    lead_name = friendly_name.split()[0] if friendly_name else 'Workspace'
    account_name = (
        payload.get('account_name')
        or payload.get('company')
        or payload.get('organization')
        or f"{lead_name}'s workspace"
    )
    branding = payload.get('branding') or {}
    geofence = payload.get('geofence') or {}

    account = AccountGroup(
        name=account_name,
        timezone=payload.get('timezone', 'UTC'),
        brand_primary=branding.get('primaryColor', '#1d4ed8'),
        logo_url=branding.get('logoUrl') or payload.get('logo_url'),
        geofence_lat=float(geofence.get('lat', 0.0)),
        geofence_lon=float(geofence.get('lon', 0.0)),
        geofence_radius=int(geofence.get('radiusMeters', 900)),
    )
    staff = StaffMember(
        full_name=full_name,
        email=email,
        role=role,
        status='active',
        invited_at=datetime.utcnow(),
        password_hash=hash_password(password),
    )
    account.staff.append(staff)

    try:
        db.session.add(account)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Unable to register account'}), 422

    return _respond_with_token(staff, status_code=201)


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    payload = request.json or {}
    email = payload.get('email')
    password = payload.get('password')
    if not (email and password):
        return jsonify({'error': 'Email and password are required'}), 400
    staff = StaffMember.query.filter_by(email=email).first()
    if not staff or not verify_password(password, staff.password_hash):
        return jsonify({'error': 'Invalid credentials'}), 401

    return _respond_with_token(staff)


@auth_bp.route('/auth/me', methods=['GET'])
def me():
    token = _token_from_header()
    if not token:
        return jsonify({'error': 'Authorization token required'}), 401
    payload = decode_access_token(token)
    if not payload:
        return jsonify({'error': 'Invalid or expired token'}), 401
    staff_id = payload.get('sub')
    staff = StaffMember.query.get_or_404(staff_id)
    return (
        jsonify(
            {
                'staff': _staff_payload(staff),
                'accounts': [_account_payload(account) for account in staff.accounts],
            }
        ),
        200,
    )
