"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, UserRole } from "@/context/AppContext";
import {
  Utensils,
  ShoppingCart,
  CreditCard,
  Building,
  PhoneCall,
  Bell,
  Menu,
  X,
  Languages,
  Shield,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Home,
  LayoutDashboard,
  KeyRound,
  BarChart3,
} from "lucide-react";

export default function Header() {
  const { locale, setLocale, role, setRole, t, toast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/meals", label: t.nav.meals, icon: Utensils },
    { href: "/bazar", label: t.nav.bazar, icon: ShoppingCart },
    { href: "/finance", label: t.nav.finance, icon: CreditCard },
    { href: "/rooms", label: t.nav.rooms, icon: Building },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/emergency", label: t.nav.emergency, icon: PhoneCall },
    { href: "/notices", label: t.nav.notices, icon: Bell },
  ];

  const roleOptions: { role: UserRole; label: string; badge: string }[] = [
    { role: "MEMBER", label: "Kamrul Islam (Member)", badge: "bg-indigo-100 text-indigo-800" },
    { role: "MEAL_MANAGER", label: "Tanvir Hasan (Meal Manager)", badge: "bg-amber-100 text-amber-800" },
    { role: "OWNER", label: "Rahim Ahmed (Mess Admin/Owner)", badge: "bg-emerald-100 text-emerald-800" },
    { role: "SUPER_ADMIN", label: "Platform Super Admin", badge: "bg-purple-100 text-purple-800" },
    { role: "GUEST", label: "Prospective Guest", badge: "bg-gray-100 text-gray-800" },
  ];

  return (
    <>
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-200">
          {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500" />}
          {toast.type === "info" && <Shield className="w-5 h-5 text-indigo-500" />}
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</span>
        </div>
      )}

      {/* Top Banner: Role Simulator & Multi-Tenant Context */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Tenant: Green View Student Mess
          </span>
          <span className="hidden sm:inline text-slate-400">| Farmgate, Dhaka (Subdomain: green-view.messmate.com)</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Switching Simulator */}
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline text-slate-400">View as Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {roleOptions.map((opt) => (
                <option key={opt.role} value={opt.role}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setLocale("en")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                locale === "en" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("bn")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                locale === "bn" ? "bg-indigo-600 text-white font-bangla" : "text-slate-400 hover:text-white"
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  {t.common.appName}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium -mt-1 tracking-wide uppercase">
                  Green View Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Admin / Portal Shortcut */}
            <div className="hidden sm:flex items-center gap-2.5">
              {(role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.nav.adminPortal}</span>
                </Link>
              )}
              {role === "SUPER_ADMIN" && (
                <Link
                  href="/super-admin"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition active:scale-95"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>SaaS Admin</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-semibold"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
              >
                <Shield className="w-4 h-4" />
                <span>{t.nav.adminPortal}</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
