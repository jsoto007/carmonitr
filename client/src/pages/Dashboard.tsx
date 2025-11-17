import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccountContext } from '../context/AccountContext';
import api from '../utils/api';
import { useScheduleStore } from '../stores/scheduleStore';
import { useGeofence } from '../hooks/useGeofence';
import { ShiftEvent } from '../types';
import { StatusChip } from '../components/StatusChip';
import { TeamManager } from '../components/TeamManager';

const fetchShifts = (accountId: string) =>
  api
    .get<ShiftEvent[]>('/shifts', { params: { account_id: accountId, expand: 'assignments,kids' } })
    .then((res) => res.data);

export const Dashboard = () => {
  const { selectedAccount } = useAccountContext();
  const { setShifts, setAssignments, setKids } = useScheduleStore();

  const { data: shifts = [], isLoading } = useQuery(['shifts', selectedAccount.id], () => fetchShifts(selectedAccount.id), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setShifts(data);
      const assignments = data.flatMap((shift) => shift.assignments ?? []);
      setAssignments(assignments);
      const kids = assignments.flatMap((assignment) => assignment.kids ?? []);
      setKids(kids);
    },
  });

  const stats = useMemo(() => {
    const totalShifts = shifts.length;
    const totalKids = shifts.reduce((count, shift) => count + (shift.kids?.length ?? 0), 0);
    const ratioMet = shifts.filter((shift) => shift.assignments.length >= (shift.ratio_min ?? 1)).length;
    return { totalShifts, totalKids, ratioMet };
  }, [shifts]);

  const simulatedLat = selectedAccount.geofence.lat + 0.0002;
  const simulatedLon = selectedAccount.geofence.lon + 0.0007;
  const { isOnSite, reason } = useGeofence(simulatedLat, simulatedLon);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">{selectedAccount.name}</p>
          <h1 className="text-3xl font-semibold text-white">Staff overview</h1>
        </div>
        <StatusChip label={isLoading ? 'Syncing' : 'Live'} color={isLoading ? '#fbbf24' : '#16a34a'} />
      </div>

    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <p className="text-sm text-slate-500">Scheduled shifts</p>
        <p className="text-4xl font-bold text-white">{stats.totalShifts}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-600">adjustable ratio per shift</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <p className="text-sm text-slate-500">Assignments / kids</p>
        <p className="text-4xl font-bold text-white">{stats.totalKids}</p>
        <p className="text-xs font-light text-slate-500">balanced across {shifts.length || 1} shifts</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <p className="text-sm text-slate-500">Ratio-compliant shifts</p>
        <p className="text-4xl font-bold text-white">{stats.ratioMet}</p>
        <p className="text-xs text-slate-500">admin-adjustable minimum per shift</p>
      </div>
    </div>
    <div className="mt-6 rounded-2xl border border-dashed border-slate-800/40 p-5 text-sm text-slate-300">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Geofence</p>
      <p className="text-lg font-semibold text-white">{isOnSite ? 'On site (assignments visible)' : 'Geofence locked'}</p>
      <p className="text-xs text-slate-500">{reason}</p>
    </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Active site shifts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {shifts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800/40 p-4 text-slate-500">
              No shifts found yet. Use the calendar tab to schedule and broadcast open shifts.
            </div>
          )}
          {shifts.map((shift) => (
            <article key={shift.id} className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{shift.site}</p>
                <StatusChip label={shift.is_special ? 'Special' : 'Regular'} color={shift.is_special ? '#14b8a6' : '#6366f1'} />
              </div>
              <div className="mt-3">
                <p className="text-lg font-semibold text-white">
                  {new Date(shift.start_time).toLocaleString()} – {new Date(shift.end_time).toLocaleTimeString()}
                </p>
                <p className="text-sm text-slate-400">
                  Role: {shift.role} · Ratio min: {shift.ratio_min ?? 1}
                </p>
                <p className="text-sm text-slate-400">Assignments: {shift.assignments.length}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <TeamManager />
    </section>
  );
};
