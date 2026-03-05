"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/Button";

interface DownloadButtonProps {
  pdfBytes: Uint8Array | null;
  fileName?: string;
}

export function DownloadButton({ pdfBytes, fileName = "snappdf-output.pdf" }: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [pdfBytes, fileName]);

  if (!pdfBytes) return null;

  return (
    <Button
      variant="success"
      onClick={handleDownload}
      className="px-7 py-3 text-base"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PDF
    </Button>
  );
}
