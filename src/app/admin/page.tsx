"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Shield,
  Settings,
  Users,
  CheckCircle,
  Clock,
  Palette,
  CreditCard,
  Utensils,
  Receipt,
  Building,
  KeyRound,
  FileCheck,
  AlertOctagon,
  ChevronRight,
  UserPlus,
} from "lucide-react";

export default function AdminPage() {
  const { t, role, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<"SETTINGS" | "MEMBERS" | "APPROVALS" | "CLOSING" | "AUDIT">("SETTINGS");

  // Mess Settings State
  const [messName, setMessName] = useState("Green View Student Mess");
  const [subdomain, setSubdomain] = useState("green-view");
  const [messType, setMessType] = useState("STUDENT");
  const [cutoffBreakfast, setCutoffBreakfast] = useState(22);
  const [cutoffLunch, setCutoffLunch] = useState(8);
  const [cutoffDinner, setCutoffDinner] = useState(16);

  // Members
  const [members, setMembers] = useState([
    { id: "1", name: "Rahim Ahmed", email: "rahim@greenview.com", role: "OWNER", room: "201 (Master Bed)", status: "ACTIVE" },
    { id: "2", name: "Tanvir Hasan", email: "tanvir@greenview.com", role: "MEAL_MANAGER", room: "102 (Bed C)", status: "ACTIVE" },
    { id: "3", name: "Kamrul Islam", email: "kamrul@greenview.com", role: "MEMBER", room: "101 (Bed A)", status: "ACTIVE" },
    { id: "4", name: "Sakib Al Mahmud", email: "sakib@greenview.com", role: "MEMBER", room: "101 (Bed B)", status: "ACTIVE" },
    { id: "5", name: "Mehedi Hasan", email: "mehedi@greenview.com", role: "MEMBER", room: "102 (Bed A)", status: "ACTIVE" },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: "app-1",
      type: "BAZAR",
      title: "Vegetable & Oil Shopping",
      requestedBy: "Kamrul Islam",
      amount: 1240,
      date: "2026-11-19",
    },
    {
      id: "app-2",
      type: "PAYMENT",
      title: "bKash Rent & Meal Advance Payment",
      requestedBy: "Kamrul Islam",
      amount: 1450,
      trxId: "BKH918239129",
      date: "2026-11-20",
    },
  ]);

  const handleApprove = (id: string, title: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    showToast(`Approved: ${title}! Added to ledger.`, "success");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Mess settings and cut-off schedules updated successfully!", "success");
  };

  const updateMemberRole = (id: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    showToast("Member permissions updated!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Shield className="w-4 h-4" />
            <span>Owner & Manager Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Mess Admin Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure tenant branding, manage member roles, approve bazar/payment logs, and execute monthly reconciliation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start">
          {[
            { id: "SETTINGS", label: "Branding & Rules", icon: Settings },
            { id: "MEMBERS", label: "Members Roster", icon: Users },
            { id: "APPROVALS", label: `Approvals (${pendingApprovals.length})`, icon: FileCheck },
            { id: "CLOSING", label: "Monthly Closing", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Settings & Branding */}
      {activeTab === "SETTINGS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Tenant Customization & Meal Schedule</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mess Display Name</label>
                <input
                  type="text"
                  required
                  value={messName}
                  onChange={(e) => setMessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subdomain Slug</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-l-xl bg-white border border-r-0 border-slate-300 font-mono text-slate-900 outline-none"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-100 border border-slate-300 text-slate-500 font-mono text-xs">
                    .messmate.com
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mess Category</label>
              <select
                value={messType}
                onChange={(e) => setMessType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none font-semibold text-slate-800"
              >
                <option value="STUDENT">Student Mess / Hostel</option>
                <option value="BACHELOR">Bachelor Apartment Mess</option>
                <option value="JOB_HOLDER">Job-Holder Residence</option>
                <option value="SHARED_APARTMENT">Shared Family / Sublet Apartment</option>
              </select>
            </div>

            {/* Cut-off Hours */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block">Daily Meal Cut-off Enforcements</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Breakfast Cut-off</label>
                  <select
                    value={cutoffBreakfast}
                    onChange={(e) => setCutoffBreakfast(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                  >
                    <option value={20}>8:00 PM (Prev Night)</option>
                    <option value={21}>9:00 PM (Prev Night)</option>
                    <option value={22}>10:00 PM (Prev Night)</option>
                    <option value={23}>11:00 PM (Prev Night)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Lunch Cut-off</label>
                  <select
                    value={cutoffLunch}
                    onChange={(e) => setCutoffLunch(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                  >
                    <option value={7}>7:00 AM (Same Day)</option>
                    <option value={8}>8:00 AM (Same Day)</option>
                    <option value={9}>9:00 AM (Same Day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Dinner Cut-off</label>
                  <select
                    value={cutoffDinner}
                    onChange={(e) => setCutoffDinner(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                  >
                    <option value={15}>3:00 PM (Same Day)</option>
                    <option value={16}>4:00 PM (Same Day)</option>
                    <option value={17}>5:00 PM (Same Day)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Members Roster */}
      {activeTab === "MEMBERS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Active Mess Members ({members.length})</h2>
              <p className="text-xs text-slate-500">Manage member roles, permissions, and bed allocations.</p>
            </div>
            <button
              onClick={() => showToast("Invite link copied to clipboard: messmate.com/join/green-view", "success")}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
            >
              + Invite Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Assigned Room</th>
                  <th className="py-3 px-3">Role / Permissions</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">{m.email}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{m.room}</td>
                    <td className="py-3.5 px-3">
                      <select
                        value={m.role}
                        onChange={(e) => updateMemberRole(m.id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="MEAL_MANAGER">Meal Manager</option>
                        <option value="ACCOUNTANT">Accountant</option>
                        <option value="OWNER">Mess Owner</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => showToast(`Opening profile details for ${m.name}`, "info")}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Approvals Queue */}
      {activeTab === "APPROVALS" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            <span>Pending Approvals ({pendingApprovals.length})</span>
          </h2>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              ✓ All submissions have been approved. No pending items.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                        {app.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{app.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      Requested by <span className="font-bold">{app.requestedBy}</span> • Date: {app.date}
                    </p>
                    {app.trxId && (
                      <span className="block font-mono text-[11px] text-indigo-600 font-bold">
                        TrxID: {app.trxId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-lg font-black text-slate-900">৳ {app.amount}</span>
                    <button
                      onClick={() => handleApprove(app.id, app.title)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      Approve & Post to Ledger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Monthly Closing Engine */}
      {activeTab === "CLOSING" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Monthly Account Reconciler (November 2026)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block">Total Kitchen Bazar Spent:</span>
              <span className="text-2xl font-black text-slate-900">৳ 3,090.00</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block">Total Consumed Meals:</span>
              <span className="text-2xl font-black text-indigo-600">56.5 Meals</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-emerald-700 font-medium block">Calculated Meal Rate:</span>
              <span className="text-2xl font-black text-emerald-800">৳ 54.69 / meal</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
            <span className="font-bold block">Notice on Monthly Closing:</span>
            <p className="leading-relaxed">
              Executing the monthly closing will generate individualized member debit statements for consumed meals, room rent, and shared utility costs (Internet, cook salary, electricity, gas). It locks past bazar vouchers and produces finalized statements.
            </p>
          </div>

          <button
            onClick={() => showToast("November monthly accounts finalized! Statements sent to all members.", "success")}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            Execute November Monthly Closing
          </button>
        </div>
      )}
    </div>
  );
}
