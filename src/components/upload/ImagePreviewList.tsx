"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImagePreviewListProps {
  files: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

function FilePreview({ file, index, onRemove, disabled }: {
  file: File;
  index: number;
  onRemove: (i: number) => void;
  disabled?: boolean;
}) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm">
      {url && (
        <Image
          src={url}
          alt={file.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 160px"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      {!disabled && (
        <button
          onClick={() => onRemove(index)}
          className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow"
          aria-label={`Remove ${file.name}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="truncate text-xs text-white">{file.name}</p>
      </div>
    </div>
  );
}

export function ImagePreviewList({ files, onRemove, disabled }: ImagePreviewListProps) {
  if (!files.length) return null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {files.length} image{files.length !== 1 ? "s" : ""} selected
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {files.map((file, i) => (
          <FilePreview key={`${file.name}-${i}`} file={file} index={i} onRemove={onRemove} disabled={disabled} />
        ))}
      </div>
    </div>
  );
}
