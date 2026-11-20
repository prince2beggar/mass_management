"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Utensils,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  AlertCircle,
  Calendar,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { t, showToast } = useApp();

  // Interactive Meal State for Today
  const [meals, setMeals] = useState({
    breakfast: 1,
    lunch: 1,
    dinner: 1,
    guestBreakfast: 0,
    guestLunch: 0,
    guestDinner: 0,
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("1450");
  const [payMethod, setPayMethod] = useState("BKASH");
  const [trxId, setTrxId] = useState("");

  const toggleMeal = (type: "breakfast" | "lunch" | "dinner") => {
    setMeals((prev) => {
      const current = prev[type];
      const nextVal = current > 0 ? 0 : 1;
      showToast(
        nextVal > 0
          ? `${type.toUpperCase()} turned ON for today.`
          : `${type.toUpperCase()} turned OFF for today.`,
        "success"
      );
      return { ...prev, [type]: nextVal };
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId && payMethod !== "CASH") {
      showToast("Please enter transaction ID", "error");
      return;
    }
    showToast(`Payment of ৳ ${payAmount} via ${payMethod} submitted for manager verification!`, "success");
    setPaymentModalOpen(false);
    setTrxId("");
  };

  const mealRate = 54.5;
  const myTotalMealsThisMonth = 34;
  const estimatedMealCost = Math.round(myTotalMealsThisMonth * mealRate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Member Profile Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center font-extrabold text-xl">
            KI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">Kamrul Islam</h1>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
                Active Member
              </span>
            </div>
            <p className="text-xs text-indigo-100 mt-0.5">
              Green View Student Mess • Room 101 (Bed A) • Farmgate, Dhaka
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Due (৳ 1,450)</span>
          </button>
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 border border-white/20 text-white font-semibold text-xs transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Meal History</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Today's Meal Switcher (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-indigo-600" />
                  <span>{t.meals.todayAttendance}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Friday, 20 November 2026 • 1-click instant meal toggle
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Live Synchronization
              </span>
            </div>

            {/* Meal Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Breakfast */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  meals.breakfast > 0
                    ? "bg-indigo-50/60 border-indigo-200 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.meals.breakfast}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      meals.breakfast > 0 ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div className="text-2xl font-black text-slate-900 mb-1">
                  {meals.breakfast > 0 ? "1 Meal" : "OFF"}
                </div>
                <span className="text-[10px] text-slate-500 block mb-3">Cut-off: 10:00 PM (Passed)</span>
                <button
                  onClick={() => toggleMeal("breakfast")}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    meals.breakfast > 0
                      ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {meals.breakfast > 0 ? t.meals.turnOffMeal : t.meals.turnOnMeal}
                </button>
              </div>

              {/* Lunch */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  meals.lunch > 0
                    ? "bg-indigo-50/60 border-indigo-200 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.meals.lunch}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      meals.lunch > 0 ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div className="text-2xl font-black text-slate-900 mb-1">
                  {meals.lunch > 0 ? "1 Meal" : "OFF"}
                </div>
                <span className="text-[10px] text-slate-500 block mb-3">Cut-off: 8:00 AM (Passed)</span>
                <button
                  onClick={() => toggleMeal("lunch")}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    meals.lunch > 0
                      ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {meals.lunch > 0 ? t.meals.turnOffMeal : t.meals.turnOnMeal}
                </button>
              </div>

              {/* Dinner */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  meals.dinner > 0
                    ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.meals.dinner}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      meals.dinner > 0 ? "bg-emerald-600 animate-ping" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div className="text-2xl font-black text-slate-900 mb-1">
                  {meals.dinner > 0 ? "1 Meal" : "OFF"}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block mb-3">
                  Cut-off: 4:00 PM (Active!)
                </span>
                <button
                  onClick={() => toggleMeal("dinner")}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    meals.dinner > 0
                      ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {meals.dinner > 0 ? t.meals.turnOffMeal : t.meals.turnOnMeal}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{t.meals.cutoffNotice}</span>
            </div>
          </div>

          {/* 7-Day Meal Breakdown Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Past 7 Days Attendance Log</h3>
              <span className="text-xs text-indigo-600 font-semibold">Total: 19 Meals</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-center">Breakfast</th>
                    <th className="py-2.5 px-3 text-center">Lunch</th>
                    <th className="py-2.5 px-3 text-center">Dinner</th>
                    <th className="py-2.5 px-3 text-right">Daily Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Nov 20 (Today)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{meals.breakfast}</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{meals.lunch}</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{meals.dinner}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {meals.breakfast + meals.lunch + meals.dinner}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Nov 19 (Thu)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">3</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Nov 18 (Wed)</td>
                    <td className="py-2.5 px-3 text-center text-slate-400 font-medium">0</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">2</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Nov 17 (Tue)</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Dues & Personal Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dues & Balance Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>Monthly Bill & Ledger</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                November 2026
              </span>
            </div>

            {/* Total Balance highlight */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Remaining Outstanding Due</span>
                <span className="text-2xl font-black text-rose-400">৳ 1,450.00</span>
              </div>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Pay Now
              </button>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Room / Seat Rent (Room 101, Bed A):</span>
                <span className="font-bold text-slate-900">৳ 3,500</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Meal Bill ({myTotalMealsThisMonth} meals × ৳54.50):</span>
                <span className="font-bold text-slate-900">৳ {estimatedMealCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>WiFi & Router Fee:</span>
                <span className="font-bold text-slate-900">৳ 250</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cook & Maid Shared Salary:</span>
                <span className="font-bold text-slate-900">৳ 500</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Waste Collection:</span>
                <span className="font-bold text-slate-900">৳ 200</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-900">
                <span>Total Month Assessment:</span>
                <span>৳ 6,450</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Paid via bKash (Trx: BKH9123891823):</span>
                <span>- ৳ 5,000</span>
              </div>
            </div>

            <Link
              href="/finance"
              className="block text-center text-xs font-semibold py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              View Full Statement & Transaction History →
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/bazar"
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 font-medium transition flex flex-col justify-between gap-2"
              >
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <span>Submit Bazar Expense</span>
              </Link>
              <Link
                href="/notices"
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 font-medium transition flex flex-col justify-between gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Mess Notices</span>
              </Link>
              <Link
                href="/emergency"
                className="p-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 font-medium transition flex flex-col justify-between gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Emergency Hotlines</span>
              </Link>
              <Link
                href="/rooms"
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 font-medium transition flex flex-col justify-between gap-2"
              >
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Room Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Payment Submission Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Make a Payment</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {["BKASH", "NAGAD", "ROCKET", "CASH"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl font-bold border transition ${
                        payMethod === m
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount to Pay (BDT)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {payMethod !== "CASH" && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {payMethod} Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BKH98129381"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Send money to Merchant / Manager Number: 01819-223344
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
