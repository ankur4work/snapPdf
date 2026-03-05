const STORAGE_KEY = "snappdf_credits";
const SCHEMA_VERSION = 1;

export interface CreditState {
  freeUsesRemaining: number;
  paidCredits: number;
  totalConversions: number;
  lastUpdated: string;
  schemaVersion: number;
}

function defaultState(): CreditState {
  return {
    freeUsesRemaining: 2,
    paidCredits: 0,
    totalConversions: 0,
    lastUpdated: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
  };
}

export function loadCredits(): CreditState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as CreditState;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      // migrate: reset to defaults but preserve totalConversions if present
      const fresh = defaultState();
      if (typeof parsed.totalConversions === "number") {
        fresh.totalConversions = parsed.totalConversions;
      }
      saveCredits(fresh);
      return fresh;
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveCredits(state: CreditState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: new Date().toISOString() }));
  } catch {
    // localStorage unavailable (private browsing quota exceeded etc.)
  }
}

/**
 * Attempts to consume one credit (free first, then paid).
 * Returns true if successful, false if no credits remain.
 */
export function checkAndConsume(): boolean {
  const state = loadCredits();
  if (state.freeUsesRemaining > 0) {
    saveCredits({ ...state, freeUsesRemaining: state.freeUsesRemaining - 1, totalConversions: state.totalConversions + 1 });
    return true;
  }
  if (state.paidCredits > 0) {
    saveCredits({ ...state, paidCredits: state.paidCredits - 1, totalConversions: state.totalConversions + 1 });
    return true;
  }
  return false;
}

/**
 * Grants paid credits after a successful PayPal purchase.
 */
export function grantCredits(amount: number): void {
  const state = loadCredits();
  saveCredits({ ...state, paidCredits: state.paidCredits + amount });
}

export function getTotalRemaining(): number {
  const state = loadCredits();
  return state.freeUsesRemaining + state.paidCredits;
}
