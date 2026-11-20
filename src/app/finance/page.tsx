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
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  Edit3,
  Trash2,
  PlusCircle,
  Save,
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

export default function FinancePage() {
  const { t, role, currentUser, showToast, locale } = useApp();

  // Access Control: Only Mess Owner (Rahim Ahmed) or Super Admin can edit & see ALL members' rent bills!
  const isOwnerOrAdmin = role === "OWNER" || role === "SUPER_ADMIN";

  // Identify current member
  const currentMemberName = currentUser?.name || (role === "MEAL_MANAGER" ? "Tanvir Hasan" : "Kamrul Islam");

  // Invoices for mess members
  const [invoices, setInvoices] = useState<Invoice[]>([
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
    {
      id: "inv-3",
      number: "INV-GV-202611-003",
      member: "Mehedi Hasan",
      room: "Room 102, Bed A",
      month: "November 2026",
      totalAmount: 6150,
      paidAmount: 6150,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 102, Bed A)", amount: 3200 },
        { name: "Meal Cost Advance", amount: 2000 },
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
      totalAmount: 6150,
      paidAmount: 6150,
      dueAmount: 0,
      status: "PAID",
      items: [
        { name: "Seat Rent (Room 102, Bed B)", amount: 3200 },
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
    {
      id: "lg-3",
      date: "2026-11-02",
      member: "Sakib Al Mahmud",
      type: "CREDIT",
      description: "Full Rent & Utilities paid via Nagad",
      amount: 6450,
      balanceAfter: 0,
    },
  ]);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [payAmount, setPayAmount] = useState("1450");
  const [payMethod, setPayMethod] = useState("BKASH");
  const [trxId, setTrxId] = useState("");
  const [adminMemberFilter, setAdminMemberFilter] = useState("ALL");

  // EDIT BILL MODAL STATE (অ্যাডমিন বিল এডিট করতে পারবে)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editItems, setEditItems] = useState<InvoiceItem[]>([]);
  const [editPaidAmount, setEditPaidAmount] = useState<number>(0);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");

  // PRIVACY FILTER: Normal members ONLY see their OWN rent bills & invoices!
  const visibleInvoices = isOwnerOrAdmin
    ? adminMemberFilter === "ALL"
      ? invoices
      : invoices.filter((inv) => inv.member === adminMemberFilter)
    : invoices.filter((inv) => {
        const firstName = currentMemberName.split(" ")[0].toLowerCase();
        return inv.member.toLowerCase().includes(firstName);
      });

  const visibleLedger = isOwnerOrAdmin
    ? adminMemberFilter === "ALL"
      ? ledgerEntries
      : ledgerEntries.filter((lg) => lg.member === adminMemberFilter)
    : ledgerEntries.filter((lg) => {
        const firstName = currentMemberName.split(" ")[0].toLowerCase();
        return lg.member.toLowerCase().includes(firstName);
      });

  const handlePayInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.dueAmount.toString());
    setPaymentModalOpen(true);
  };

  // OPEN EDIT BILL MODAL (For Admin)
  const handleOpenEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditItems([...inv.items]);
    setEditPaidAmount(inv.paidAmount);
    setEditModalOpen(true);
  };

  // Update specific item in the bill
  const handleUpdateItemAmount = (index: number, newAmount: number) => {
    setEditItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], amount: Math.max(0, newAmount) };
      return copy;
    });
  };

  // Remove an item from the bill
  const handleRemoveItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Add custom extra item (e.g. repair fee, late fee, discount)
  const handleAddCustomItem = () => {
    if (!newItemName || !newItemAmount) {
      showToast(locale === "bn" ? "চার্জের নাম ও টাকার পরিমাণ দিন" : "Please provide item name and amount", "error");
      return;
    }
    const amountVal = parseFloat(newItemAmount) || 0;
    setEditItems((prev) => [...prev, { name: newItemName, amount: amountVal }]);
    setNewItemName("");
    setNewItemAmount("");
  };

  // Save the edited bill
  const handleSaveEditedInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const newTotal = editItems.reduce((acc, it) => acc + it.amount, 0);
    const newDue = Math.max(0, newTotal - editPaidAmount);
    const newStatus = newDue === 0 ? "PAID" : editPaidAmount > 0 ? "PARTIAL" : "PENDING";

    const updatedInvoice: Invoice = {
      ...editingInvoice,
      items: editItems,
      totalAmount: newTotal,
      paidAmount: editPaidAmount,
      dueAmount: newDue,
      status: newStatus,
    };

    setInvoices((prev) => prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
    setEditModalOpen(false);

    showToast(
      locale === "bn"
        ? `${editingInvoice.member}-এর বিল সফলভাবে আপডেট করা হয়েছে! মোট বিল: ৳${newTotal}, বকেয়া: ৳${newDue}`
        : `Bill for ${editingInvoice.member} updated successfully! Total: ৳${newTotal}, Due: ৳${newDue}`,
      "success"
    );
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (!amountNum || amountNum <= 0) {
      showToast(locale === "bn" ? "সঠিক টাকার পরিমাণ দিন" : "Please enter a valid amount", "error");
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
    showToast(
      locale === "bn"
        ? `৳ ${payAmount} টাকা পেমেন্ট সফলভাবে জমা হয়েছে!`
        : `Payment of ৳ ${payAmount} recorded successfully!`,
      "success"
    );
    setPaymentModalOpen(false);
    setTrxId("");
  };

  const handleMonthlyClosing = () => {
    showToast(
      locale === "bn"
        ? "নভেম্বর মাসের চূড়ান্ত হিসাব ক্লোজ ও ভাউচার লক করা হয়েছে!"
        : "Monthly closing completed! Final meal rate ৳54.50 reconciled, invoices updated.",
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
            <span>Green View Student Mess</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {locale === "bn" ? "বাসা ভাড়া, ইউটিলিটি ও বিল ব্যবস্থাপনা" : "Room Rent, Bills & Financial Ledger"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === "bn"
              ? "বাসা ভাড়া ও ইউটিলিটি বিলের হিসাব। অ্যাডমিন যেকোনো সদস্যের বিল এডিট বা সংশোধন করতে পারবেন।"
              : "Room rent, utilities, and invoices. Authorized admin can edit bill components at any time."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isOwnerOrAdmin && (
            <button
              onClick={handleMonthlyClosing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>{locale === "bn" ? "মাসিক ক্লোজিং সম্পন্ন করুন" : "Close Month"}</span>
            </button>
          )}
        </div>
      </div>

      {/* PRIVACY & EDIT NOTICE CARD */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block">
              {locale === "bn"
                ? "বাসা ভাড়া গোপনীয়তা ও বিল এডিট সুবিধা (Bill Edit & Privacy Controls)"
                : "Rent Privacy & Bill Edit Controls"}
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
              {isOwnerOrAdmin
                ? locale === "bn"
                  ? "🛡️ অ্যাডমিন সুবিধা সক্রিয়: আপনি সকল সদস্যের বিল দেখতে পাচ্ছেন এবং প্রতিটি ইনভয়েসের পাশে 'বিল এডিট' বাটনে ক্লিক করে ভাড়া, ওয়াইফাই বা বুয়া বিল পরিবর্তন করতে পারবেন।"
                  : "🛡️ Admin Controls Active: You can view and edit any resident's bill components using the 'Edit Bill' button on each invoice card."
                : locale === "bn"
                ? `🔒 মেসের নিয়ম অনুযায়ী বাসা ভাড়া সম্পূর্ণ গোপন রাখা হয়। আপনি শুধুমাত্র আপনার নিজের (${currentMemberName}) বাসা ভাড়া ও রসিদ দেখতে পাচ্ছেন।`
                : `🔒 Individual privacy guaranteed: You are only viewing your own (${currentMemberName}) bill. Other residents cannot view your rent.`}
            </p>
          </div>
        </div>

        {/* Admin Filter Dropdown */}
        {isOwnerOrAdmin && (
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400">Filter Invoices:</span>
            <select
              value={adminMemberFilter}
              onChange={(e) => setAdminMemberFilter(e.target.value)}
              className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Members (সকল সদস্য)</option>
              <option value="Kamrul Islam" className="bg-slate-900 text-white">Kamrul Islam (101-A)</option>
              <option value="Sakib Al Mahmud" className="bg-slate-900 text-white">Sakib Al Mahmud (101-B)</option>
              <option value="Mehedi Hasan" className="bg-slate-900 text-white">Mehedi Hasan (102-A)</option>
              <option value="Tanvir Hasan" className="bg-slate-900 text-white">Tanvir Hasan (102-B)</option>
            </select>
          </div>
        )}
      </div>

      {/* Member Invoices Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>
              {isOwnerOrAdmin
                ? locale === "bn"
                  ? "মেম্বারদের বাসা ভাড়া ও ইউটিলিটি ইনভয়েস"
                  : "Resident Rent Invoices"
                : locale === "bn"
                ? `আপনার মাসিক বাসা ভাড়া ও বিল (${currentMemberName})`
                : `Your Personal Monthly Invoice (${currentMemberName})`}
            </span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {visibleInvoices.length} {visibleInvoices.length === 1 ? "Invoice" : "Invoices"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleInvoices.map((inv) => (
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs text-slate-700 pt-2">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-semibold text-slate-900">৳ {item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 font-medium">Total Bill:</span>
                  <span className="text-lg font-black text-slate-900">৳ {inv.totalAmount}</span>
                </div>

                <div className="flex justify-between items-baseline text-xs text-slate-600">
                  <span>Paid so far: ৳ {inv.paidAmount}</span>
                  <span className="font-bold text-rose-600">
                    {inv.dueAmount > 0 ? `Due: ৳ ${inv.dueAmount}` : "Paid in Full"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {inv.dueAmount > 0 ? (
                    <button
                      onClick={() => handlePayInvoice(inv)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {locale === "bn" ? `পেমেন্ট করুন (৳ ${inv.dueAmount})` : `Pay ৳ ${inv.dueAmount}`}
                      </span>
                    </button>
                  ) : (
                    <div className="flex-1 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{locale === "bn" ? "ভাড়া পরিশোধিত" : "Paid in Full"}</span>
                    </div>
                  )}

                  {/* BILL EDIT BUTTON (Available to Admin/Owner) */}
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => handleOpenEditInvoice(inv)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs transition"
                      title="Edit bill items, rent or discounts"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{locale === "bn" ? "বিল এডিট" : "Edit Bill"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History / Ledger Trail (Filtered by Member) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>
            {isOwnerOrAdmin
              ? locale === "bn"
                ? "সকল মেম্বারদের পেমেন্ট লেজার"
                : "Master Rent Payment Ledger"
              : locale === "bn"
              ? "আপনার ব্যক্তিগত জমার রসিদ ও লেজার"
              : "Your Personal Payment History"}
          </span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {visibleLedger.map((lg) => (
            <div key={lg.id} className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lg.type === "CREDIT" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {lg.type}
                  </span>
                  <span className="font-bold text-slate-900">{lg.member}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{lg.description}</p>
                <span className="text-[10px] text-slate-400">{lg.date}</span>
              </div>
              <span className="text-sm font-black text-emerald-600">
                +৳ {lg.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* BILL EDIT MODAL (অ্যাডমিন বিল এডিট করার ফর্ম) */}
      {/* ============================================================== */}
      {editModalOpen && editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {locale === "bn" ? "বিল সংশোধন ও এডিট করুন" : "Edit Member Bill & Invoices"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingInvoice.member} • {editingInvoice.number} ({editingInvoice.month})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedInvoice} className="space-y-4 text-xs">
              {/* Itemized Charge Breakdown */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-700 block">
                  {locale === "bn" ? "বিলের খাত ও টাকার পরিমাণ এডিট করুন:" : "Itemized Charges & Amounts:"}
                </span>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {editItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="flex-1 font-medium text-slate-800 text-xs truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-xs font-bold">৳</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.amount}
                          onChange={(e) => handleUpdateItemAmount(idx, Number(e.target.value))}
                          className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs text-right outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Item */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block text-[11px]">
                  {locale === "bn" ? "+ নতুন চার্জ বা সমন্বয় যুক্ত করুন (Add Extra Item):" : "+ Add Custom Item / Extra Charge:"}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="যেমন: ফ্যান মেরামত বা জরিমানা"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white"
                  />
                  <input
                    type="number"
                    placeholder="৳ টাকা"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white text-right"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Paid Amount So Far */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {locale === "bn" ? "জমা দেওয়া টাকা (Paid so far):" : "Already Paid Amount:"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-100 flex flex-col justify-center">
                  <span className="text-[11px] text-slate-500">
                    {locale === "bn" ? "নতুন মোট বকেয়া (New Due):" : "Updated Due Amount:"}
                  </span>
                  <span className="text-base font-extrabold text-rose-600">
                    ৳ {Math.max(0, editItems.reduce((acc, it) => acc + it.amount, 0) - editPaidAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  {locale === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{locale === "bn" ? "বিল সেভ করুন" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Quick-Pay Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Quick Digital Pay</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Paying for Invoice</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedInvoice?.number} (${selectedInvoice?.member})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["BKASH", "NAGAD", "CASH"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl font-bold text-xs transition ${
                        payMethod === m
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Payment Amount (৳)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">bKash/Nagad TrxID</label>
                <input
                  type="text"
                  placeholder="e.g. BKH981298319"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
