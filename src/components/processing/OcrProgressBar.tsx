"use client";

import type { PerImageProgress } from "@/lib/hooks/useOcrPipeline";

interface OcrProgressBarProps {
  items: PerImageProgress[];
}

export function OcrProgressBar({ items }: OcrProgressBarProps) {
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 space-y-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-600">
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        OCR in progress
      </p>
      {items.map((item) => (
        <div key={item.index}>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="max-w-[200px] truncate font-medium text-slate-600">{item.fileName}</span>
            <span className="tabular-nums font-semibold text-violet-600">{item.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full progress-gradient transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
