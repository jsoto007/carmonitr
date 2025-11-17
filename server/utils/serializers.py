from typing import Optional

from ..models import Assignment, Kid, Shift


def kid_payload(kid: Kid) -> dict:
    return {
        'id': kid.id,
        'name': kid.full_name,
        'ratio': kid.ratio,
        'requiresOneOnOne': kid.requires_personal_trainer,
        'specialInstructions': kid.special_instructions,
        'bans': kid.banned_staff or [],
        'shift_id': kid.shift_id,
        'assignment_id': kid.assignment_id,
        'account_group_id': kid.account_group_id,
    }


def assignment_payload(assignment: Assignment) -> dict:
    kids = [kid_payload(kid) for kid in assignment.kids]
    return {
        'id': assignment.id,
        'shift_id': assignment.shift_id,
        'staff_id': assignment.staff_id,
        'title': assignment.title,
        'site': assignment.shift.site if assignment.shift else None,
        'difficulty': assignment.difficulty_rating,
        'instructions': assignment.instructions,
        'requiresOneOnOne': assignment.requires_one_on_one,
        'kids': kids,
        'kidsCount': len(kids),
        'staff_role': assignment.staff.role if assignment.staff else None,
    }


def shift_role(shift: Shift) -> str:
    for assignment in shift.assignments:
        if assignment.staff and assignment.staff.role:
            return assignment.staff.role
    return 'Staff'


def pending_assignment_id(shift: Shift) -> Optional[str]:
    for assignment in shift.assignments:
        if assignment.staff_id is None:
            return assignment.id
    return None


def shift_payload(shift: Shift) -> dict:
    assignments = [assignment_payload(assignment) for assignment in shift.assignments]
    kids = [kid_payload(kid) for kid in shift.kids]
    return {
        'id': shift.id,
        'account_group_id': shift.account_group_id,
        'site': shift.site,
        'start_time': shift.start_time.isoformat(),
        'end_time': shift.end_time.isoformat(),
        'ratio_min': shift.ratio_min,
        'leadsRequired': shift.leads_required,
        'difficulty': shift.difficulty,
        'role': shift_role(shift),
        'is_special': shift.is_special,
        'openShift': shift.open_shift,
        'assignments': assignments,
        'kids': kids,
        'pendingAssignmentId': pending_assignment_id(shift),
        'durationHours': shift.duration_hours,
    }
