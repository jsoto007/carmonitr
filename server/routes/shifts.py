from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload

from ..database import db
from ..models import Assignment, Shift
from ..services.notifications import broadcast_open_shift, notify_shift_change
from ..utils.serializers import shift_payload

shifts_bp = Blueprint('shifts', __name__)

@shifts_bp.route('/shifts', methods=['GET'])
def list_shifts():
    account_id = request.args.get('account_id')
    role_filter = request.args.get('role')
    query = Shift.query.options(
        joinedload(Shift.assignments).joinedload(Assignment.staff),
        joinedload(Shift.assignments).joinedload(Assignment.kids),
        joinedload(Shift.kids),
    )
    if account_id:
        query = query.filter_by(account_group_id=account_id)
    if role_filter:
        query = query.filter(Shift.assignments.any(Assignment.staff.has(role=role_filter)))
    shifts = query.order_by(Shift.start_time).all()
    return jsonify([shift_payload(shift) for shift in shifts])

@shifts_bp.route('/shifts', methods=['POST'])
def create_shift():
    payload = request.json or {}
    shift = Shift(
        account_group_id=payload['account_group_id'],
        site=payload.get('site', 'Main Hall'),
        start_time=datetime.fromisoformat(payload['start_time']),
        end_time=datetime.fromisoformat(payload['end_time']),
        ratio_min=payload.get('ratio_min', 1),
        leads_required=payload.get('leads_required', 1),
        is_special=payload.get('is_special', False),
        difficulty=payload.get('difficulty', 'standard'),
        open_shift=payload.get('openShift', False),
    )
    db.session.add(shift)
    db.session.commit()
    return jsonify({'id': shift.id}), 201

@shifts_bp.route('/shifts/<shift_id>', methods=['PATCH'])
def update_shift(shift_id):
    shift = Shift.query.get_or_404(shift_id)
    payload = request.json or {}
    shift.ratio_min = payload.get('ratio_min', shift.ratio_min)
    shift.leads_required = payload.get('leads_required', shift.leads_required)
    shift.is_special = payload.get('is_special', shift.is_special)
    previous_open = shift.open_shift
    shift.open_shift = payload.get('openShift', shift.open_shift)
    db.session.commit()
    for assignment in shift.assignments:
        if assignment.staff:
            notify_shift_change(assignment.staff.email, shift.id)
    if shift.open_shift and not previous_open:
        staff_emails = [member.email for member in shift.account_group.staff]
        broadcast_open_shift(shift.id, staff_emails)
    return jsonify({'message': 'Shift updated'})
