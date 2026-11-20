"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  PhoneCall,
  Shield,
  ShieldAlert,
  Flame,
  Activity,
  HeartPulse,
  Home,
  Wrench,
  Zap,
  Search,
  Plus,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";

export default function EmergencyPage() {
  const { t, showToast } = useApp();
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const nationalContacts = [
    {
      id: "nat-1",
      name: "National Emergency Helpline (Police / Fire / Ambulance)",
      type: "POLICE",
      phone: "999",
      desc: "Toll-free 24/7 immediate emergency response across Bangladesh.",
      badge: "NATIONAL 24/7",
      color: "border-rose-500 bg-rose-50/50",
    },
    {
      id: "nat-2",
      name: "Fire Service & Civil Defence Central Control",
      type: "FIRE",
      phone: "16163",
      desc: "Direct national fire rescue, hazard control, and disaster assistance.",
      badge: "FIRE CONTROL",
      color: "border-amber-500 bg-amber-50/50",
    },
    {
      id: "nat-3",
      name: "Shastho Batayan (National Health & Ambulance Helpline)",
      type: "MEDICAL",
      phone: "16263",
      desc: "24/7 government medical consultations, doctor on call, and ambulance dispatch.",
      badge: "HEALTH 24/7",
      color: "border-emerald-500 bg-emerald-50/50",
    },
    {
      id: "nat-4",
      name: "Government Information & Public Services Hotline",
      type: "INFO",
      phone: "333",
      desc: "Citizen helpline, local administration queries, and food/safety assistance.",
      badge: "CITIZEN INFO",
      color: "border-indigo-500 bg-indigo-50/50",
    },
  ];

  const localContacts = [
    {
      id: "loc-1",
      name: "Tejgaon Model Police Station",
      type: "POLICE",
      phone: "+88028143300",
      desc: "Jurisdictional police station for Farmgate and Tejkunipara.",
      address: "Tejgaon, Dhaka",
    },
    {
      id: "loc-2",
      name: "Suhrawardy Hospital Emergency & Ambulance",
      type: "MEDICAL",
      phone: "+8801713000000",
      desc: "Nearest major government hospital emergency room (1.5 km away).",
      address: "Sher-e-Bangla Nagar, Dhaka",
    },
    {
      id: "loc-3",
      name: "Al-Razi 24hr Emergency Pharmacy",
      type: "MEDICAL",
      phone: "+8801819001122",
      desc: "Open all night for urgent prescription medicine & first aid supplies.",
      address: "Farmgate Overbridge Foot, Dhaka",
    },
    {
      id: "loc-4",
      name: "Mess Building Owner (Haji Abul Kashem)",
      type: "LANDLORD",
      phone: "+8801712345678",
      desc: "House landlord for building safety, gas line inspection, or structural issues.",
      address: "Flat 5A, Green View House",
    },
    {
      id: "loc-5",
      name: "Mess Dedicated Electrician (Sohel Bhai)",
      type: "UTILITY",
      phone: "+8801911443322",
      desc: "Local licensed technician for power tripping, generator lines, and wiring.",
      address: "Tejkunipara Main Road",
    },
    {
      id: "loc-6",
      name: "Plumber & Water Supply Tech (Hasan Miah)",
      type: "UTILITY",
      phone: "+8801711998877",
      desc: "Emergency water tank pipe leakage and bathroom drainage repair.",
      address: "Farmgate Bazar",
    },
  ];

  const copyNumber = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    showToast(`Copied ${phone} to clipboard!`, "success");
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const filteredLocal = localContacts.filter((c) => {
    const matchesFilter = filterCategory === "ALL" || c.type === filterCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs tracking-wider uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Health & Law Enforcement Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.emergency.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified official hotlines and local mess utility contacts available 24 hours a day.
          </p>
        </div>
      </div>

      {/* National 24/7 Helplines Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-600" />
          <span>{t.emergency.nationalTitle}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nationalContacts.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 ${c.color}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  {c.badge}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{c.desc}</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {c.phone}</span>
                </a>
                <button
                  onClick={() => copyNumber(c.phone)}
                  className="p-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                  title="Copy Phone Number"
                >
                  {copiedPhone === c.phone ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Mess & Neighborhood Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-600" />
            <span>{t.emergency.localTitle} (Tejgaon / Farmgate)</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "POLICE", "MEDICAL", "LANDLORD", "UTILITY"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  filterCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocal.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {c.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{c.phone}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">📍 {c.address}</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Direct Call</span>
                </a>
                <button
                  onClick={() => copyNumber(c.phone)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Copy Phone Number"
                >
                  {copiedPhone === c.phone ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid & Safety Standard Operating Procedures (SOP) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-600" />
          <span>Mess In-House First Aid & Fire Protocol</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">First Aid Kit Location:</span>
            <p>Stored in the common dining room cabinet next to the water purifier.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Fire Extinguisher:</span>
            <p>6kg ABC Dry Powder Extinguisher mounted on Floor 1 and Floor 2 stair landing.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Main Gas Valve Shut-off:</span>
            <p>Located immediately behind the kitchen stove cylinder station.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
