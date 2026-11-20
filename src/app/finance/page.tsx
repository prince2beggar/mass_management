"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  X,
  Lock,
  Edit3,
  Trash2,
  Save,
  TrendingUp,
  TrendingDown,
  Utensils,
  Layers,
  Split,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Receipt,
  User,
  Shield,
  HelpCircle,
} from "lucide-react";

interface InvoiceItem {
  name: string;
  amount: number;
}

interface Invoice {
  id: string;
  number: string;
  member: string;
  room: string;
  month: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "PAID" | "PARTIAL" | "PENDING";
  items: InvoiceItem[];
}

interface MemberMealAccount {
  memberName: string;
  room: string;
  totalMeals: number;
  mealRate: number;
  totalBazarSpent: number;
  mealCost: number; // totalMeals * mealRate
  netMealBalance: number; // totalBazarSpent - mealCost (>0: পাবে/Refund, <0: দিবে/Due)
}

export default function FinancePage() {
  const { role, currentUser, showToast, locale } = useApp();

  // Access Control: Mess Admin or Super Admin can edit & see all members' rent bills
  const isOwnerOrAdmin = role === "ADMIN" || role === "OWNER" || role === "SUPER_ADMIN";

  // Identify current member
  const currentMemberName = currentUser?.name || (role === "MEAL_MANAGER" ? "Tanvir Hasan" : "Kamrul Islam");

  // Clean 2-Way View Mode: COMBINED (একত্রিত মোট বিল) vs SEPARATE (আলাদা আলাদা হিসাব)
  const [viewMode, setViewMode] = useState<"COMBINED" | "SEPARATE">("COMBINED");

  // Collapsible detailed breakdown state per invoice
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // 1. Rent & Utilities Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-1",
      number: "INV-GV-202611-001",
      member: "Kamrul Islam",
      room: "Room 101, Bed A",
      month: "November 2026",
      totalAmount: 4450,
      paidAmount: 3000,
      dueAmount: 1450,
      status: "PARTIAL",
      items: [
        { name: "Seat Rent (Room 101, Bed A)", amount: 3500 },
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
      totalAmount: 4450,
      paidAmount: 4450,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 101, Bed B)", amount: 3500 },
        { name: "WiFi & High-Speed Internet", amount: 250 },
        { name: "Cook & Maid Salary Shared Split", amount: 500 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
    {
      id: "inv-3",
      number: "INV-GV-202611-003",
      member: "Mehedi Hasan",
      room: "Room 102, Bed A",
      month: "November 2026",
      totalAmount: 4150,
      paidAmount: 4150,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 102, Bed A)", amount: 3200 },
        { name: "WiFi & High-Speed Internet", amount: 250 },
        { name: "Cook & Maid Salary Shared Split", amount: 500 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
    {
      id: "inv-4",
      number: "INV-GV-202611-004",
      member: "Tanvir Hasan",
      room: "Room 102, Bed B",
      month: "November 2026",
      totalAmount: 4150,
      paidAmount: 4150,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 102, Bed B)", amount: 3200 },
        { name: "WiFi & High-Speed Internet", amount: 250 },
        { name: "Cook & Maid Salary Shared Split", amount: 500 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
    {
      id: "inv-5",
      number: "INV-GV-202611-005",
      member: "Rahim Ahmed",
      room: "Room 201, Master Bed",
      month: "November 2026",
      totalAmount: 950,
      paidAmount: 950,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Mess Maintenance & Common Electricity", amount: 500 },
        { name: "WiFi & Internet Common Node", amount: 250 },
        { name: "Waste Disposal Fee", amount: 200 },
      ],
    },
  ]);

  // 2. Personal Meal & Bazar Accounting (বাজার থেকে কত পাবে বা দিবে)
  const [mealAccounts] = useState<Record<string, MemberMealAccount>>({
    "Kamrul Islam": {
      memberName: "Kamrul Islam",
      room: "Room 101, Bed A",
      totalMeals: 34,
      mealRate: 54.5,
      totalBazarSpent: 2400,
      mealCost: 1853,
      netMealBalance: 547, // +547 পাবে (Refund)
    },
    "Sakib Al Mahmud": {
      memberName: "Sakib Al Mahmud",
      room: "Room 101, Bed B",
      totalMeals: 28,
      mealRate: 54.5,
      totalBazarSpent: 1000,
      mealCost: 1526,
      netMealBalance: -526, // -526 দিবে (Due)
    },
    "Mehedi Hasan": {
      memberName: "Mehedi Hasan",
      room: "Room 102, Bed A",
      totalMeals: 31,
      mealRate: 54.5,
      totalBazarSpent: 0,
      mealCost: 1690,
      netMealBalance: -1690, // -1690 দিবে (Due)
    },
    "Tanvir Hasan": {
      memberName: "Tanvir Hasan",
      room: "Room 102, Bed B",
      totalMeals: 32,
      mealRate: 54.5,
      totalBazarSpent: 3090,
      mealCost: 1744,
      netMealBalance: 1346, // +1346 পাবে (Refund)
    },
    "Rahim Ahmed": {
      memberName: "Rahim Ahmed",
      room: "Room 201, Master Bed",
      totalMeals: 30,
      mealRate: 54.5,
      totalBazarSpent: 1500,
      mealCost: 1635,
      netMealBalance: -135, // -135 দিবে (Due)
    },
  });

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: "lg-1",
      date: "2026-11-03",
      member: "Kamrul Islam",
      description: "Payment via bKash for Room Rent",
      amount: 3000,
    },
    {
      id: "lg-2",
      date: "2026-11-15",
      member: "Kamrul Islam",
      description: "Daily Bazar Expense Contribution (Vegetables, Chicken, Oil)",
      amount: 2400,
    },
    {
      id: "lg-3",
      date: "2026-11-02",
      member: "Sakib Al Mahmud",
      description: "Full Rent & Utilities paid via Nagad",
      amount: 4450,
    },
  ]);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [payAmount, setPayAmount] = useState("903");
  const [payPurpose, setPayPurpose] = useState<"COMBINED" | "RENT" | "MEALS">("COMBINED");
  const [payMethod, setPayMethod] = useState("BKASH");
  const [trxId, setTrxId] = useState("");
  const [adminMemberFilter, setAdminMemberFilter] = useState("ALL");

  // Edit Bill Modal State (Admin only)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editItems, setEditItems] = useState<InvoiceItem[]>([]);
  const [editPaidAmount, setEditPaidAmount] = useState<number>(0);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  // PRIVACY: Members only see their own bill! Admin sees all.
  const visibleInvoices = isOwnerOrAdmin
    ? adminMemberFilter === "ALL"
      ? invoices
      : invoices.filter((inv) => inv.member === adminMemberFilter)
    : invoices.filter((inv) => {
        const firstName = currentMemberName.split(" ")[0].toLowerCase();
        return inv.member.toLowerCase().includes(firstName);
      });

  // Calculation Helper
  const getCalculation = (inv: Invoice) => {
    const mealAcc = mealAccounts[inv.member] || {
      memberName: inv.member,
      room: inv.room,
      totalMeals: 30,
      mealRate: 54.5,
      totalBazarSpent: 1500,
      mealCost: 1635,
      netMealBalance: 0,
    };

    const rentDue = inv.dueAmount;
    const mealRefund = mealAcc.netMealBalance > 0 ? mealAcc.netMealBalance : 0;
    const mealDue = mealAcc.netMealBalance < 0 ? Math.abs(mealAcc.netMealBalance) : 0;

    // Combined Net Payable = Rent Due + Meal Due - Meal Refund
    const netCombined = rentDue + mealDue - mealRefund;
    const isNetRefund = netCombined < 0;
    const finalPayable = Math.max(0, netCombined);
    const finalRefund = isNetRefund ? Math.abs(netCombined) : 0;

    return {
      mealAcc,
      rentDue,
      mealRefund,
      mealDue,
      netCombined,
      isNetRefund,
      finalPayable,
      finalRefund,
    };
  };

  const handleOpenPay = (inv: Invoice, purpose: "COMBINED" | "RENT" | "MEALS") => {
    setSelectedInvoice(inv);
    const calc = getCalculation(inv);
    setPayPurpose(purpose);

    if (purpose === "COMBINED") {
      setPayAmount(calc.finalPayable.toString());
    } else if (purpose === "RENT") {
      setPayAmount(calc.rentDue.toString());
    } else {
      setPayAmount(calc.mealDue.toString());
    }
    setPaymentModalOpen(true);
  };

  // Open Edit Bill Modal
  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditItems([...inv.items]);
    setEditPaidAmount(inv.paidAmount);
    setEditModalOpen(true);
  };

  const handleUpdateItemAmount = (idx: number, newAmount: number) => {
    setEditItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], amount: Math.max(0, newAmount) };
      return copy;
    });
  };

  const handleRemoveItem = (idx: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddCustomItem = () => {
    if (!newItemName || !newItemAmount) {
      showToast(locale === "bn" ? "চার্জের নাম ও টাকার পরিমাণ দিন" : "Provide item name and amount", "error");
      return;
    }
    const val = parseFloat(newItemAmount) || 0;
    setEditItems((prev) => [...prev, { name: newItemName, amount: val }]);
    setNewItemName("");
    setNewItemAmount("");
  };

  const handleSaveEditedInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const newTotal = editItems.reduce((acc, it) => acc + it.amount, 0);
    const newDue = Math.max(0, newTotal - editPaidAmount);
    const newStatus = newDue === 0 ? "PAID" : editPaidAmount > 0 ? "PARTIAL" : "PENDING";

    const updated: Invoice = {
      ...editingInvoice,
      items: editItems,
      totalAmount: newTotal,
      paidAmount: editPaidAmount,
      dueAmount: newDue,
      status: newStatus,
    };

    setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
    setEditModalOpen(false);

    showToast(
      locale === "bn"
        ? `${editingInvoice.member}-এর বিল সফলভাবে সেভ হয়েছে! মোট বকেয়া: ৳${newDue}`
        : `Bill updated successfully! Total due: ৳${newDue}`,
      "success"
    );
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (!amountNum || amountNum <= 0) {
      showToast("সঠিক টাকার পরিমাণ দিন", "error");
      return;
    }

    if (payPurpose === "RENT" || payPurpose === "COMBINED") {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === selectedInvoice.id) {
            const newPaid = inv.paidAmount + Math.min(inv.dueAmount, amountNum);
            const newDue = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              dueAmount: newDue,
              status: newDue === 0 ? "PAID" : "PARTIAL",
            };
          }
          return inv;
        })
      );
    }

    const newLg = {
      id: `lg-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      member: selectedInvoice.member,
      description: `Payment via ${payMethod} (${payPurpose}) - TrxID: ${trxId || "CASH"}`,
      amount: amountNum,
    };

    setLedgerEntries([newLg, ...ledgerEntries]);
    showToast(`৳${payAmount} সফলভাবে পরিশোধ করা হয়েছে!`, "success");
    setPaymentModalOpen(false);
    setTrxId("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* 1. CLEAN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {locale === "bn" ? "মাসিক বিল ও হিসাব" : "Bills & Accounts"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === "bn"
              ? "বাসা ভাড়া এবং মিল-বাজারের সহজ ও স্পষ্ট হিসাব"
              : "Simple & transparent room rent and meal accounting"}
          </p>
        </div>

        {/* 2-Option View Switcher (Combined vs Separate) */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("COMBINED")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === "COMBINED"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "একত্রিত মোট বিল (Combined)" : "Combined Bill"}</span>
          </button>
          <button
            onClick={() => setViewMode("SEPARATE")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === "SEPARATE"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "আলাদা আলাদা হিসাব (Separate)" : "Separate Bills"}</span>
          </button>
        </div>
      </div>

      {/* Admin Member Filter Pills (Only visible to Admin/Owner) */}
      {isOwnerOrAdmin && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">মেম্বার নির্বাচন:</span>
          {["ALL", "Kamrul Islam", "Sakib Al Mahmud", "Mehedi Hasan", "Tanvir Hasan"].map((name) => (
            <button
              key={name}
              onClick={() => setAdminMemberFilter(name)}
              className={`px-3 py-1 rounded-xl font-bold transition shrink-0 ${
                adminMemberFilter === name
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {name === "ALL" ? "সকল সদস্য (All)" : name.split(" ")[0]}
            </button>
          ))}
        </div>
      )}

      {/* 2. INVOICE CARDS */}
      <div className="space-y-6">
        {visibleInvoices.map((inv) => {
          const calc = getCalculation(inv);
          const isExpanded = expandedInvoiceId === inv.id;

          return (
            <div
              key={inv.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden"
            >
              {/* Member Top Bar */}
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                    {inv.member.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm">{inv.member}</h2>
                    <p className="text-[11px] text-slate-500">{inv.room} • {inv.month}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      inv.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inv.status}
                  </span>

                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => handleOpenEdit(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-white text-slate-700 font-semibold text-[11px] transition shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3 text-indigo-600" />
                      <span>এডিট</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* ======================================================== */}
                {/* OPTION A: COMBINED VIEW (একত্রিত মোট হিসাব) */}
                {/* ======================================================== */}
                {viewMode === "COMBINED" ? (
                  <div className="space-y-5">
                    {/* Big Clean Bottom-Line Card */}
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                          {locale === "bn" ? "মোট সমন্বয়কৃত প্রদেয় বিল" : "Net Payable Amount"}
                        </span>
                        <div className="text-3xl font-black text-slate-900 mt-0.5">
                          {calc.isNetRefund ? (
                            <span className="text-emerald-600">+৳ {calc.finalRefund.toLocaleString()} পাবে</span>
                          ) : (
                            <span>৳ {calc.finalPayable.toLocaleString()}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {calc.isNetRefund
                            ? "মেসের কিচেন ফান্ড থেকে আপনি এই টাকা ফেরত পাবেন।"
                            : "বাসা ভাড়া এবং মিলের বাজার হিসাব সমন্বয় করার পর মোট দিতে হবে।"}
                        </p>
                      </div>

                      {calc.finalPayable > 0 ? (
                        <button
                          onClick={() => handleOpenPay(inv, "COMBINED")}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 active:scale-95 shrink-0"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>পেমেন্ট করুন (৳ {calc.finalPayable})</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>পরিশোধিত</span>
                        </div>
                      )}
                    </div>

                    {/* Simple 2-Line Math Breakdown */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                      {/* Row 1: Rent Due */}
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span>বাসা ভাড়া ও ইউটিলিটি বকেয়া:</span>
                        </span>
                        <span className="font-bold text-slate-900">৳ {calc.rentDue}</span>
                      </div>

                      {/* Row 2: Meal & Bazar Status */}
                      <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-600" />
                          <span>ব্যক্তিগত মিল ও বাজার হিসাব:</span>
                        </span>
                        {calc.mealAcc.netMealBalance > 0 ? (
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            - ৳ {calc.mealRefund} (বাজার রিফান্ড বাদ যাবে)
                          </span>
                        ) : calc.mealAcc.netMealBalance < 0 ? (
                          <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            + ৳ {calc.mealDue} (মিলের বকেয়া যোগ হবে)
                          </span>
                        ) : (
                          <span className="font-bold text-slate-600">৳ 0 (সমান)</span>
                        )}
                      </div>

                      {/* Row 3: Net Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-300 font-extrabold text-sm text-slate-900">
                        <span>সর্বমোট চূড়ান্ত হিসাব:</span>
                        <span>৳ {calc.finalPayable}</span>
                      </div>
                    </div>

                    {/* Expandable Details Accordion */}
                    <div>
                      <button
                        onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                        className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>{isExpanded ? "বিস্তারিত খাতগুলো লুকান" : "বিস্তারিত খাতগুলো দেখুন"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs animate-in fade-in duration-150">
                          <div>
                            <span className="font-bold text-slate-800 block mb-1">বাসা ভাড়ার খাতসমূহ:</span>
                            <div className="divide-y divide-slate-100 text-slate-600">
                              {inv.items.map((it, idx) => (
                                <div key={idx} className="py-1 flex justify-between">
                                  <span>{it.name}</span>
                                  <span className="font-medium text-slate-900">৳ {it.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <span className="font-bold text-slate-800 block mb-1">মিল ও বাজার হিসাব:</span>
                            <div className="space-y-1 text-slate-600">
                              <div className="flex justify-between">
                                <span>মোট খাওয়া মিল:</span>
                                <span className="font-medium text-slate-900">{calc.mealAcc.totalMeals} টি</span>
                              </div>
                              <div className="flex justify-between">
                                <span>মিল রেট:</span>
                                <span className="font-medium text-slate-900">৳ {calc.mealAcc.mealRate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>খাবারের মোট খরচ:</span>
                                <span className="font-medium text-slate-900">৳ {calc.mealAcc.mealCost}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>মেসের বাজারে জমা দিয়েছেন:</span>
                                <span className="font-medium text-indigo-700">৳ {calc.mealAcc.totalBazarSpent}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ======================================================== */
                  /* OPTION B: SEPARATE VIEW (আলাদা আলাদা হিসাব) */
                  /* ======================================================== */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Room Rent Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>১. বাসা ভাড়া ও ইউটিলিটি</span>
                          </span>
                          <span className="font-extrabold text-slate-900">৳ {inv.totalAmount}</span>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600">
                          {inv.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate pr-2">{it.name}</span>
                              <span className="font-medium text-slate-800">৳ {it.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                        <div className="flex justify-between font-bold">
                          <span>ভাড়ার বকেয়া:</span>
                          <span className="text-rose-600">৳ {calc.rentDue}</span>
                        </div>

                        {calc.rentDue > 0 ? (
                          <button
                            onClick={() => handleOpenPay(inv, "RENT")}
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition"
                          >
                            শুধু বাসা ভাড়া দিন (৳ {calc.rentDue})
                          </button>
                        ) : (
                          <div className="text-center p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                            ভাড়া পরিশোধিত
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. Personal Meal & Bazar Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-amber-600" />
                            <span>২. মিল ও বাজার ব্যালেন্স</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {calc.mealAcc.totalMeals} মিল @ ৳{calc.mealAcc.mealRate}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600">
                          <div className="flex justify-between">
                            <span>খাবারের মোট খরচ:</span>
                            <span className="font-medium text-slate-800">৳ {calc.mealAcc.mealCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>মেসের বাজারে জমা দিয়েছেন:</span>
                            <span className="font-bold text-indigo-700">৳ {calc.mealAcc.totalBazarSpent}</span>
                          </div>
                        </div>

                        {/* Result Tag */}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-center">
                          {calc.mealAcc.netMealBalance > 0 ? (
                            <span className="font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />
                              +৳ {calc.mealRefund} পাবে (Refund)
                            </span>
                          ) : calc.mealAcc.netMealBalance < 0 ? (
                            <span className="font-extrabold text-rose-600 flex items-center justify-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" />
                              -৳ {calc.mealDue} দিবে (বাকি)
                            </span>
                          ) : (
                            <span className="font-bold text-slate-600">৳ 0 (হিসাব সমান)</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 text-xs">
                        {calc.mealDue > 0 ? (
                          <button
                            onClick={() => handleOpenPay(inv, "MEALS")}
                            className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition"
                          >
                            মিলের বাকি দিন (৳ {calc.mealDue})
                          </button>
                        ) : calc.mealRefund > 0 ? (
                          <div className="text-center p-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                            মেস থেকে ৳ {calc.mealRefund} রিফান্ড পাবেন
                          </div>
                        ) : (
                          <div className="text-center p-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                            হিসাব পরিশোধিত
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. RECENT PAYMENTS LEDGER (Simple & Clean) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>সাম্প্রতিক লেনদেন ইতিহাস (Recent Payments)</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {ledgerEntries.map((lg) => (
            <div key={lg.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{lg.description}</span>
                <span className="text-[10px] text-slate-400">{lg.member} • {lg.date}</span>
              </div>
              <span className="font-black text-emerald-600">+৳ {lg.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* QUICK PAY MODAL */}
      {/* ============================================================== */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">ডিজিটাল পেমেন্ট</h3>
                <p className="text-[11px] text-slate-500">{selectedInvoice.member} ({selectedInvoice.room})</p>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">পেমেন্ট মেথড</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["BKASH", "NAGAD", "CASH"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl font-bold text-xs transition ${
                        payMethod === m ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                <input
                  type="text"
                  placeholder="যেমন: BKH981298"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  পেমেন্ট জমা দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT BILL MODAL (For Admin) */}
      {/* ============================================================== */}
      {editModalOpen && editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">বিল এডিট ({editingInvoice.member})</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedInvoice} className="space-y-3.5 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">বিলের খাত ও পরিমাণ:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {editItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="flex-1 font-medium text-slate-800 truncate">{item.name}</span>
                      <input
                        type="number"
                        min="0"
                        value={item.amount}
                        onChange={(e) => handleUpdateItemAmount(idx, Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-bold text-right"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="নতুন চার্জের নাম"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="number"
                  placeholder="৳ টাকা"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-right"
                />
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  + Add
                </button>
              </div>

              {/* Paid Amount */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">জমা দেওয়া টাকা:</label>
                  <input
                    type="number"
                    min="0"
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div className="p-2 rounded-lg bg-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500">নতুন মোট বকেয়া:</span>
                  <span className="font-extrabold text-rose-600 text-sm">
                    ৳ {Math.max(0, editItems.reduce((acc, it) => acc + it.amount, 0) - editPaidAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>বিল সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
