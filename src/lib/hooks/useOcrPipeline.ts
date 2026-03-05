"use client";

import { useCallback, useRef, useState } from "react";
import type { OcrResult } from "@/lib/ocr/tesseractClient";

export type PipelineStatus = "idle" | "ocr" | "generating" | "done" | "error";

export interface PerImageProgress {
  index: number;
  progress: number; // 0–100
  fileName: string;
}

export interface PipelineState {
  status: PipelineStatus;
  perImageProgress: PerImageProgress[];
  pdfBytes: Uint8Array | null;
  error: string | null;
}

export function useOcrPipeline() {
  const [state, setState] = useState<PipelineState>({
    status: "idle",
    perImageProgress: [],
    pdfBytes: null,
    error: null,
  });

  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = false;
    setState({ status: "idle", perImageProgress: [], pdfBytes: null, error: null });
  }, []);

  const run = useCallback(async (files: File[]) => {
    if (!files.length) return;
    abortRef.current = false;

    setState({
      status: "ocr",
      perImageProgress: files.map((f, i) => ({ index: i, progress: 0, fileName: f.name })),
      pdfBytes: null,
      error: null,
    });

    try {
      const { runOcr, warmUpWorker } = await import("@/lib/ocr/tesseractClient");
      warmUpWorker(); // ensure worker is warming up (no-op if already started)
      const results: OcrResult[] = [];

      for (let i = 0; i < files.length; i++) {
        if (abortRef.current) return;

        const file = files[i];
        const result = await runOcr(file, (progress) => {
          setState((prev) => {
            const updated = [...prev.perImageProgress];
            updated[i] = { ...updated[i], progress };
            return { ...prev, perImageProgress: updated };
          });
        });

        results.push(result);

        // Mark image as 100% done
        setState((prev) => {
          const updated = [...prev.perImageProgress];
          updated[i] = { ...updated[i], progress: 100 };
          return { ...prev, perImageProgress: updated };
        });
      }

      if (abortRef.current) return;

      setState((prev) => ({ ...prev, status: "generating" }));

      const { buildPdf } = await import("@/lib/pdf/pdfGenerator");
      const pdfBytes = await buildPdf(files, results);

      if (abortRef.current) return;

      setState({ status: "done", perImageProgress: state.perImageProgress, pdfBytes, error: null });
    } catch (err) {
      console.error("Pipeline error:", err);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "An unexpected error occurred.",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abort = useCallback(() => {
    abortRef.current = true;
    setState((prev) => ({ ...prev, status: "idle" }));
  }, []);

  return { state, run, reset, abort };
}
