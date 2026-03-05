"use client";

interface CreditBadgeProps {
  totalRemaining: number;
  freeRemaining: number;
}

export function CreditBadge({ totalRemaining, freeRemaining }: CreditBadgeProps) {
  const isFree = freeRemaining > 0;
  const isEmpty = totalRemaining === 0;

  if (isEmpty) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        No credits left
      </div>
    );
  }

  if (isFree) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
        <span className="flex h-1.5 w-1.5 rounded-full bg-violet-500">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-violet-400 opacity-75" />
        </span>
        {totalRemaining} free {totalRemaining === 1 ? "try" : "tries"} left
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      {totalRemaining} credit{totalRemaining !== 1 ? "s" : ""}
    </div>
  );
}
