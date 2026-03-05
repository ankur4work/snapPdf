"use client";

import { useCallback, useRef, useState } from "react";

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp"];

function filterFiles(files: FileList | File[]): File[] {
  return Array.from(files).filter((f) => ACCEPTED_TYPES.includes(f.type.toLowerCase()));
}

export function ImageDropzone({ onFilesAdded, disabled }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = filterFiles(e.dataTransfer.files);
      if (files.length) onFilesAdded(files);
    },
    [onFilesAdded, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = filterFiles(e.target.files || []);
      if (files.length) onFilesAdded(files);
      e.target.value = "";
    },
    [onFilesAdded]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={[
        "dropzone-border relative flex flex-col items-center justify-center gap-4 rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer select-none overflow-hidden",
        isDragging ? "dragging bg-violet-50/80 scale-[1.01]" : "bg-gray-50/80 hover:bg-violet-50/40",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      ].join(" ")}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload images"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Shimmer overlay on drag */}
      {isDragging && <div className="shimmer absolute inset-0 pointer-events-none" />}

      {/* Icon */}
      <div className={[
        "relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-transform duration-300",
        isDragging
          ? "bg-violet-600 scale-110"
          : "bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:scale-110",
      ].join(" ")}>
        <svg
          className={["h-8 w-8 transition-colors", isDragging ? "text-white" : "text-violet-600"].join(" ")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <p className={["text-base font-semibold transition-colors", isDragging ? "text-violet-700" : "text-slate-700"].join(" ")}>
          {isDragging ? "Release to add images" : "Drag & drop images here"}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          or{" "}
          <span className="font-medium text-violet-600 underline underline-offset-2 decoration-dotted">
            click to browse
          </span>
          {" "}· PNG, JPG, WEBP, GIF, BMP
        </p>
      </div>

      {/* Format badges */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {["PNG", "JPG", "WEBP", "GIF", "BMP"].map((fmt) => (
          <span
            key={fmt}
            className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}
