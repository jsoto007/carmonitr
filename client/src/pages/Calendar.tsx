import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAccountContext } from '../context/AccountContext';
import { useScheduleStore } from '../stores/scheduleStore';
import { StatusChip } from '../components/StatusChip';
import api from '../utils/api';
import { optimisticShiftUpdate, rollbackToPrevious } from '../utils/optimistic';
import type { ShiftEvent } from '../types';

export const CalendarPage = () => {
  const { selectedAccount } = useAccountContext();
  const { shifts, setShifts } = useScheduleStore();

  const groupedByDay = useMemo<Record<string, ShiftEvent[]>>(() => {
    return shifts.reduce<Record<string, ShiftEvent[]>>((acc, shift) => {
      const day = new Date(shift.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      acc[day] = acc[day] ? [...acc[day], shift] : [shift];
      return acc;
    }, {});
  }, [shifts]);

  const ratioMutation = useMutation(
    ({ shiftId, ratio }: { shiftId: string; ratio: number }) => api.patch(`/shifts/${shiftId}`, { ratio_min: ratio }),
    {
      onMutate({ shiftId, ratio }) {
        const previous = shifts;
        const updated = optimisticShiftUpdate(shifts, { id: shiftId, ratio_min: ratio } as ShiftEvent);
        setShifts(updated);
        return previous;
      },
      onError(_, __, previous) {
        rollbackToPrevious(setShifts, previous);
      },
    },
  );

  const handleRatio = (shift: ShiftEvent) => {
    ratioMutation.mutate({ shiftId: shift.id, ratio: (shift.ratio_min ?? 1) + 1 });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">{selectedAccount.name}</p>
          <h1 className="text-3xl font-semibold text-white">Calendar</h1>
          <p className="text-sm text-slate-400">Daily, weekly, and monthly schedule control</p>
        </div>
        <button className="rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2 text-sm font-semibold text-white">
          New shift
        </button>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedByDay).map(([day, dayShifts]) => (
          <div key={day} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{day}</h2>
              <StatusChip label={`${dayShifts.length} shifts`} color="#4ade80" />
            </div>
            <div className="mt-4 space-y-3">
              {dayShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm text-slate-400">
                      {shift.site} · {shift.role} · Ratio {shift.ratio_min ?? 1}
                    </div>
                    <p className="text-base font-semibold text-white">
                      {new Date(shift.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} –
                      {new Date(shift.end_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-full border border-slate-800 px-3 py-1 text-xs uppercase tracking-[0.4em] text-slate-400 hover:border-slate-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleRatio(shift)}
                      className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-emerald-200"
                    >
                      Increase ratio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {shifts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800/40 p-6 text-center text-sm text-slate-500">
            Schedule your first shift to unlock ratio enforcement, open shift broadcasting, and assignment balancing.
          </div>
        )}
      </div>
    </section>
  );
};
