"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface AdminContextValue {
  theme: Theme;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const AdminContext = createContext<AdminContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("aurelia-admin-theme") as Theme | null;
    const storedCollapsed = localStorage.getItem("aurelia-admin-sidebar");
    if (storedTheme) setTheme(storedTheme);
    if (storedCollapsed !== null) setSidebarCollapsed(storedCollapsed === "true");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("aurelia-admin-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("aurelia-admin-sidebar", String(sidebarCollapsed));
  }, [sidebarCollapsed, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AdminContext.Provider value={{ theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed }}>
      <div data-admin-theme={theme} className="admin-root h-full">
        {children}
      </div>
    </AdminContext.Provider>
  );
}
