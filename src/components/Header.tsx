"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Shield,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Home,
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Activity,
  Users,
  LogIn,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";

export default function Header() {
  const { locale, setLocale, role, setRole, isLoggedIn, currentUser, loginAs, logout, t, toast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Public Links (when guest or on homepage)
  const publicLinks = [
    { href: "/", label: locale === "bn" ? "হোমপেজ" : "Home", icon: Home },
    { href: "/#members", label: locale === "bn" ? "মেম্বার তালিকা" : "Residents", icon: Users },
    { href: "/#alumni", label: locale === "bn" ? "প্রাক্তন মেম্বার (Alumni)" : "Ex-Members", icon: UserCheck },
    { href: "/#photos", label: locale === "bn" ? "মেস ও ট্যুর ছবি" : "Photos", icon: Building },
    { href: "/notices", label: locale === "bn" ? "নোটিশ" : "Notices", icon: Bell },
  ];

  // Logged In Member Links
  const memberLinks = [
    { href: "/dashboard", label: locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard", icon: LayoutDashboard },
    { href: "/meals", label: locale === "bn" ? "মিল হিসাব" : "Meals", icon: Utensils },
    { href: "/bazar", label: locale === "bn" ? "দৈনিক বাজার" : "Bazar", icon: ShoppingCart },
    { href: "/finance", label: locale === "bn" ? "ভাড়া ও বিল" : "Bills & Ledger", icon: CreditCard },
    { href: "/rooms", label: locale === "bn" ? "রুম ও সিট" : "Rooms", icon: Building },
    { href: "/reports", label: locale === "bn" ? "রিপোর্ট" : "Reports", icon: BarChart3 },
    { href: "/notices", label: locale === "bn" ? "নোটিশ" : "Notices", icon: Bell },
  ];

  const currentNavLinks = isLoggedIn ? memberLinks : publicLinks;

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: "MEMBER", label: "Kamrul Islam (Member)" },
    { role: "MEAL_MANAGER", label: "Tanvir Hasan (Meal Manager)" },
    { role: "OWNER", label: "Rahim Ahmed (Mess Admin)" },
    { role: "SUPER_ADMIN", label: "Platform Super Admin" },
    { role: "GUEST", label: "Guest / Public Visitor" },
  ];

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole !== "GUEST") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border bg-white border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-200">
          {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500" />}
          {toast.type === "info" && <Shield className="w-5 h-5 text-indigo-500" />}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* Top Bar: Tenant Context & Quick Role Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Green View Student Mess
          </span>
          <span className="hidden sm:inline text-slate-400">| Farmgate, Dhaka</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Switch Persona for Testing */}
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline text-slate-400">Role:</span>
            <select
              value={role}
              onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
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

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  {t.common.appName}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium -mt-1 tracking-wide uppercase">
                  Green View Mess
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {currentNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Logged In User vs Logged Out Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  {/* Public: 1-Click Member Login */}
                  <button
                    onClick={() => {
                      loginAs("MEMBER", "Kamrul Islam", "Room 101");
                      router.push("/dashboard");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{locale === "bn" ? "মেম্বার লগইন" : "Member Login"}</span>
                  </button>

                  {/* Public: Admin Portal Login */}
                  <button
                    onClick={() => {
                      loginAs("OWNER", "Rahim Ahmed", "Room 201");
                      router.push("/admin");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{locale === "bn" ? "অ্যাডমিন" : "Admin"}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Logged in User Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-bold text-slate-800">{currentUser?.name || "Member"}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {role}
                    </span>
                  </div>

                  {/* Admin Shortcut if Admin or Manager */}
                  {(role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{locale === "bn" ? "মেম্বার এড ও পরিচালনা" : "Admin Panel"}</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{locale === "bn" ? "লগআউট" : "Logout"}</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
            {currentNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    loginAs("MEMBER", "Kamrul Islam", "Room 101");
                    setMobileMenuOpen(false);
                    router.push("/dashboard");
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{locale === "bn" ? "মেম্বার লগইন করুন" : "Member Login"}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{locale === "bn" ? "লগআউট করুন" : "Logout"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
