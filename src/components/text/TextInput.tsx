"use client";

interface TextInputProps {
  title: string;
  body: string;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  disabled?: boolean;
}

export function TextInput({ title, body, onTitleChange, onBodyChange, disabled }: TextInputProps) {
  return (
    <div className="space-y-3">
      {/* Title field */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Title <span className="font-normal normal-case text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Document title…"
          disabled={disabled}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 disabled:opacity-50"
        />
      </div>

      {/* Body textarea */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Content
        </label>
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Paste or type your text here…"
          disabled={disabled}
          rows={12}
          className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 placeholder-slate-300 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 disabled:opacity-50"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {body.length.toLocaleString()} characters · {body.trim() ? body.trim().split(/\s+/).length.toLocaleString() : 0} words
        </p>
      </div>
    </div>
  );
}
