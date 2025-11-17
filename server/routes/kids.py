from flask import Blueprint, jsonify, request

from ..database import db
from ..models import AccountGroup, Kid
from ..utils.serializers import kid_payload

kids_bp = Blueprint('kids', __name__)


@kids_bp.route('/accounts/<account_id>/kids', methods=['GET'])
def list_kids(account_id):
    AccountGroup.query.get_or_404(account_id)
    kids = Kid.query.filter_by(account_group_id=account_id).order_by(Kid.full_name).all()
    return jsonify([kid_payload(kid) for kid in kids])


@kids_bp.route('/accounts/<account_id>/kids', methods=['POST'])
def create_kid(account_id):
    AccountGroup.query.get_or_404(account_id)
    payload = request.json or {}
    kid = Kid(
        full_name=payload.get('name', 'New Kid'),
        ratio=payload.get('ratio', '1:1'),
        special_instructions=payload.get('specialInstructions'),
        banned_staff=payload.get('bans', []),
        requires_personal_trainer=payload.get('requiresOneOnOne', False),
        account_group_id=account_id,
        shift_id=payload.get('shift_id'),
        assignment_id=payload.get('assignment_id'),
    )
    db.session.add(kid)
    db.session.commit()
    return jsonify(kid_payload(kid)), 201
