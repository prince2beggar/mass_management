"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  Utensils,
  ShoppingCart,
  Calendar,
  CheckCircle,
  X,
  FileSpreadsheet,
  PieChart,
  BarChart2,
  DollarSign,
  User,
} from "lucide-react";

export default function ReportsPage() {
  const { t, showToast } = useApp();

  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState({
    name: "Kamrul Islam",
    email: "kamrul@greenview.com",
    room: "Room 101, Bed A",
    invoiceNumber: "INV-GV-202611-001",
    month: "November 2026",
    mealsCount: 34,
    mealRate: 54.5,
    mealTotal: 1853,
    rent: 3500,
    wifi: 250,
    maid: 500,
    trash: 200,
    totalBill: 6303,
    paid: 5000,
    due: 1303,
  });

  const triggerExport = (type: "bazar" | "meals" | "finance") => {
    showToast(`Generating ${type.toUpperCase()} CSV export...`, "info");
    const link = document.createElement("a");
    link.href = `/api/reports?tenant=green-view&dataset=${type}`;
    link.download = `${type}-report-green-view.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast(`${type.toUpperCase()} file downloaded successfully!`, "success");
    }, 1200);
  };

  const printStatement = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <BarChart2 className="w-4 h-4" />
            <span>Management Analytics & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.reports.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.reports.subtitle}
          </p>
        </div>
      </div>

      {/* KPI Insight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">{t.reports.collectionRate}</span>
          <div className="text-3xl font-black text-emerald-600">88.7%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">৳11,450 of ৳12,900 collected</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Kitchen Bazar</span>
          <div className="text-3xl font-black text-slate-900">৳ 3,090</div>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">November 2026</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Consumed Meals</span>
          <div className="text-3xl font-black text-indigo-600">56.5</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Across all 5 active members</span>
        </div>
        <div className="bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white p-5 rounded-2xl shadow-xs">
          <span className="text-xs text-indigo-200 block mb-1">Computed Meal Rate</span>
          <div className="text-3xl font-black text-emerald-300">৳ 54.69</div>
          <span className="text-[10px] text-indigo-200 mt-1 block">৳3,090 ÷ 56.5 meals</span>
        </div>
      </div>

      {/* One-Click Automated Export Center */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>Automated Excel / CSV Export Center</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly export complete ledger records, daily meal attendance, and member financial statements.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Real-time Database Extraction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Export Bazar */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-2">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.reports.exportBazar}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Itemized shopping vouchers, weights, shopper names, and verification stamps.
              </p>
            </div>
            <button
              onClick={() => triggerExport("bazar")}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bazar CSV</span>
            </button>
          </div>

          {/* Export Meals */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.reports.exportMeals}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Full month attendance matrix for breakfast, lunch, dinner, and guest meals.
              </p>
            </div>
            <button
              onClick={() => triggerExport("meals")}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Meals CSV</span>
            </button>
          </div>

          {/* Export Finance */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 transition flex flex-col justify-between space-y-3">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.reports.exportFinance}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Member rent, utility split, meal charges, amount paid, and outstanding dues.
              </p>
            </div>
            <button
              onClick={() => triggerExport("finance")}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Dues CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Member Monthly Statement Generator Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>{t.reports.monthlyStatement} (November 2026)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate and print official individualized monthly statements for any resident.
            </p>
          </div>

          <button
            onClick={() => setStatementModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition self-start"
          >
            <Printer className="w-4 h-4" />
            <span>Open Statement Print Preview</span>
          </button>
        </div>

        {/* Member Statements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Kamrul Islam", room: "Room 101-A", total: 6303, paid: 5000, due: 1303, meals: 34 },
            { name: "Sakib Al Mahmud", room: "Room 101-B", total: 6085, paid: 6085, due: 0, meals: 30 },
            { name: "Mehedi Hasan", room: "Room 102-A", total: 5785, paid: 5000, due: 785, meals: 25 },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <span className="font-mono text-[10px] text-slate-500">{m.room}</span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Meals Consumed:</span>
                    <span className="font-bold">{m.meals} Meals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Assessed Bill:</span>
                    <span className="font-bold text-slate-900">৳ {m.total}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Paid:</span>
                    <span className="font-bold">৳ {m.paid}</span>
                  </div>
                  <div className="flex justify-between font-bold text-rose-600">
                    <span>Remaining Due:</span>
                    <span>৳ {m.due}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMember({
                    name: m.name,
                    email: `${m.name.toLowerCase().replace(/\s+/g, "")}@greenview.com`,
                    room: m.room,
                    invoiceNumber: `INV-GV-202611-00${idx + 1}`,
                    month: "November 2026",
                    mealsCount: m.meals,
                    mealRate: 54.5,
                    mealTotal: Math.round(m.meals * 54.5),
                    rent: 3500,
                    wifi: 250,
                    maid: 500,
                    trash: 200,
                    totalBill: m.total,
                    paid: m.paid,
                    due: m.due,
                  });
                  setStatementModalOpen(true);
                }}
                className="w-full py-1.5 rounded-lg bg-white border border-slate-300 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold transition"
              >
                View Formal Statement →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Printable Statement Modal */}
      {statementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Header controls (hidden on print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Official Monthly Statement Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={printStatement}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.reports.printStatement}</span>
                </button>
                <button
                  onClick={() => setStatementModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Statement Document */}
            <div className="space-y-6 text-slate-900 font-sans" id="printable-statement">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    Green View Student Mess
                  </h1>
                  <p className="text-xs text-slate-600">House 42, Road 4, Farmgate, Tejgaon, Dhaka-1215</p>
                  <p className="text-xs text-slate-600">Mobile: +880 1819-223344 • Email: contact@greenviewmess.com</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                    Monthly Statement
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                    {selectedMember.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-500">Period: {selectedMember.month}</div>
                </div>
              </div>

              {/* Member Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Resident Member:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedMember.name}</span>
                  <span className="block text-slate-600">{selectedMember.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Seat / Room Allocation:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedMember.room}</span>
                  <span className="block text-slate-600">Date Issued: 20 November 2026</span>
                </div>
              </div>

              {/* Itemized Calculation Breakdown */}
              <div className="space-y-2">
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Basis / Quantity</th>
                      <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-medium">Seat / Bed Rent</td>
                      <td className="py-2 px-3 text-center text-slate-500">Monthly Contract</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {selectedMember.rent}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Kitchen Meal Charge</td>
                      <td className="py-2 px-3 text-center text-slate-500">
                        {selectedMember.mealsCount} Meals @ ৳{selectedMember.mealRate}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {selectedMember.mealTotal}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">WiFi & Gigabit Internet</td>
                      <td className="py-2 px-3 text-center text-slate-500">Equal Shared Split</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {selectedMember.wifi}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Cook & Maid Salary</td>
                      <td className="py-2 px-3 text-center text-slate-500">Equal Shared Split</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {selectedMember.maid}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Waste Management & Cleaning</td>
                      <td className="py-2 px-3 text-center text-slate-500">City Corporation Fee</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {selectedMember.trash}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 text-slate-900">
                        Total Monthly Assessment:
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-900 text-sm">৳ {selectedMember.totalBill}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-2 px-3 text-emerald-700">
                        Less: Total Payments Credited (bKash):
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-700">- ৳ {selectedMember.paid}</td>
                    </tr>
                    <tr className="bg-rose-50 text-rose-900">
                      <td colSpan={2} className="py-2.5 px-3 font-black">
                        Net Outstanding Balance Due:
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-sm text-rose-700">
                        ৳ {selectedMember.due}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs text-slate-600">
                <div className="text-center space-y-1">
                  <div className="w-36 border-b border-slate-400 pb-1 font-mono text-[11px]">
                    Kamrul Islam
                  </div>
                  <span>Member Signature</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-36 border-b border-slate-400 pb-1 font-mono text-[11px] font-bold text-indigo-700">
                    Tanvir Hasan
                  </div>
                  <span>Mess Manager / Accountant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
