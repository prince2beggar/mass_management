"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CreditCard,
  DollarSign,
  Receipt,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  ShieldAlert,
  Send,
  X,
  Printer,
} from "lucide-react";

export default function FinancePage() {
  const { t, role, showToast } = useApp();

  const [invoices, setInvoices] = useState([
    {
      id: "inv-1",
      number: "INV-GV-202611-001",
      member: "Kamrul Islam",
      room: "Room 101, Bed A",
      month: "November 2026",
      totalAmount: 6450,
      paidAmount: 5000,
      dueAmount: 1450,
      status: "PARTIAL",
      items: [
        { name: "Seat Rent (Room 101, Bed A)", amount: 3500 },
        { name: "Meal Cost Advance (50 meals)", amount: 2000 },
        { name: "WiFi & High-Speed Internet", amount: 250 },
        { name: "Cook & Maid Salary Shared Split", amount: 500 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
    {
      id: "inv-2",
      number: "INV-GV-202611-002",
      member: "Sakib Al Mahmud",
      room: "Room 101, Bed B",
      month: "November 2026",
      totalAmount: 6450,
      paidAmount: 6450,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 101, Bed B)", amount: 3500 },
        { name: "Meal Cost Advance", amount: 2000 },
        { name: "WiFi & High-Speed Internet", amount: 250 },
        { name: "Cook & Maid Salary Shared Split", amount: 500 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: "lg-1",
      date: "2026-11-01",
      member: "Kamrul Islam",
      type: "DEBIT",
      description: "November Monthly Invoice Generated (INV-GV-202611-001)",
      amount: 6450,
      balanceAfter: -6450,
    },
    {
      id: "lg-2",
      date: "2026-11-03",
      member: "Kamrul Islam",
      type: "CREDIT",
      description: "Payment via bKash (TrxID: BKH9123891823)",
      amount: 5000,
      balanceAfter: -1450,
    },
  ]);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(invoices[0]);
  const [payAmount, setPayAmount] = useState("1450");
  const [payMethod, setPayMethod] = useState("BKASH");
  const [trxId, setTrxId] = useState("");

  const handlePayInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.dueAmount.toString());
    setPaymentModalOpen(true);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (!amountNum || amountNum <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === selectedInvoice.id) {
          const newPaid = inv.paidAmount + amountNum;
          const newDue = Math.max(0, inv.totalAmount - newPaid);
          const newStatus = newDue === 0 ? "PAID" : "PARTIAL";
          return {
            ...inv,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    const newLedger = {
      id: `lg-${Date.now()}`,
      date: "2026-11-20",
      member: selectedInvoice.member,
      type: "CREDIT",
      description: `Payment via ${payMethod} (TrxID: ${trxId || "CASH-PAID"})`,
      amount: amountNum,
      balanceAfter: -Math.max(0, selectedInvoice.dueAmount - amountNum),
    };

    setLedgerEntries([newLedger, ...ledgerEntries]);
    showToast(`Payment of ৳ ${payAmount} recorded successfully!`, "success");
    setPaymentModalOpen(false);
    setTrxId("");
  };

  const handleMonthlyClosing = () => {
    showToast(
      "Monthly closing completed! Final meal rate ৳54.50 reconciled, invoices updated.",
      "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <CreditCard className="w-4 h-4" />
            <span>Financial Integrity & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.finance.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-entry ledger, digital payment reconciliation (bKash/Nagad/Bank), and automated monthly closing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
            <button
              onClick={handleMonthlyClosing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.finance.closeMonthAction}</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total November Rent Invoiced</span>
          <div className="text-3xl font-black text-slate-900">৳ 12,900</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
            ৳ 11,450 collected (88.7%)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Outstanding Dues</span>
          <div className="text-3xl font-black text-rose-600">৳ 1,450</div>
          <span className="text-[10px] text-rose-500 mt-1 block">
            1 member with pending balance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Kitchen Bazar Spent</span>
          <div className="text-3xl font-black text-indigo-600">৳ 3,090</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Reconciles to 56.5 meals</span>
        </div>
      </div>

      {/* Member Invoices */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Active Invoices</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600">{inv.number}</span>
                    <h3 className="font-bold text-slate-900 text-base">{inv.member}</h3>
                    <p className="text-xs text-slate-500">{inv.room} • {inv.month}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-100 text-xs">
                  {inv.items.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between text-slate-600">
                      <span>{it.name}</span>
                      <span className="font-bold text-slate-900">৳ {it.amount}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-bold text-slate-900 text-xs">
                    <span>Total Bill:</span>
                    <span>৳ {inv.totalAmount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-emerald-600 font-semibold">Paid: ৳ {inv.paidAmount}</span>
                  <span className="text-rose-600 font-bold">Due: ৳ {inv.dueAmount}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {inv.dueAmount > 0 ? (
                  <button
                    onClick={() => handlePayInvoice(inv)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Pay Remaining Due (৳ {inv.dueAmount})
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-center font-bold text-xs border border-emerald-200">
                    ✓ Invoice Fully Settled
                  </div>
                )}
                <a
                  href="/reports"
                  className="w-full py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-center font-semibold text-xs transition"
                >
                  Print / Download PDF Statement →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traceable Audit Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Member Financial Ledger (Single Source of Truth)</h3>
            <p className="text-xs text-slate-500">Every charge and payment creates an immutable ledger entry.</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Append-only Audit Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                <th className="py-2.5 px-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ledgerEntries.map((lg) => (
                <tr key={lg.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-slate-600">{lg.date}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{lg.member}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lg.type === "CREDIT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {lg.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800">{lg.description}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {lg.type === "CREDIT" ? `+ ৳ ${lg.amount}` : `- ৳ ${lg.amount}`}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ৳ {lg.balanceAfter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Clear Due: {selectedInvoice?.number}</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {["BKASH", "NAGAD", "ROCKET", "CASH"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl font-bold border transition ${
                        payMethod === m
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount (BDT)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 text-sm outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900 outline-none"
                  />
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
                  Confirm & Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
