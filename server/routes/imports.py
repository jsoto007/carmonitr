import csv
from io import StringIO
from typing import Sequence

from flask import Blueprint, jsonify, request

from ..services.notifications import send_email

imports_bp = Blueprint('imports', __name__)

SUPPORTED_ENTITIES = {'staff', 'kids', 'assignments'}

@imports_bp.route('/imports/<entity>', methods=['POST'])
def import_entity(entity: str):
    if entity not in SUPPORTED_ENTITIES:
        return jsonify({'error': 'Unsupported entity'}), 400
    data = request.get_data(as_text=True)
    if not data:
        return jsonify({'error': 'payload required'}), 400
    reader = csv.DictReader(StringIO(data))
    preview: list[dict] = []
    errors: list[str] = []
    rows = list(reader)
    for index, row in enumerate(rows[:5], start=1):
        preview.append(row)
    for index, row in enumerate(rows, start=1):
        if entity == 'staff':
            if not row.get('email') or not row.get('full_name'):
                errors.append(f'Row {index} invalid: missing email or name')
            else:
                send_email(row['email'], 'shift_update', {'preview': True})
        if entity == 'kids':
            if not row.get('name'):
                errors.append(f'Row {index} invalid: missing kid name')
        if entity == 'assignments':
            if not row.get('shift_id'):
                errors.append(f'Row {index} invalid: missing shift_id')
    result = {'rows': len(rows), 'preview': preview, 'errors': errors}
    if errors:
        return jsonify(result), 422
    return jsonify(result)

@imports_bp.route('/exports/<entity>', methods=['GET'])
def export_entity(entity: str):
    if entity not in {'staff', 'kids'}:
        return jsonify({'error': 'Unsupported entity'}), 400
    fields: Sequence[str] = request.args.get('fields', 'id,name,role').split(',')
    return jsonify({'entity': entity, 'fields': fields, 'format': 'csv', 'timestamp': request.args.get('timestamp')})
