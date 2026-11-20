"use client";

import React, { useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
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
  X,
  Phone,
  Mail,
  Home,
  Briefcase,
  Edit3,
  UserCheck,
  ShieldAlert,
  Camera,
  HeartPulse,
} from "lucide-react";

export default function AdminPage() {
  const { t, role, members, addMember, updateMemberRole, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<"SETTINGS" | "MEMBERS" | "APPROVALS" | "CLOSING">("MEMBERS");

  // Add Member Modal State
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<UserRole>("MEMBER");
  const [memberRoom, setMemberRoom] = useState("103");
  const [memberInstitution, setMemberInstitution] = useState("Dhaka University");
  const [memberAvatarUrl, setMemberAvatarUrl] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80");
  const [memberDescription, setMemberDescription] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("Father (পিতা)");

  // Preset Avatars for quick selection
  const avatarPresets = [
    { label: "Male 1", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
    { label: "Male 2", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80" },
    { label: "Male 3", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { label: "Male 4", url: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80" },
    { label: "Male 5", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
  ];

  // Role Edit Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<(typeof members)[0] | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>("MEMBER");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Mess Settings State
  const [messName, setMessName] = useState("Green View Student Mess");
  const [subdomain, setSubdomain] = useState("green-view");
  const [messType, setMessType] = useState("STUDENT");
  const [cutoffBreakfast, setCutoffBreakfast] = useState(22);
  const [cutoffLunch, setCutoffLunch] = useState(8);
  const [cutoffDinner, setCutoffDinner] = useState(16);

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

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberPhone) {
      showToast("Please provide member name and phone number", "error");
      return;
    }

    const emailToUse = memberEmail || `${memberName.toLowerCase().replace(/\s+/g, "")}@greenview.com`;

    await addMember({
      name: memberName,
      phone: memberPhone,
      email: emailToUse,
      role: memberRole,
      roomNumber: memberRoom,
      institution: memberInstitution,
      avatarUrl: memberAvatarUrl,
      description: memberDescription,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    });

    setAddMemberModalOpen(false);
    setMemberName("");
    setMemberPhone("");
    setMemberEmail("");
    setMemberDescription("");
    setEmergencyContactName("");
    setEmergencyContactPhone("");
  };

  const handleApprove = (id: string, title: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    showToast(`Approved: ${title}! Added to ledger.`, "success");
  };

  const handleOpenRoleModal = (member: (typeof members)[0]) => {
    setEditingMember(member);
    setSelectedNewRole(member.role);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsUpdatingRole(true);
    await updateMemberRole(editingMember.id, selectedNewRole);
    setIsUpdatingRole(false);
    setRoleModalOpen(false);
    setEditingMember(null);
  };

  const handleInlineRoleChange = async (memberId: string, newRole: UserRole) => {
    await updateMemberRole(memberId, newRole);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Mess settings and cut-off schedules updated successfully!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Shield className="w-4 h-4" />
            <span>Mess Management &amp; Admin Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add members, allocate rooms, set cut-off schedules, approve bazar/payment logs, and execute monthly closing.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start">
          {[
            { id: "MEMBERS", label: `Members (${members.length})`, icon: Users },
            { id: "APPROVALS", label: `Approvals (${pendingApprovals.length})`, icon: FileCheck },
            { id: "CLOSING", label: "Monthly Closing", icon: CreditCard },
            { id: "SETTINGS", label: "Settings", icon: Settings },
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

      {/* Tab 1: Members Roster & Add Member */}
      {activeTab === "MEMBERS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Active Mess Members ({members.length})</h2>
              <p className="text-xs text-slate-500">
                Create new member profiles. Once created, members can log in to view their meals, bazar, and ledger.
              </p>
            </div>
            <button
              onClick={() => setAddMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-95 self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Member (মেম্বার যুক্ত করুন)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member (ছবি ও নাম)</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Assigned Room</th>
                  <th className="py-3 px-3">Institution / Job</th>
                  <th className="py-3 px-3">Role / পদবী</th>
                  <th className="py-3 px-3">Emergency Contact</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                          alt={m.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{m.name}</span>
                          {m.description && (
                            <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                              {m.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-slate-800 block text-xs">{m.phone}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{m.email}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-indigo-700 text-xs">{m.room}</td>
                    <td className="py-3.5 px-3 text-slate-600 text-xs">{m.institution}</td>
                    <td className="py-3.5 px-3">
                      <select
                        value={m.role === "OWNER" ? "ADMIN" : m.role}
                        onChange={(e) => handleInlineRoleChange(m.id, e.target.value as UserRole)}
                        className={`text-[11px] font-bold rounded-lg border px-2 py-1 transition cursor-pointer shadow-2xs outline-none ${
                          m.role === "ADMIN" || m.role === "OWNER"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-1 focus:ring-emerald-500"
                            : m.role === "MEAL_MANAGER"
                            ? "bg-amber-50 text-amber-800 border-amber-300 focus:ring-1 focus:ring-amber-500"
                            : m.role === "SUPER_ADMIN"
                            ? "bg-purple-50 text-purple-800 border-purple-300 focus:ring-1 focus:ring-purple-500"
                            : "bg-indigo-50 text-indigo-800 border-indigo-200 focus:ring-1 focus:ring-indigo-500"
                        }`}
                        title="Click to change member role"
                      >
                        <option value="MEMBER">MEMBER (মেম্বার)</option>
                        <option value="MEAL_MANAGER">MEAL_MANAGER (ম্যানেজার)</option>
                        <option value="ADMIN">ADMIN (মেস এডমিন)</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN (সুপার এডমিন)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      {m.emergencyContactPhone ? (
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-800 block text-xs">
                            {m.emergencyContactPhone}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {m.emergencyContactName ? `${m.emergencyContactName} ` : ""}
                            {m.emergencyContactRelation ? `(${m.emergencyContactRelation})` : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">নট সেট</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenRoleModal(m)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-[11px] border border-slate-200 transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>রোল এডিট</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Approvals */}
      {activeTab === "APPROVALS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Pending Manager Approvals ({pendingApprovals.length})
              </h2>
              <p className="text-xs text-slate-500">
                Verify member-submitted bazar vouchers and digital bKash/Nagad payments.
              </p>
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Zero pending approvals. All items verified!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {app.type}
                      </span>
                      <span className="font-bold text-slate-900">{app.title}</span>
                    </div>
                    <div className="text-slate-500">
                      Submitted by: <span className="font-semibold text-slate-700">{app.requestedBy}</span> • Date: {app.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="text-base font-bold text-indigo-600">৳ {app.amount}</span>
                    <button
                      onClick={() => handleApprove(app.id, app.title)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      Approve &amp; Post to Ledger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Monthly Closing */}
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
              Executing the monthly closing will generate individualized member debit statements for consumed meals, room rent, and shared utility costs. It locks past bazar vouchers and produces finalized statements.
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

      {/* Tab 4: Settings */}
      {activeTab === "SETTINGS" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Tenant Customization &amp; Meal Schedule</h2>
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

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD MEMBER MODAL (মেস মেম্বার যুক্ত করার ফর্ম) */}
      {/* ========================================================= */}
      {addMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    নতুন মেস মেম্বার যুক্ত করুন (Add Member)
                  </h3>
                  <p className="text-xs text-slate-500">Green View Student Mess</p>
                </div>
              </div>
              <button
                onClick={() => setAddMemberModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs">
              {/* SECTION 1: BASIC INFO */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block border-b border-slate-100 pb-1">
                  ১. মৌলিক তথ্য (Basic Info)
                </span>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মেম্বারের পূর্ণ নাম (Full Name)*</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তরিকুল ইসলাম (Tariqul Islam)"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">মোবাইল নম্বর (Phone)*</label>
                    <input
                      type="tel"
                      required
                      placeholder="01712345678"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">ইমেইল (Email)</label>
                    <input
                      type="email"
                      placeholder="tariqul@greenview.com"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">রুম নম্বর (Assigned Room)*</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 103 (Bed A)"
                      value={memberRoom}
                      onChange={(e) => setMemberRoom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">মেসের পদবী (Role)</label>
                    <select
                      value={memberRole === "OWNER" ? "ADMIN" : memberRole}
                      onChange={(e) => setMemberRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="MEMBER">Resident Member (সাধারণ সদস্য)</option>
                      <option value="MEAL_MANAGER">Meal Manager (মিল ম্যানেজার)</option>
                      <option value="ADMIN">Mess Admin (মেস এডমিন)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">প্রতিষ্ঠান / কর্মস্থল (University / Job)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় (পদার্থবিজ্ঞান বিভাগ)"
                    value={memberInstitution}
                    onChange={(e) => setMemberInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* SECTION 2: PHOTO & DESCRIPTION */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  ২. ছবি ও সংক্ষিপ্ত বিবরণ (Photo & Description)
                </span>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">মেম্বারের ছবি (Member Photo)</label>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={memberAvatarUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500 shadow-2xs"
                    />
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder="ছবির লিংক দিন (https://...)"
                        value={memberAvatarUrl}
                        onChange={(e) => setMemberAvatarUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-semibold">ডিফল্ট ছবি বেছে নিন:</span>
                    <div className="flex items-center gap-1.5">
                      {avatarPresets.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMemberAvatarUrl(av.url)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition ${
                            memberAvatarUrl === av.url ? "border-indigo-600 ring-2 ring-indigo-400" : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">সংক্ষিপ্ত বিবরণ বা নোট (Description / Bio)</label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: রক্তের গ্রুপ B+, শখ: টেবিল টেনিস ও ফটোগ্রাফি"
                    value={memberDescription}
                    onChange={(e) => setMemberDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* SECTION 3: EMERGENCY CONTACT */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  ৩. জরুরি যোগাযোগ (Emergency Contact)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">অভিভাবকের নাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: মো. রফিকুল ইসলাম"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">জরুরি ফোন নম্বর*</label>
                    <input
                      type="tel"
                      placeholder="01712000000"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">সম্পর্ক (Relation)</label>
                    <input
                      type="text"
                      placeholder="যেমন: পিতা / মাতা / ভাই"
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddMemberModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition"
                >
                  মেম্বার প্রোফাইল তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {roleModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    মেম্বার রোল ও দায়িত্ব পরিবর্তন (Edit Role)
                  </h3>
                  <p className="text-xs text-slate-500">
                    নির্দিষ্ট মেম্বারের পারমিশন এবং দায়িত্ব পরিবর্তন করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Member Info Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{editingMember.name}</h4>
                <p className="text-xs text-slate-500">{editingMember.email} • {editingMember.room}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800">
                বর্তমান: {editingMember.role === "OWNER" ? "ADMIN" : editingMember.role}
              </span>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  নতুন পদবী / রোল নির্বাচন করুন:
                </label>

                {/* Option 1: MEMBER */}
                <label
                  onClick={() => setSelectedNewRole("MEMBER")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "MEMBER"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">MEMBER (সাধারণ সদস্য)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">Resident</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        নিজের মিল অন/অফ করতে পারবে, সার্বিক মিল-বাজারের লাইভ ব্যালেন্স দেখতে পারবে, নিজের বাসা ভাড়ার ইনভয়েস দেখতে ও পরিশোধ করতে পারবে।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedNewRole === "MEMBER"}
                      onChange={() => setSelectedNewRole("MEMBER")}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </label>

                {/* Option 2: MEAL_MANAGER */}
                <label
                  onClick={() => setSelectedNewRole("MEAL_MANAGER")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "MEAL_MANAGER"
                      ? "border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">MEAL_MANAGER (মিল ও বাজার ম্যানেজার)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Monthly Manager</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        চলতি মাসের দায়িত্বপ্রাপ্ত ম্যানেজার। সবার মিল এন্ট্রি পরিবর্তন করতে পারবে, প্রতিদিনের বাজার খরচ যুক্ত করতে পারবে এবং মিল কাট-অফ সময় নিয়ন্ত্রণ করতে পারবে।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedNewRole === "MEAL_MANAGER"}
                      onChange={() => setSelectedNewRole("MEAL_MANAGER")}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                </label>

                {/* Option 3: ADMIN */}
                <label
                  onClick={() => setSelectedNewRole("ADMIN")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "ADMIN" || selectedNewRole === "OWNER"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">ADMIN (মেস এডমিন)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Full Admin</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        সম্পূর্ণ মেস নিয়ন্ত্রণ: নতুন সদস্য অ্যাড করা, রোল এডিট করা, ভাড়া ও ইউটিলিটি বিল এডিট করা এবং মাস শেষ ক্লোজিং অনুমোদন করা।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedNewRole === "ADMIN" || selectedNewRole === "OWNER"}
                      onChange={() => setSelectedNewRole("ADMIN")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                </label>

                {/* Option 4: SUPER_ADMIN */}
                <label
                  onClick={() => setSelectedNewRole("SUPER_ADMIN")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "SUPER_ADMIN"
                      ? "border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">SUPER_ADMIN (সুপার এডমিন)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">System Root</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        প্ল্যাটফর্মের সর্বোচ্চ লেভেল অ্যাক্সেস ও কনফিগারেশন।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedNewRole === "SUPER_ADMIN"}
                      onChange={() => setSelectedNewRole("SUPER_ADMIN")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                </label>
              </div>
                  </div>
                </label>

                {/* Option 4: SUPER_ADMIN */}
                <label
                  onClick={() => setSelectedNewRole("SUPER_ADMIN")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "SUPER_ADMIN"
                      ? "border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">SUPER_ADMIN (সুপার এডমিন)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">System Root</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        প্ল্যাটফর্মের সর্বোচ্চ লেভেল অ্যাক্সেস ও কনফিগারেশন।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="roleOption"
                      checked={selectedNewRole === "SUPER_ADMIN"}
                      onChange={() => setSelectedNewRole("SUPER_ADMIN")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRole}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  {isUpdatingRole ? (
                    <span>সংরক্ষণ হচ্ছে...</span>
                  ) : (
                    <span>রোল পরিবর্তন সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
