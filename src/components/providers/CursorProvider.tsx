"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CursorVariant } from "@/types";

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextValue>({
  variant: "default",
  setVariant: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
