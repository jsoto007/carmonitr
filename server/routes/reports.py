from datetime import datetime
from flask import Blueprint, jsonify, request

from ..models import Assignment, Shift

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports/staff-utilization', methods=['GET'])
def staff_utilization():
    since = request.args.get('since')
    query = Shift.query
    if since:
        query = query.filter(Shift.start_time >= datetime.fromisoformat(since))
    shifts = query.all()
    total_shifts = len(shifts)
    ratio_compliant = sum(1 for shift in shifts if shift.ratio_min <= len(shift.assignments))
    open_shifts = Shift.query.filter_by(open_shift=True).count()
    summary = {
        'total_shifts': total_shifts,
        'ratio_compliant': ratio_compliant,
        'open_shifts': open_shifts,
        'averages': {
            'assignments_per_shift': round(sum(len(shift.assignments) for shift in shifts) / (total_shifts or 1), 2),
        },
    }
    return jsonify(summary)

@reports_bp.route('/reports/ratio-compliance', methods=['GET'])
def ratio_compliance():
    assignments = Assignment.query.all()
    by_role: dict[str, dict[str, int]] = {}
    for assignment in assignments:
        role = assignment.staff.role if assignment.staff else 'Unassigned'
        by_role.setdefault(role, {'count': 0, 'hard': 0})
        by_role[role]['count'] += 1
        if assignment.difficulty_rating >= 4:
            by_role[role]['hard'] += 1
    return jsonify({'by_role': by_role})
