from flask import Blueprint, jsonify, request

from ..models import Assignment, StaffMember
from ..services.notifications import notify_assignment_change

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/notifications/register', methods=['POST'])
def register_push_token():
    data = request.json or {}
    staff_id = data.get('staff_id')
    token = data.get('token')
    if not staff_id or not token:
        return jsonify({'error': 'staff_id and token are required'}), 400
    staff = StaffMember.query.get(staff_id)
    if not staff:
        return jsonify({'error': 'Staff member not found'}), 404
    return jsonify({'message': 'Push token recorded'}), 201


@notifications_bp.route('/notifications/assignment/<assignment_id>', methods=['POST'])
def assignment_alert(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    if assignment.staff:
        notify_assignment_change(assignment.staff.email, assignment.id)
    return jsonify({'message': 'Assignment notification queued'}), 200
