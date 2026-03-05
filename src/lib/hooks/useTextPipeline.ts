"use client";

import { useCallback, useState } from "react";

export type TextPipelineStatus = "idle" | "generating" | "done" | "error";

interface TextPipelineState {
  status: TextPipelineStatus;
  pdfBytes: Uint8Array | null;
  error: string | null;
}

export function useTextPipeline() {
  const [state, setState] = useState<TextPipelineState>({
    status: "idle",
    pdfBytes: null,
    error: null,
  });

  const run = useCallback(async (text: string, title?: string) => {
    if (!text.trim()) return;
    setState({ status: "generating", pdfBytes: null, error: null });
    try {
      const { buildTextPdf } = await import("@/lib/pdf/textPdfGenerator");
      const pdfBytes = await buildTextPdf(text, title);
      setState({ status: "done", pdfBytes, error: null });
    } catch (err) {
      setState({ status: "error", pdfBytes: null, error: err instanceof Error ? err.message : "Failed to generate PDF" });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", pdfBytes: null, error: null });
  }, []);

  return { state, run, reset };
}
