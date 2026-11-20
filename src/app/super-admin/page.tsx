"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  KeyRound,
  Building,
  Users,
  CreditCard,
  HardDrive,
  Plus,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  location: string;
  type: string;
  members: number;
  plan: string;
  status: "ACTIVE" | "TRIAL" | "SUSPENDED";
  mrr: number;
}

export default function SuperAdminPage() {
  const { t, showToast } = useApp();

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "t-1",
      name: "Green View Student Mess",
      slug: "green-view",
      location: "Farmgate, Dhaka",
      type: "STUDENT",
      members: 5,
      plan: "STANDARD",
      status: "ACTIVE",
      mrr: 500,
    },
    {
      id: "t-2",
      name: "Comfort Living Bachelor Mess",
      slug: "comfort-living",
      location: "Mirpur 10, Dhaka",
      type: "BACHELOR",
      members: 8,
      plan: "PREMIUM",
      status: "ACTIVE",
      mrr: 1000,
    },
    {
      id: "t-3",
      name: "Padma Hall Residence",
      slug: "padma-hall",
      location: "Kazla, Rajshahi",
      type: "STUDENT",
      members: 14,
      plan: "STANDARD",
      status: "ACTIVE",
      mrr: 500,
    },
    {
      id: "t-4",
      name: "Uttara Corporate Mess",
      slug: "uttara-corp",
      location: "Sector 7, Uttara, Dhaka",
      type: "JOB_HOLDER",
      members: 6,
      plan: "PREMIUM",
      status: "ACTIVE",
      mrr: 1000,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newMessName, setNewMessName] = useState("");
  const [newSubdomain, setNewSubdomain] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState("STUDENT");

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessName || !newSubdomain) return;

    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name: newMessName,
      slug: newSubdomain.toLowerCase().replace(/\s+/g, "-"),
      location: newLocation || "Dhaka, Bangladesh",
      type: newType,
      members: 1,
      plan: "STANDARD",
      status: "ACTIVE",
      mrr: 500,
    };

    setTenants([newTenant, ...tenants]);
    showToast(`New Mess Tenant "${newMessName}" provisioned successfully!`, "success");
    setModalOpen(false);
    setNewMessName("");
    setNewSubdomain("");
    setNewLocation("");
  };

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);
  const totalMembers = tenants.reduce((acc, t) => acc + t.members, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wider uppercase">
            <KeyRound className="w-4 h-4" />
            <span>SaaS Platform Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            MessMate Super Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Global tenant provisioning, subscription licensing, and infrastructure health monitor.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md transition active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Mess Tenant</span>
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Onboarded Messes</span>
          <div className="text-3xl font-black text-slate-900">{tenants.length} Tenants</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
            100% active operational state
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Resident Members</span>
          <div className="text-3xl font-black text-indigo-600">{totalMembers} Members</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Across all mess portals</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Platform MRR</span>
          <div className="text-3xl font-black text-purple-600">৳ {totalMRR}</div>
          <span className="text-[10px] text-purple-500 font-medium mt-1 block">
            Recurring monthly subscription
          </span>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300">Disk Isolation</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
              100% D: DRIVE
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">0% C: Drive Usage</div>
          <span className="text-[10px] text-slate-300 mt-1 block font-mono">
            SQLite @ D:\mass_management\prisma\dev.db
          </span>
        </div>
      </div>

      {/* Tenants Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Registered Tenant Messes</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {tenants.length} Active Portals
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mess Name</th>
                <th className="py-3 px-3">Subdomain / Domain</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-center">Members</th>
                <th className="py-3 px-3 text-center">Plan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{t.name}</td>
                  <td className="py-3.5 px-3 font-mono text-indigo-600">
                    {t.slug}.messmate.com
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{t.location}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-900">{t.members}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Switching tenant context to ${t.name}`, "info")}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Enter Portal →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioning Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Provision New Mess Tenant</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mess / Hostel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shapla Student Mess"
                  value={newMessName}
                  onChange={(e) => setNewMessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subdomain Slug</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="shapla-mess"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-l-xl bg-white border border-r-0 border-slate-300 font-mono text-slate-900 outline-none"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-100 border border-slate-300 text-slate-500 font-mono text-xs">
                    .messmate.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">City & Area Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhanmondi 27, Dhaka"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Resident Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                >
                  <option value="STUDENT">Student Mess</option>
                  <option value="BACHELOR">Bachelor Apartment</option>
                  <option value="JOB_HOLDER">Job-Holder Residence</option>
                  <option value="SHARED_APARTMENT">Shared Sublet Flat</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm transition"
                >
                  Create Mess Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
