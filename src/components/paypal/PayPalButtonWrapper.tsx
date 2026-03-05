"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalButtonWrapperProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const IS_DEV_MODE =
  !clientId ||
  clientId === "test" ||
  clientId.startsWith("YOUR_");

/** Shown while the PayPal SDK script is loading */
function LoadingButtons() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-11 w-full rounded-lg bg-gray-200" />
      <div className="h-11 w-full rounded-lg bg-gray-100" />
    </div>
  );
}

/** Real PayPal buttons — only rendered when SDK is ready */
function RealPayPalButtons({ onSuccess, onError }: PayPalButtonWrapperProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) return <LoadingButtons />;

  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
      createOrder={async () => {
        const res = await fetch("/api/paypal/create-order", { method: "POST" });
        const data = await res.json();
        if (!res.ok || !data.id) {
          throw new Error(data.error || "Failed to create PayPal order");
        }
        return data.id;
      }}
      onApprove={async (data) => {
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await res.json();
          if (!res.ok || result.status !== "COMPLETED") {
            throw new Error(result.error || "Payment not completed");
          }
          onSuccess();
        } catch (err) {
          onError(err instanceof Error ? err.message : "Payment failed");
        }
      }}
      onError={(err) => {
        console.error("PayPal SDK error:", err);
        onError("PayPal encountered an error. Please try again.");
      }}
    />
  );
}

/** Dev-mode fallback — simulates a successful purchase without hitting PayPal */
function DevModeButton({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <p className="font-semibold">⚠ Dev mode — PayPal not configured</p>
        <p className="mt-0.5 text-amber-600">
          Add real credentials to <code className="rounded bg-amber-100 px-1">.env.local</code> to enable live payments.
          The button below simulates a successful purchase for testing.
        </p>
      </div>
      <button
        onClick={onSuccess}
        className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 py-3 text-sm font-bold text-amber-900 shadow-md shadow-amber-200/60 transition-all hover:from-amber-500 hover:to-yellow-500 active:scale-[0.98]"
      >
        🧪 Simulate Purchase (Dev Mode)
      </button>
    </div>
  );
}

export function PayPalButtonWrapper({ onSuccess, onError }: PayPalButtonWrapperProps) {
  if (IS_DEV_MODE) {
    return <DevModeButton onSuccess={onSuccess} />;
  }
  return <RealPayPalButtons onSuccess={onSuccess} onError={onError} />;
}
