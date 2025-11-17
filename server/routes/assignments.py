from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload

from ..database import db
from ..models import Assignment, Kid, Shift, StaffMember
from ..services.geofence import is_within_geofence
from ..services.notifications import broadcast_open_shift, notify_assignment_change
from ..utils.serializers import shift_payload

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/assignments/open', methods=['GET'])
def open_shifts():
    query = (
        Shift.query.filter_by(open_shift=True)
        .options(
            joinedload(Shift.assignments).joinedload(Assignment.staff),
            joinedload(Shift.assignments).joinedload(Assignment.kids),
        )
        .order_by(Shift.start_time)
    )
    payload = []
    for shift in query.all():
        shift_data = shift_payload(shift)
        payload.append(
            {
                'id': shift.id,
                'site': shift.site,
                'ratio_min': shift.ratio_min,
                'start_time': shift.start_time.isoformat(),
                'end_time': shift.end_time.isoformat(),
                'role': shift_data['role'],
                'assignments': shift_data['assignments'],
                'pendingAssignmentId': shift_data['pendingAssignmentId'],
                'openShift': shift.open_shift,
                'difficulty': shift_data['difficulty'],
            }
        )
    return jsonify(payload)

@assignments_bp.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.json or {}
    shift = Shift.query.get_or_404(data['shift_id'])
    assignment = Assignment(
        shift_id=data['shift_id'],
        staff_id=data.get('staff_id'),
        title=data.get('title', 'Kid assignment'),
        difficulty_rating=data.get('difficulty_rating', 2),
        instructions=data.get('instructions'),
        requires_one_on_one=data.get('requires_one_on_one', False),
    )
    db.session.add(assignment)
    db.session.flush()
    kids_payload = data.get('kids', [])
    for kid in kids_payload:
        kid_model = Kid(
            full_name=kid['name'],
            ratio=kid.get('ratio', '1:1'),
            special_instructions=kid.get('instructions'),
            banned_staff=kid.get('banned_staff', []),
            account_group_id=kid.get('account_group_id', shift.account_group_id),
            shift_id=data['shift_id'],
            assignment_id=assignment.id,
        )
        db.session.add(kid_model)
    db.session.commit()
    if assignment.staff:
        notify_assignment_change(assignment.staff.email, assignment.id)
    return jsonify({'id': assignment.id}), 201

@assignments_bp.route('/assignments/<assignment_id>/request', methods=['POST'])
def request_open_shift(assignment_id):
    assignment = (
        Assignment.query.options(joinedload(Assignment.shift).joinedload(Shift.account_group)).get_or_404(assignment_id)
    )
    if assignment.staff_id:
        return jsonify({'error': 'Assignment already filled'}), 409
    staff_id = request.json.get('staff_id')
    staff = StaffMember.query.get(staff_id)
    if not staff:
        return jsonify({'error': 'Staff not found'}), 404
    shift = assignment.shift
    account_staff = shift.account_group.staff if shift and shift.account_group else []
    admins = [member.email for member in account_staff if member.role in ['Owner_admin', 'Admin']]
    if admins and shift:
        broadcast_open_shift(shift.id, admins)
    notify_assignment_change(staff.email, assignment.id)
    return jsonify({'message': 'Request received', 'assignment_id': assignment.id})

@assignments_bp.route('/assignments/<assignment_id>/validate-geofence', methods=['GET'])
def assignment_geofence(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    lat = float(request.args.get('lat', 0))
    lon = float(request.args.get('lon', 0))
    shift = Shift.query.get(assignment.shift_id)
    account = shift.account_group
    allowed = is_within_geofence(lat, lon, account.geofence_lat, account.geofence_lon, account.geofence_radius)
    return jsonify({'allowed': allowed})
