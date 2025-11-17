ROLES = [
    'Owner_admin',
    'Admin',
    'Staff',
    'Driver',
    'Trainer',
    'Assistant Lead',
    'Lead',
    'Residence Manager',
    'Assistant Program Director',
    'Director',
]

ROLE_PERMISSIONS = {
    'Owner_admin': {'manage': True, 'schedule': True},
    'Admin': {'manage': True, 'schedule': True},
    'Director': {'manage': False, 'schedule': True},
    'Lead': {'manage': False, 'schedule': True},
    'Trainer': {'manage': False, 'schedule': True},
    'Residence Manager': {'manage': False, 'schedule': True},
    'Staff': {'manage': False, 'schedule': True},
    'Driver': {'manage': False, 'schedule': False},
    'Assistant Lead': {'manage': False, 'schedule': True},
    'Assistant Program Director': {'manage': True, 'schedule': True},
}

def has_permission(role: str, permission: str) -> bool:
    return ROLE_PERMISSIONS.get(role, {}).get(permission, False)
