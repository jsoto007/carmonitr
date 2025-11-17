import { type ShiftEvent } from '../types';

export function optimisticShiftUpdate(
  previous: ShiftEvent[],
  draft: ShiftEvent,
): ShiftEvent[] {
  const index = previous.findIndex((shift) => shift.id === draft.id);
  if (index > -1) {
    const updated = [...previous];
    updated[index] = { ...updated[index], ...draft };
    return updated;
  }
  return [...previous, draft];
}

export function rollbackToPrevious(
  setter: (value: ShiftEvent[]) => void,
  previous: ShiftEvent[] | undefined,
) {
  if (previous) {
    setter(previous);
  }
}
