"use client";

import { useCallback, useEffect, useState } from "react";
import { checkAndConsume, grantCredits as grantCreditsStore, loadCredits, type CreditState } from "@/lib/credits/creditStore";

export function useCredits() {
  const [credits, setCredits] = useState<CreditState | null>(null);

  const refresh = useCallback(() => {
    setCredits(loadCredits());
  }, []);

  useEffect(() => {
    refresh();
    // Sync across tabs
    const handler = (e: StorageEvent) => {
      if (e.key === "snappdf_credits") refresh();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refresh]);

  const consume = useCallback((): boolean => {
    const ok = checkAndConsume();
    refresh();
    return ok;
  }, [refresh]);

  const grantCredits = useCallback((amount: number) => {
    grantCreditsStore(amount);
    refresh();
  }, [refresh]);

  const totalRemaining = credits ? credits.freeUsesRemaining + credits.paidCredits : 0;
  const canConvert = totalRemaining > 0;

  return { credits, totalRemaining, canConvert, consume, grantCredits, refresh };
}
