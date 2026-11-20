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

export default function MealsPage() {
  const { t, role, showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-11-20");

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

  const updateMeal = (id: string, field: "breakfast" | "lunch" | "dinner", change: number) => {
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
    setMembersMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.isOff;
          showToast(
            nextState
              ? `All meals turned OFF for ${m.name}`
              : `Meals restored for ${m.name}`,
            "info"
          );
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
  };

  const handleSaveAll = () => {
    showToast("Today's meal attendance successfully saved and locked!", "success");
  };

  // Calculations
  const totalBreakfast = membersMeals.reduce((acc, m) => acc + m.breakfast + m.guestBreakfast, 0);
  const totalLunch = membersMeals.reduce((acc, m) => acc + m.lunch + m.guestLunch, 0);
  const totalDinner = membersMeals.reduce((acc, m) => acc + m.dinner + m.guestDinner, 0);
  const totalDayMeals = totalBreakfast + totalLunch + totalDinner;

  const totalMonthBazar = 3090;
  const monthTotalMeals = 56.5;
  const currentMealRate = (totalMonthBazar / monthTotalMeals).toFixed(2);

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
            {t.meals.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Flexible meal booking with dynamic cut-off enforcement & guest meal management.
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

          {(role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Today's Breakfast</span>
          <div className="text-2xl font-black text-slate-900">{totalBreakfast} Meals</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Cut-off: 10 PM (Prev Night)</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Today's Lunch</span>
          <div className="text-2xl font-black text-slate-900">{totalLunch} Meals</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Cut-off: 8:00 AM Today</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Today's Dinner</span>
          <div className="text-2xl font-black text-slate-900">{totalDinner} Meals</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
            Cut-off: 4:00 PM (Active)
          </span>
        </div>
        <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-indigo-100 block mb-1">Live Estimated Meal Rate</span>
          <div className="text-2xl font-black">৳ {currentMealRate}</div>
          <span className="text-[10px] text-indigo-200 mt-0.5 block">
            ৳{totalMonthBazar} Bazar ÷ {monthTotalMeals} Meals
          </span>
        </div>
      </div>

      {/* Interactive Member Meal Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Member Attendance List ({selectedDate})</h2>
            <p className="text-xs text-slate-500">
              Click (+ / -) to adjust meal count. Member or Manager can adjust before cut-off.
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
                return (
                  <tr key={m.id} className={m.isOff ? "bg-slate-50/70 opacity-60" : "hover:bg-slate-50/50"}>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                          {m.name.charAt(0)}
                        </span>
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                      {m.room}
                    </td>

                    {/* Breakfast Controls */}
                    <td className="py-3.5 px-3 text-center">
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
                    </td>

                    {/* Lunch Controls */}
                    <td className="py-3.5 px-3 text-center">
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
                    </td>

                    {/* Dinner Controls */}
                    <td className="py-3.5 px-3 text-center">
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
                    </td>

                    {/* Guest Meals */}
                    <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                      {m.guestLunch > 0 ? `${m.guestLunch} Lunch` : "None"}
                    </td>

                    {/* Toggle All Off Button */}
                    <td className="py-3.5 px-4 text-center">
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

      {/* Meal Rate Engine & Educational Explainer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">How MessMate Computes the Meal Rate</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          In MessMate, the meal rate is strictly calculated from real ledger data. Every bazar expenditure recorded by members or managers is summed up and divided by the total number of meals consumed by all members across the billing period.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-slate-500 block mb-1">Standard Formula:</span>
            <span className="font-bold">Meal Rate = Total Bazar Expenses ÷ Total Meals Consumed</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block mb-1">Current Month Status:</span>
            <span className="font-bold text-indigo-600">৳ 3,090 ÷ 56.5 = ৳ 54.69 / meal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
