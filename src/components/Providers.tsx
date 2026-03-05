"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const IS_DEV_MODE =
  !clientId ||
  clientId === "test" ||
  clientId.startsWith("YOUR_");

// In dev mode use PayPal's own "test" ID — SDK loads but doesn't require real credentials
const RESOLVED_CLIENT_ID = IS_DEV_MODE ? "test" : clientId;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: RESOLVED_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        // Don't auto-load the SDK script when in dev mode — avoids noisy console errors
        ...(IS_DEV_MODE && { "data-sdk-integration-source": "developer-studio" }),
      }}
      deferLoading={IS_DEV_MODE}
    >
      {children}
    </PayPalScriptProvider>
  );
}
