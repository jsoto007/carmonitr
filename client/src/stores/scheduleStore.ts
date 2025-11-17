import { create } from 'zustand';
import type { Assignment, KidDetails, ShiftEvent } from '../types';

interface ScheduleState {
  shifts: ShiftEvent[];
  openShifts: ShiftEvent[];
  kids: KidDetails[];
  assignments: Assignment[];
  setShifts: (shiftPayload: ShiftEvent[]) => void;
  appendShift: (shift: ShiftEvent) => void;
  setOpenShifts: (shifts: ShiftEvent[]) => void;
  removeOpenShift: (id: string) => void;
  setKids: (kids: KidDetails[]) => void;
  setAssignments: (assignments: Assignment[]) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  shifts: [],
  openShifts: [],
  kids: [],
  assignments: [],
  setShifts: (shiftPayload) => set({ shifts: shiftPayload }),
  appendShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),
  setOpenShifts: (shifts) => set({ openShifts: shifts }),
  removeOpenShift: (id) => set((state) => ({ openShifts: state.openShifts.filter((shift) => shift.id !== id) })),
  setKids: (kids) => set({ kids }),
  setAssignments: (assignments) => set({ assignments }),
}));
