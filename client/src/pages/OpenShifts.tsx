import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useScheduleStore } from '../stores/scheduleStore';

const fetchOpenShifts = () => api.get('/assignments/open').then((res) => res.data);

export const OpenShiftsPage = () => {
  const { setOpenShifts, removeOpenShift } = useScheduleStore();

  const { data: openShifts = [] } = useQuery(['open-shifts'], fetchOpenShifts, {
    onSuccess(data) {
      setOpenShifts(data);
    },
  });

  const defaultStaffId = import.meta.env.VITE_DEFAULT_STAFF_ID;
  const requestShift = useMutation(
    ({ shiftId, assignmentId }: { shiftId: string; assignmentId: string }) =>
      api.post(`/assignments/${assignmentId}/request`, defaultStaffId ? { staff_id: defaultStaffId } : {}),
    {
      onSuccess(_, variables) {
        removeOpenShift(variables.shiftId);
      },
    },
  );

  const availableGroups = useMemo(() => new Set(openShifts.map((shift) => shift.site)), [openShifts]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Open shifts</p>
          <h1 className="text-3xl font-semibold text-white">Request to fill</h1>
        </div>
      </div>
      <p className="text-sm text-slate-400">Admins broadcast qualified shifts, staff send requests, and approvals happen in the portal.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {openShifts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800/40 p-6 text-sm text-slate-500">
            No open shifts right now. Admins can broadcast from the calendar view.
          </div>
        )}
        {openShifts.map((shift) => (
          <article key={shift.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{shift.site}</p>
              <p className="text-xs text-emerald-400">Ratio {shift.ratio_min}</p>
            </div>
            <p className="text-base font-semibold text-white">
              {new Date(shift.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} –
              {new Date(shift.end_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>
            <p className="text-sm text-slate-400">Role required: {shift.role}</p>
            {shift.assignments[0] && (
              <p className="text-xs text-slate-500">
                Assignment: {shift.assignments[0].title} · Difficulty {shift.assignments[0].difficulty}
              </p>
            )}
            <p className="text-xs text-slate-400">Assignments: {shift.assignments.length}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                disabled={!shift.pendingAssignmentId}
                onClick={() =>
                  shift.pendingAssignmentId &&
                  requestShift.mutate({ shiftId: shift.id, assignmentId: shift.pendingAssignmentId })
                }
                className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {shift.pendingAssignmentId ? 'Request this shift' : 'No open spot'}
              </button>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                {shift.assignments.length} assignment{shift.assignments.length === 1 ? '' : 's'}
              </p>
            </div>
          </article>
        ))}
      </div>

      {availableGroups.size > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
          Broadcast targeted open shifts to {availableGroups.size} site(s) with ratio/role filters to limit notifications.
        </div>
      )}
    </section>
  );
};
