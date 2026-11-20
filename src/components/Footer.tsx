"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Utensils, Shield, PhoneCall, Heart, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mess Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{t.common.appName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.common.tagline}
            </p>
            <div className="text-xs space-y-1 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>House 42, Road 4, Farmgate, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>+880 1819-223344</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>contact@greenviewmess.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              {t.nav.dashboard}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/meals" className="hover:text-indigo-400 transition">
                  {t.nav.meals}
                </Link>
              </li>
              <li>
                <Link href="/bazar" className="hover:text-indigo-400 transition">
                  {t.nav.bazar}
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-indigo-400 transition">
                  {t.nav.finance}
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-indigo-400 transition">
                  {t.nav.rooms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Rules & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              {t.nav.notices}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/notices" className="hover:text-indigo-400 transition">
                  {t.notices.houseRules}
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-indigo-400 transition">
                  {t.emergency.title}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition">
                  {t.nav.adminPortal}
                </Link>
              </li>
              <li>
                <Link href="/super-admin" className="hover:text-indigo-400 transition">
                  {t.nav.superAdmin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: 24/7 Verified Emergency Direct Dial */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Hotlines</span>
            </h4>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>National Emergency:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  999
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Fire Service Hotline:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  16163
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Health Call Center:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  16263
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MessMate Multi-Tenant SaaS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision on D: Drive</span>
            <Shield className="w-3.5 h-3.5 text-indigo-400 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
