"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageDropzone } from "./upload/ImageDropzone";
import { ImagePreviewList } from "./upload/ImagePreviewList";
import { ProcessButton } from "./processing/ProcessButton";
import { OcrProgressBar } from "./processing/OcrProgressBar";
import { ProcessingStatus } from "./processing/ProcessingStatus";
import { DownloadButton } from "./pdf/DownloadButton";
import { TextInput } from "./text/TextInput";
import { CreditBadge } from "./paypal/CreditBadge";
import { PaywallModal } from "./paypal/PaywallModal";
import { ErrorBanner } from "./ui/ErrorBanner";
import { Button } from "./ui/Button";
import { useOcrPipeline } from "@/lib/hooks/useOcrPipeline";
import { useTextPipeline } from "@/lib/hooks/useTextPipeline";
import { usePaywall } from "@/lib/hooks/usePaywall";

type Mode = "image" | "text";

export function PdfToolClient() {
  const [mode, setMode]   = useState<Mode>("image");

  // ── Image mode state ──────────────────────────────────────────────────────
  const [files, setFiles] = useState<File[]>([]);
  const { state: pipeline, run: runOcr, reset: resetPipeline } = useOcrPipeline();

  // ── Text mode state ───────────────────────────────────────────────────────
  const [textTitle, setTextTitle] = useState("");
  const [textBody,  setTextBody]  = useState("");
  const { state: textPipeline, run: runText, reset: resetText } = useTextPipeline();

  // ── Credits / paywall ────────────────────────────────────────────────────
  const {
    modalOpen, openModal, closeModal,
    requestConversion, handlePurchaseSuccess,
    totalRemaining, credits,
  } = usePaywall();

  // Listen for header button
  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener("snappdf:open-paywall", handler);
    return () => window.removeEventListener("snappdf:open-paywall", handler);
  }, [openModal]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const imgProcessing = pipeline.status === "ocr" || pipeline.status === "generating";
  const imgDone       = pipeline.status === "done";
  const txtGenerating = textPipeline.status === "generating";
  const txtDone       = textPipeline.status === "done";

  // ── Image handlers ────────────────────────────────────────────────────────
  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...newFiles.filter((f) => !existing.has(f.name + f.size))];
    });
    if (pipeline.status !== "idle") resetPipeline();
    // Warm up OCR worker in background so it's ready by the time user clicks Convert
    import("@/lib/ocr/tesseractClient").then(({ warmUpWorker }) => warmUpWorker()).catch(() => {});
  }, [pipeline.status, resetPipeline]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleConvertImages = useCallback(() => {
    if (!files.length) return;
    if (requestConversion()) runOcr(files);
  }, [files, requestConversion, runOcr]);

  const handleResetImages = useCallback(() => {
    setFiles([]); resetPipeline();
  }, [resetPipeline]);

  // ── Text handlers ─────────────────────────────────────────────────────────
  const handleConvertText = useCallback(() => {
    if (!textBody.trim()) return;
    if (requestConversion()) runText(textBody, textTitle);
  }, [textBody, textTitle, requestConversion, runText]);

  const handleResetText = useCallback(() => {
    setTextTitle(""); setTextBody(""); resetText();
  }, [resetText]);

  // ── Switch mode: clear the other mode's state ────────────────────────────
  const handleSetMode = useCallback((m: Mode) => {
    setMode(m);
    if (m === "image") { resetText(); }
    else               { resetPipeline(); }
  }, [resetText, resetPipeline]);

  // ── Download filename ─────────────────────────────────────────────────────
  const imgFileName  = files[0]
    ? files[0].name.replace(/\.[^.]+$/, "") + (files.length > 1 ? `+${files.length - 1}` : "") + ".pdf"
    : "snappdf-output.pdf";
  const txtFileName  = (textTitle.trim() || "text-output") + ".pdf";

  return (
    <div className="fade-in-up fade-in-up-3">
      <div className="card-shadow rounded-3xl bg-white/90 backdrop-blur-sm overflow-hidden">

        {/* ── Card header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-500">SnapPDF Converter</span>
          </div>
          {credits && (
            <CreditBadge totalRemaining={totalRemaining} freeRemaining={credits.freeUsesRemaining} />
          )}
        </div>

        {/* ── Mode tabs ───────────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-100 bg-gray-50/60">
          {([
            { key: "image" as Mode, icon: "🖼️", label: "Images → PDF" },
            { key: "text"  as Mode, icon: "📝", label: "Text → PDF"   },
          ] as const).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleSetMode(key)}
              className={[
                "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
                mode === key
                  ? "border-violet-500 text-violet-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-100/60",
              ].join(" ")}
            >
              <span>{icon}</span>
              {label}
              {key === "text" && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                  Instant
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Card body ───────────────────────────────────────────────────── */}
        <div className="space-y-5 p-6 sm:p-8">

          {/* ── IMAGE MODE ──────────────────────────────────────────────── */}
          {mode === "image" && (
            <>
              {!imgDone && (
                <ImageDropzone onFilesAdded={handleFilesAdded} disabled={imgProcessing} />
              )}
              {files.length > 0 && !imgDone && (
                <ImagePreviewList files={files} onRemove={handleRemoveFile} disabled={imgProcessing} />
              )}
              {pipeline.status === "ocr" && (
                <OcrProgressBar items={pipeline.perImageProgress} />
              )}
              <ProcessingStatus status={pipeline.status} imageCount={files.length} />
              {pipeline.status === "error" && (
                <ErrorBanner message={pipeline.error} onDismiss={() => resetPipeline()} />
              )}
              {imgDone && <SuccessCard count={files.length} type="image" />}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!imgDone
                  ? <ProcessButton onClick={handleConvertImages} status={pipeline.status} fileCount={files.length} />
                  : <>
                      <DownloadButton pdfBytes={pipeline.pdfBytes} fileName={imgFileName} />
                      <Button variant="ghost" onClick={handleResetImages} className="gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Convert More
                      </Button>
                    </>
                }
              </div>
            </>
          )}

          {/* ── TEXT MODE ───────────────────────────────────────────────── */}
          {mode === "text" && (
            <>
              {!txtDone && (
                <TextInput
                  title={textTitle}
                  body={textBody}
                  onTitleChange={setTextTitle}
                  onBodyChange={setTextBody}
                  disabled={txtGenerating}
                />
              )}
              {textPipeline.status === "error" && (
                <ErrorBanner message={textPipeline.error} onDismiss={resetText} />
              )}
              {txtDone && <SuccessCard count={textBody.trim().split(/\s+/).length} type="text" />}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!txtDone
                  ? <Button
                      onClick={handleConvertText}
                      disabled={txtGenerating || !textBody.trim()}
                      loading={txtGenerating}
                      className="px-7 py-3 text-base"
                    >
                      {!txtGenerating && (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {txtGenerating ? "Generating PDF…" : "Convert Text to PDF"}
                    </Button>
                  : <>
                      <DownloadButton pdfBytes={textPipeline.pdfBytes} fileName={txtFileName} />
                      <Button variant="ghost" onClick={handleResetText} className="gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Convert More
                      </Button>
                    </>
                }
              </div>
            </>
          )}
        </div>

        {/* ── Card footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 border-t border-gray-100 bg-gray-50/60 px-6 py-3">
          {[
            { icon: "🔒", text: "Private" },
            { icon: "⚡", text: "Client-side" },
            { icon: "🆓", text: "2 free tries" },
          ].map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1 text-xs text-gray-400">
              <span>{icon}</span> {text}
            </span>
          ))}
        </div>
      </div>

      <PaywallModal open={modalOpen} onClose={closeModal} onPurchaseSuccess={handlePurchaseSuccess} />
    </div>
  );
}

// ── Shared success card ───────────────────────────────────────────────────────
function SuccessCard({ count, type }: { count: number; type: "image" | "text" }) {
  const msg = type === "image"
    ? `${count} image${count !== 1 ? "s" : ""} converted · Fully OCR-searchable`
    : `${count.toLocaleString()} words converted · Ready to download`;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
        <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="font-semibold text-emerald-800">Your PDF is ready!</p>
      <p className="mt-1 text-sm text-emerald-600">{msg}</p>
    </div>
  );
}
