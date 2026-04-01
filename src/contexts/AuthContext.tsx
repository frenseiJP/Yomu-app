"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Region } from "@/src/utils/region/region";
import {
  REGION_COOKIE_KEY,
  REGION_STORAGE_KEY,
  normalizeRegion,
} from "@/src/utils/region/region";
import { useSearchParams } from "next/navigation";

type AuthContextValue = {
  region: Region;
  setRegion: (r: Region) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(target));
  if (!found) return null;
  return decodeURIComponent(found.slice(target.length));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("East Asia");
  const searchParams = useSearchParams();
  const regionFromQuery = searchParams.get("region");

  useEffect(() => {
    const local = (() => {
      try {
        return window.localStorage.getItem(REGION_STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const cookie = readCookie(REGION_COOKIE_KEY);

    // 保存後の追従のため、cookie を優先して反映する
    const next = normalizeRegion(cookie ?? local);
    setRegionState(next);
    try {
      window.localStorage.setItem(REGION_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!regionFromQuery) return;
    const next = normalizeRegion(regionFromQuery);
    setRegionState(next);
    try {
      window.localStorage.setItem(REGION_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, [regionFromQuery]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REGION_STORAGE_KEY, region);
    } catch {
      // ignore
    }
  }, [region]);

  const value = useMemo<AuthContextValue>(
    () => ({
      region,
      setRegion: setRegionState,
    }),
    [region],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

