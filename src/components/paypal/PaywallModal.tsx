"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PayPalButtonWrapper } from "./PayPalButtonWrapper";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

export function PaywallModal({ open, onClose, onPurchaseSuccess }: PaywallModalProps) {
  const [paypalError, setPaypalError] = useState<string | null>(null);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
            <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Get More Conversions</h2>
          <p className="mt-1 text-sm text-slate-500">You&apos;ve used your free tries. Grab a credit pack!</p>
        </div>

        {/* Price card */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-center text-white shadow-lg shadow-violet-200">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">$5</span>
              <span className="text-violet-200 text-sm font-medium">one-time</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-violet-100">50 conversion credits</p>
            <p className="mt-1.5 text-sm text-violet-200">No subscription · Never expires · Stored in your browser</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {[
            "Your images never leave your browser",
            "Fully searchable & copy-pasteable PDFs",
            "PNG, JPG, WEBP, GIF, BMP support",
            "Multi-image batches per conversion",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {f}
            </li>
          ))}
        </ul>

        <ErrorBanner message={paypalError} onDismiss={() => setPaypalError(null)} />

        {/* PayPal Buttons */}
        <div id="pricing">
          <PayPalButtonWrapper
            onSuccess={() => { setPaypalError(null); onPurchaseSuccess(); }}
            onError={setPaypalError}
          />
        </div>

        <p className="text-center text-xs text-slate-400">
          🔒 Secure checkout via PayPal · Credits stored locally
        </p>
      </div>
    </Modal>
  );
}
