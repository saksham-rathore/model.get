import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  note: string;
  children?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  note,
  children,
}: StatCardProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-[2rem] font-bold leading-none tracking-tight text-white tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-400">{note}</p>
      {children}
    </div>
  );
}

export function ProgressBar({
  percent,
  color = "bg-brand",
}: {
  percent: number;
  color?: string;
}): React.JSX.Element {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-white/10"
      role="presentation"
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
