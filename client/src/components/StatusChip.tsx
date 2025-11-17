export const StatusChip = ({ label, color }: { label: string; color: string }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: color }}>
    {label}
  </span>
);
