"use client";

import { useCallback, useState } from "react";
import { useCredits } from "./useCredits";

export function usePaywall() {
  const [modalOpen, setModalOpen] = useState(false);
  const { consume, grantCredits, totalRemaining, canConvert, credits, refresh } = useCredits();

  /**
   * Attempts to consume a credit. If none available, opens paywall modal.
   * Returns true if a credit was consumed (caller should proceed).
   * Returns false if paywall opened (caller should wait).
   */
  const requestConversion = useCallback((): boolean => {
    const ok = consume();
    if (!ok) {
      setModalOpen(true);
    }
    return ok;
  }, [consume]);

  const handlePurchaseSuccess = useCallback(() => {
    grantCredits(50);
    setModalOpen(false);
  }, [grantCredits]);

  return {
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    requestConversion,
    handlePurchaseSuccess,
    totalRemaining,
    canConvert,
    credits,
    refreshCredits: refresh,
  };
}
