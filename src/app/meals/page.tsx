"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Utensils,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Save,
  Lock,
  Shield,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

interface MemberMeal {
  id: string;
  name: string;
  room: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  guestBreakfast: number;
  guestLunch: number;
  guestDinner: number;
  isOff: boolean;
}

interface MemberMealSummary {
  id: string;
  name: string;
  room: string;
  totalMeals: number;
  totalBazar: number;
  role: string;
}

export default function MealsPage() {
  const { t, role, currentUser, showToast, locale } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-11-20");

  // Permission Check: Only Admin/Owner or Meal Manager can edit everyone's meals!
  const canManageAll = role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN";

  // Today's Attendance State
  const [membersMeals, setMembersMeals] = useState<MemberMeal[]>([
    {
      id: "m-1",
      name: "Kamrul Islam",
      room: "101-A",
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      guestBreakfast: 0,
      guestLunch: 0,
      guestDinner: 0,
      isOff: false,
    },
    {
      id: "m-2",
      name: "Sakib Al Mahmud",
      room: "101-B",
      breakfast: 1,
      lunch: 1,
      dinner: 0,
      guestBreakfast: 0,
      guestLunch: 0,
      guestDinner: 0,
      isOff: false,
    },
    {
      id: "m-3",
      name: "Mehedi Hasan",
      room: "102-A",
      breakfast: 0,
      lunch: 1,
      dinner: 1,
      guestBreakfast: 0,
      guestLunch: 1,
      guestDinner: 0,
      isOff: false,
    },
    {
      id: "m-4",
      name: "Tanvir Hasan (Manager)",
      room: "102-B",
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      guestBreakfast: 0,
      guestLunch: 0,
      guestDinner: 0,
      isOff: false,
    },
    {
      id: "m-5",
      name: "Rahim Ahmed (Owner)",
      room: "201-A",
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      guestBreakfast: 0,
      guestLunch: 0,
      guestDinner: 0,
      isOff: false,
    },
  ]);

  // Transparent Full-Month Meal & Bazar Balance Dataset (Everyone can see this!)
  const [mealSummaryList] = useState<MemberMealSummary[]>([
    {
      id: "s-1",
      name: "Kamrul Islam",
      room: "Room 101-A",
      totalMeals: 34,
      totalBazar: 2400,
      role: "MEMBER",
    },
    {
      id: "s-2",
      name: "Sakib Al Mahmud",
      room: "Room 101-B",
      totalMeals: 28,
      totalBazar: 1000,
      role: "MEMBER",
    },
    {
      id: "s-3",
      name: "Mehedi Hasan",
      room: "Room 102-A",
      totalMeals: 31,
      totalBazar: 0,
      role: "MEMBER",
    },
    {
      id: "s-4",
      name: "Tanvir Hasan (Manager)",
      room: "Room 102-B",
      totalMeals: 32,
      totalBazar: 3090,
      role: "MEAL_MANAGER",
    },
    {
      id: "s-5",
      name: "Rahim Ahmed (Owner)",
      room: "Room 201-A",
      totalMeals: 30,
      totalBazar: 1500,
      role: "OWNER",
    },
  ]);

  const mealRate = 54.5; // Calculated from total bazar / total meals

  // Helper to check if a row belongs to currently logged-in user
  const isUserOwnRow = (mName: string) => {
    if (!currentUser) return mName.includes("Kamrul");
    const firstName = currentUser.name.split(" ")[0].toLowerCase();
    return mName.toLowerCase().includes(firstName);
  };

  const updateMeal = (id: string, field: "breakfast" | "lunch" | "dinner", change: number) => {
    const targetMember = membersMeals.find((m) => m.id === id);
    if (!targetMember) return;

    // Check permission: Only Admin/Manager or the user themselves can change!
    if (!canManageAll && !isUserOwnRow(targetMember.name)) {
      showToast(
        locale === "bn"
          ? "অনুমতি নেই: অন্য সদস্যের মিল পরিবর্তন করার ক্ষমতা শুধুমাত্র মেস ম্যানেজার বা অ্যাডমিনের রয়েছে।"
          : "Permission Denied: Only Meal Manager or Admin can edit other members' attendance.",
        "error"
      );
      return;
    }

    setMembersMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const current = m[field];
          const updated = Math.max(0, current + change);
          return { ...m, [field]: updated };
        }
        return m;
      })
    );
  };

  const toggleAllOff = (id: string) => {
    const member = membersMeals.find((m) => m.id === id);
    if (!member) return;

    // Check permission
    if (!canManageAll && !isUserOwnRow(member.name)) {
      showToast(
        locale === "bn"
          ? "অনুমতি নেই: অন্য সদস্যের মিল বন্ধ করার অনুমতি শুধুমাত্র ম্যানেজারের রয়েছে।"
          : "Permission Denied: Only Meal Manager or Admin can toggle other members off.",
        "error"
      );
      return;
    }

    const nextState = !member.isOff;
    setMembersMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            isOff: nextState,
            breakfast: nextState ? 0 : 1,
            lunch: nextState ? 0 : 1,
            dinner: nextState ? 0 : 1,
          };
        }
        return m;
      })
    );
    showToast(
      nextState
        ? `${member.name}-এর মিল বন্ধ করা হয়েছে।`
        : `${member.name}-এর মিল চালু করা হয়েছে।`,
      "info"
    );
  };

  const handleSaveAll = () => {
    showToast(
      locale === "bn"
        ? "আজকের মিল শিট সফলভাবে সংরক্ষিত ও লক করা হয়েছে!"
        : "Today's meal attendance successfully saved and locked!",
      "success"
    );
  };

  // Calculations
  const totalBreakfast = membersMeals.reduce((acc, m) => acc + m.breakfast + m.guestBreakfast, 0);
  const totalLunch = membersMeals.reduce((acc, m) => acc + m.lunch + m.guestLunch, 0);
  const totalDinner = membersMeals.reduce((acc, m) => acc + m.dinner + m.guestDinner, 0);
  const totalDayMeals = totalBreakfast + totalLunch + totalDinner;

  const totalMonthBazar = mealSummaryList.reduce((acc, m) => acc + m.totalBazar, 0);
  const totalMonthMeals = mealSummaryList.reduce((acc, m) => acc + m.totalMeals, 0);
  const calculatedMealRate = (totalMonthBazar / totalMonthMeals).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Utensils className="w-4 h-4" />
            <span>Green View Student Mess</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {locale === "bn" ? "মিল উপস্থিতি ও স্বচ্ছ মেস হিসাব" : "Meal Attendance & Transparent Ledger"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === "bn"
              ? "কে কত মিল খেলেন এবং কে কত বাজার করলেন তা সকল সদস্য স্বচ্ছভাবে দেখতে পারবেন।"
              : "Full visibility for all members on meals eaten, bazar spent, and net refund/due balances."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 mr-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium outline-none"
            />
          </div>

          {canManageAll && (
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{locale === "bn" ? "উপস্থিতি সংরক্ষণ করুন" : "Save Attendance"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission & Transparency Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-indigo-950 block">
              {locale === "bn"
                ? "স্বচ্ছ মেস নীতি (Transparency & Permission Rule):"
                : "Mess Transparency & Permission Matrix:"}
            </span>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              {canManageAll
                ? locale === "bn"
                  ? "🛡️ আপনি অ্যাডমিন/ম্যানেজার হিসেবে লগইন আছেন — আপনি সকল সদস্যের মিল ও বাজার এডিট করতে পারবেন।"
                  : "🛡️ You are logged in as Manager/Admin — Full edit permissions on all member meals and bazar."
                : locale === "bn"
                ? "👁️ সাধারণ মেম্বাররা সম্পূর্ণ স্বচ্ছ হিসাব দেখতে পারবেন, তবে শুধুমাত্র নিজের মিল অন/অফ করতে পারবেন। অন্যের মিল পরিবর্তন কেবল ম্যানেজার করতে পারবেন।"
                : "👁️ All members have full view of meal and bazar totals, but can only edit their own attendance. Other members are locked."}
            </p>
          </div>
        </div>

        <div className="self-end sm:self-auto shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              canManageAll ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
            }`}
          >
            {canManageAll ? "Admin / Manager Access" : "Member View Mode"}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {locale === "bn" ? "আজকের সকালের নাস্তা" : "Today's Breakfast"}
          </span>
          <div className="text-2xl font-black text-slate-900">{totalBreakfast} Meals</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Cut-off: 10 PM (Prev Night)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {locale === "bn" ? "আজকের দুপুরের খাবার" : "Today's Lunch"}
          </span>
          <div className="text-2xl font-black text-slate-900">{totalLunch} Meals</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Cut-off: 8:00 AM Today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">
            {locale === "bn" ? "আজকের রাতের খাবার" : "Today's Dinner"}
          </span>
          <div className="text-2xl font-black text-slate-900">{totalDinner} Meals</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            Cut-off: 4:00 PM (Active)
          </span>
        </div>

        <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-indigo-100 block mb-1">
            {locale === "bn" ? "লাইভ বর্তমান মিল রেট" : "Live Meal Rate"}
          </span>
          <div className="text-2xl font-black">৳ {calculatedMealRate}</div>
          <span className="text-[10px] text-indigo-200 mt-0.5 block">
            ৳{totalMonthBazar} Bazar ÷ {totalMonthMeals} Meals
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. MASTER TRANSPARENT MEAL & BAZAR SHEET (কে কত খেলো, কার কত বাকি) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                {locale === "bn"
                  ? "মেসের পূর্ণাঙ্গ মিল ও বাজার সমন্বয় বিবরণী (সবার জন্য উন্মুক্ত)"
                  : "Transparent Master Meal & Bazar Ledger (Visible to All Members)"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {locale === "bn"
                ? "কে কত মিল খেলেন, কে কত টাকার বাজার জমা দিলেন এবং মিল বাবদ কার কত টাকা বাকি বা ফেরত পাবেন তা নিচে বিস্তারিত দেওয়া হলো।"
                : "Real-time ledger showing meals consumed, grocery spending by each member, and final net receivable/payable."}
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
            100% Audit Transparency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{locale === "bn" ? "মেম্বারের নাম" : "Member Name"}</th>
                <th className="py-3 px-3">{locale === "bn" ? "রুম নম্বর" : "Room"}</th>
                <th className="py-3 px-3 text-center">{locale === "bn" ? "মোট মিল খাওয়া" : "Total Meals"}</th>
                <th className="py-3 px-3 text-center">{locale === "bn" ? "বাজার জমা" : "Bazar Spent"}</th>
                <th className="py-3 px-3 text-center">{locale === "bn" ? "মিল বাবদ খরচ" : "Meal Expense"}</th>
                <th className="py-3 px-4 text-right">
                  {locale === "bn" ? "চূড়ান্ত অবস্থা (পাবে / বাকি)" : "Net Balance (Refund / Due)"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mealSummaryList.map((item) => {
                const memberCost = Math.round(item.totalMeals * Number(calculatedMealRate));
                const netBalance = item.totalBazar - memberCost;
                const isRefund = netBalance > 0;
                const isDue = netBalance < 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.role === "MEAL_MANAGER" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Manager
                          </span>
                        )}
                        {item.role === "OWNER" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            Owner
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">{item.room}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800 text-sm">
                      {item.totalMeals}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-emerald-700">
                      ৳ {item.totalBazar.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                      ৳ {memberCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-sm">
                      {isRefund && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+৳ {Math.abs(netBalance).toLocaleString()} পাবে</span>
                        </span>
                      )}
                      {isDue && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>-৳ {Math.abs(netBalance).toLocaleString()} বাকি</span>
                        </span>
                      )}
                      {netBalance === 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                          পরিশোধিত
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td className="py-3 px-4" colSpan={2}>
                  {locale === "bn" ? "মোট সর্বমোট (Total):" : "Total Mess Kitchen:"}
                </td>
                <td className="py-3 px-3 text-center text-sm">{totalMonthMeals} Meals</td>
                <td className="py-3 px-3 text-center text-sm text-emerald-700">৳ {totalMonthBazar.toLocaleString()}</td>
                <td className="py-3 px-3 text-center text-sm">৳ {totalMonthBazar.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-xs text-slate-500">
                  {locale === "bn" ? "১০০% ব্যালেন্সড" : "Fully Reconciled"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DAILY MEAL ATTENDANCE TABLE (With Strict Edit Guard) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                {locale === "bn"
                  ? `আজকের মিল হাজিরা তালিকা (${selectedDate})`
                  : `Member Attendance Roster (${selectedDate})`}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {locale === "bn"
                ? "সদস্যরা কেবল নিজের মিল অন/অফ করতে পারেন। ম্যানেজারের অনুমতি ছাড়া অন্যের মিল পরিবর্তন করা যায় না।"
                : "Members can toggle their own attendance. Other rows are locked unless logged in as Manager/Admin."}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start">
            Total Day Meals: {totalDayMeals}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3 text-center">Room-Bed</th>
                <th className="py-3 px-3 text-center">Breakfast</th>
                <th className="py-3 px-3 text-center">Lunch</th>
                <th className="py-3 px-3 text-center">Dinner</th>
                <th className="py-3 px-3 text-center">Guest Meals</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Day Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {membersMeals.map((m) => {
                const dayTotal = m.breakfast + m.lunch + m.dinner + m.guestBreakfast + m.guestLunch + m.guestDinner;
                const canEditThisRow = canManageAll || isUserOwnRow(m.name);

                return (
                  <tr key={m.id} className={m.isOff ? "bg-slate-50/70 opacity-60" : "hover:bg-slate-50/50"}>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                          {m.name.charAt(0)}
                        </span>
                        <div>
                          <span>{m.name}</span>
                          {isUserOwnRow(m.name) && (
                            <span className="ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                      {m.room}
                    </td>

                    {/* Breakfast Controls */}
                    <td className="py-3.5 px-3 text-center">
                      {canEditThisRow ? (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateMeal(m.id, "breakfast", -1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-4 font-bold text-slate-900 text-center">{m.breakfast}</span>
                          <button
                            onClick={() => updateMeal(m.id, "breakfast", 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span className="font-bold">{m.breakfast}</span>
                        </div>
                      )}
                    </td>

                    {/* Lunch Controls */}
                    <td className="py-3.5 px-3 text-center">
                      {canEditThisRow ? (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateMeal(m.id, "lunch", -1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-4 font-bold text-slate-900 text-center">{m.lunch}</span>
                          <button
                            onClick={() => updateMeal(m.id, "lunch", 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span className="font-bold">{m.lunch}</span>
                        </div>
                      )}
                    </td>

                    {/* Dinner Controls */}
                    <td className="py-3.5 px-3 text-center">
                      {canEditThisRow ? (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateMeal(m.id, "dinner", -1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-4 font-bold text-slate-900 text-center">{m.dinner}</span>
                          <button
                            onClick={() => updateMeal(m.id, "dinner", 1)}
                            className="w-5 h-5 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span className="font-bold">{m.dinner}</span>
                        </div>
                      )}
                    </td>

                    {/* Guest Meals */}
                    <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                      {m.guestLunch > 0 ? `${m.guestLunch} Lunch` : "0"}
                    </td>

                    {/* Toggle All Off Button */}
                    <td className="py-3.5 px-4 text-center">
                      {canEditThisRow ? (
                        <button
                          onClick={() => toggleAllOff(m.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                            m.isOff
                              ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          {m.isOff ? "MEALS OFF" : "ACTIVE"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <Lock className="w-3 h-3" />
                          <span>{m.isOff ? "OFF" : "ON"}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                      {dayTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
