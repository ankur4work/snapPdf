"use client";

import type { PipelineStatus } from "@/lib/hooks/useOcrPipeline";

interface ProcessingStatusProps {
  status: PipelineStatus;
  imageCount: number;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  if (status === "idle" || status === "error" || status === "done") return null;

  const config = {
    ocr: {
      bg: "bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-100",
      text: "text-violet-700",
      label: "Extracting text with OCR…",
      sublabel: "This may take a moment for large images",
    },
    generating: {
      bg: "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100",
      text: "text-indigo-700",
      label: "Building your PDF…",
      sublabel: "Embedding images and text layer",
    },
  }[status];

  if (!config) return null;

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${config.bg}`}>
      <div className="flex-shrink-0">
        <svg className={`w-5 h-5 animate-spin ${config.text}`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
      <div>
        <p className={`text-sm font-semibold ${config.text}`}>{config.label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{config.sublabel}</p>
      </div>
    </div>
  );
}
