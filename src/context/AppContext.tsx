"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations, getTranslation } from "@/lib/i18n";

export type UserRole = "OWNER" | "MEAL_MANAGER" | "MEMBER" | "SUPER_ADMIN" | "GUEST";

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  t: (typeof translations)["en"];
  themeColor: string;
  setThemeColor: (color: string) => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [themeColor, setThemeColor] = useState<string>("#4f46e5");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("messmate_locale", newLocale);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("messmate_locale") as Locale | null;
      if (savedLocale === "en" || savedLocale === "bn") {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const t = getTranslation(locale);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        role,
        setRole,
        t,
        themeColor,
        setThemeColor,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
