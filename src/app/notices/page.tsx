"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Info,
  Flame,
  MessageSquare,
  Calendar,
  Clock,
  X,
  Send,
  CheckCircle,
} from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: "URGENT" | "IMPORTANT" | "NORMAL";
  date: string;
  author: string;
}

export default function NoticesPage() {
  const { t, role, showToast } = useApp();

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "nt-1",
      title: "Monthly Mess General Meeting & Bazar Rotation",
      content:
        "All members are cordially requested to attend the monthly general meeting on Friday at 9:00 PM in the dining room. We will review the kitchen bazar rotation for December and finalize the monthly accounts.",
      priority: "IMPORTANT",
      date: "2026-11-20",
      author: "Rahim Ahmed (Owner)",
    },
    {
      id: "nt-2",
      title: "Routine Overhead Water Tank Cleaning (Sunday 10 AM - 1 PM)",
      content:
        "Please reserve adequate water beforehand. Water supply will be suspended for 3 hours on Sunday morning for chlorination and deep hygiene cleaning of the main rooftop tank.",
      priority: "URGENT",
      date: "2026-11-19",
      author: "Tanvir Hasan (Manager)",
    },
    {
      id: "nt-3",
      title: "High-Speed Dual Band 100 Mbps WiFi Upgrade",
      content:
        "We have replaced the old router with a Wi-Fi 6 Gigabit access point. Members can collect the updated WPA3 key from Tanvir. Heavy torrent downloading is restricted during peak evening hours (8 PM - 11 PM).",
      priority: "NORMAL",
      date: "2026-11-15",
      author: "Tanvir Hasan (Manager)",
    },
  ]);

  const [createNoticeOpen, setCreateNoticeOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);

  // Form State for Notice
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState<"URGENT" | "IMPORTANT" | "NORMAL">("NORMAL");

  // Form State for Complaint
  const [complaintCat, setComplaintCat] = useState("ROOM");
  const [complaintText, setComplaintText] = useState("");

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const notice: Notice = {
      id: `nt-${Date.now()}`,
      title: newTitle,
      content: newContent,
      priority: newPriority,
      date: "2026-11-20",
      author: "Mess Authority",
    };

    setNotices([notice, ...notices]);
    showToast("Announcement published on mess notice board!", "success");
    setCreateNoticeOpen(false);
    setNewTitle("");
    setNewContent("");
  };

  const handleSendComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText) return;
    showToast("Your feedback/maintenance request was delivered directly to the manager!", "success");
    setComplaintOpen(false);
    setComplaintText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Bell className="w-4 h-4" />
            <span>Community & House Discipline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.notices.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official announcements, house rules, and direct manager feedback channel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setComplaintOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Submit Maintenance Issue</span>
          </button>

          {(role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
            <button
              onClick={() => setCreateNoticeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Left = Notices, Right = Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Notices Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Active Announcements</span>
          </h2>

          <div className="space-y-4">
            {notices.map((n) => {
              const isUrgent = n.priority === "URGENT";
              const isImportant = n.priority === "IMPORTANT";
              return (
                <div
                  key={n.id}
                  className={`bg-white rounded-2xl p-6 border shadow-xs space-y-3 transition ${
                    isUrgent
                      ? "border-rose-200 bg-rose-50/20"
                      : isImportant
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isUrgent
                          ? "bg-rose-100 text-rose-800"
                          : isImportant
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {n.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{n.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span>Issued by: {n.author}</span>
                    <span className="text-indigo-600 font-medium">Green View Student Mess</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Standard House Rules (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>{t.notices.houseRules}</span>
          </h2>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <p className="text-xs text-slate-500">
              All resident members and short-term guests are obligated to maintain these communal standards.
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">1. Zero Tolerance on Narcotics & Smoking</span>
                <p className="text-slate-600">{t.notices.rule1}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">2. Guest Entry & Overnight Stays</span>
                <p className="text-slate-600">{t.notices.rule2}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">3. Night Quiet Hours</span>
                <p className="text-slate-600">{t.notices.rule3}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">4. Electricity & Water Conservation</span>
                <p className="text-slate-600">{t.notices.rule4}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">5. Monthly Rent & Advance Meal Dues</span>
                <p className="text-slate-600">{t.notices.rule5}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Notice Modal */}
      {createNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Publish Announcement</h3>
              <button
                onClick={() => setCreateNoticeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["NORMAL", "IMPORTANT", "URGENT"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 rounded-xl font-bold border transition ${
                        newPriority === p
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WiFi Maintenance Schedule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Details & Instructions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide all essential details for members..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateNoticeOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint / Feedback Modal */}
      {complaintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Submit Issue to Manager</h3>
              <button
                onClick={() => setComplaintOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Category</label>
                <select
                  value={complaintCat}
                  onChange={(e) => setComplaintCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                >
                  <option value="ROOM">Room / Fan / Light Electrical Issue</option>
                  <option value="MEAL">Meal Quality or Kitchen Hygiene</option>
                  <option value="WIFI">Internet / WiFi Disconnection</option>
                  <option value="CLEAN">Bathroom or Corridor Cleanliness</option>
                  <option value="OTHER">General Complaint or Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Describe the Issue</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Room 101 ceiling fan is vibrating or bathroom tap is leaking..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setComplaintOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
