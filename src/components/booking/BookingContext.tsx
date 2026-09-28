"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type BookingPrefill = {
  goal?: string;
  lessonType?: string;
};

type BookingState = {
  open: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
};

const Ctx = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const openBooking = useCallback((next: BookingPrefill = {}) => {
    setPrefill(next);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, prefill, openBooking, closeBooking }),
    [open, prefill, openBooking, closeBooking],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking musi być użyte wewnątrz BookingProvider");
  return ctx;
}
