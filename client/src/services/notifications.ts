import api from '../utils/api';

export const registerPushToken = (token: string, staffId: string) =>
  api.post('/notifications/register', { staff_id: staffId, token });

export const sendAssignmentAlert = (assignmentId: string) =>
  api.post(`/notifications/assignment/${assignmentId}`);
