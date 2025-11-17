import logging
from datetime import datetime

LOG = logging.getLogger('staffmonitr.notifications')

EMAIL_SUBJECTS = {
    'shift_update': 'Shift update alert',
    'assignment_change': 'Assignment change',
    'open_shift': 'Open shift offered',
}


def send_email(recipient: str, subject_key: str, payload: dict) -> None:
    subject = EMAIL_SUBJECTS.get(subject_key, 'Staffmonitr notification')
    LOG.info('Sending email to %s | %s | payload=%s', recipient, subject, payload)


def notify_shift_change(staff_email: str, shift_id: str) -> None:
    send_email(staff_email, 'shift_update', {'shift_id': shift_id, 'timestamp': datetime.utcnow().isoformat()})


def notify_assignment_change(staff_email: str, assignment_id: str) -> None:
    send_email(staff_email, 'assignment_change', {'assignment_id': assignment_id, 'timestamp': datetime.utcnow().isoformat()})


def broadcast_open_shift(open_shift_id: str, audience: list[str]) -> None:
    for recipient in audience:
        send_email(recipient, 'open_shift', {'shift_id': open_shift_id})
