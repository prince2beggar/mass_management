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
  TrendingUp,
  TrendingDown,
  Utensils,
  Layers,
  Split,
  ChevronRight,
  Sparkles,
  HelpCircle,
  CheckCheck,
  RotateCcw,
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
  const { t, role, currentUser, showToast, locale } = useApp();

  // Access Control: Only Mess Owner (Rahim Ahmed) or Super Admin can edit & see ALL members' rent bills!
  const isOwnerOrAdmin = role === "OWNER" || role === "SUPER_ADMIN";

  // Identify current member
  const currentMemberName = currentUser?.name || (role === "MEAL_MANAGER" ? "Tanvir Hasan" : "Kamrul Islam");

  // Global View Mode: COMBINED (সম্মিলিত একাউন্ট), SEPARATE (আলাদা আলাদা বিল), RENT_ONLY (শুধু বাসা ভাড়া), MEALS_ONLY (শুধু মিল ও বাজার)
  const [globalViewMode, setGlobalViewMode] = useState<"COMBINED" | "SEPARATE" | "RENT_ONLY" | "MEALS_ONLY">("COMBINED");

  // Per-card local toggle override (allows toggling view mode per member card)
  const [cardOverrides, setCardOverrides] = useState<Record<string, "COMBINED" | "SEPARATE">>({});

  // 1. Rent & Utilities Invoices for mess members
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

  // 2. Personal Meal & Bazar Accounting Ledger (বাজার থেকে কত পাবে বা দিবে)
  const [mealAccounts] = useState<Record<string, MemberMealAccount>>({
    "Kamrul Islam": {
      memberName: "Kamrul Islam",
      room: "Room 101, Bed A",
      totalMeals: 34,
      mealRate: 54.5,
      totalBazarSpent: 2400,
      mealCost: 1853,
      netMealBalance: 547, // +547 পাবে (Refund from Bazar)
    },
    "Sakib Al Mahmud": {
      memberName: "Sakib Al Mahmud",
      room: "Room 101, Bed B",
      totalMeals: 28,
      mealRate: 54.5,
      totalBazarSpent: 1000,
      mealCost: 1526,
      netMealBalance: -526, // -526 দিবে (Meal Due)
    },
    "Mehedi Hasan": {
      memberName: "Mehedi Hasan",
      room: "Room 102, Bed A",
      totalMeals: 31,
      mealRate: 54.5,
      totalBazarSpent: 0,
      mealCost: 1690,
      netMealBalance: -1690, // -1690 দিবে (Meal Due)
    },
    "Tanvir Hasan": {
      memberName: "Tanvir Hasan",
      room: "Room 102, Bed B",
      totalMeals: 32,
      mealRate: 54.5,
      totalBazarSpent: 3090,
      mealCost: 1744,
      netMealBalance: 1346, // +1346 পাবে (Refund from Bazar)
    },
    "Rahim Ahmed": {
      memberName: "Rahim Ahmed",
      room: "Room 201, Master Bed",
      totalMeals: 30,
      mealRate: 54.5,
      totalBazarSpent: 1500,
      mealCost: 1635,
      netMealBalance: -135, // -135 দিবে (Meal Due)
    },
  });

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: "lg-1",
      date: "2026-11-01",
      member: "Kamrul Islam",
      type: "DEBIT",
      description: "November Monthly Room Rent Generated (INV-GV-202611-001)",
      amount: 4450,
      balanceAfter: -4450,
    },
    {
      id: "lg-2",
      date: "2026-11-03",
      member: "Kamrul Islam",
      type: "CREDIT",
      description: "Payment via bKash for Room Rent (TrxID: BKH9123891823)",
      amount: 3000,
      balanceAfter: -1450,
    },
    {
      id: "lg-3",
      date: "2026-11-15",
      member: "Kamrul Islam",
      type: "CREDIT",
      description: "Daily Bazar Expense Contribution (Vegetables, Chicken, Oil)",
      amount: 2400,
      balanceAfter: 950,
    },
    {
      id: "lg-4",
      date: "2026-11-02",
      member: "Sakib Al Mahmud",
      type: "CREDIT",
      description: "Full Rent & Utilities paid via Nagad",
      amount: 4450,
      balanceAfter: 0,
    },
  ]);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [payAmount, setPayAmount] = useState("1450");
  const [payPurpose, setPayPurpose] = useState<"COMBINED" | "RENT" | "MEALS" | "CUSTOM">("COMBINED");
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

  // PRIVACY FILTER: Normal members ONLY see their OWN rent bills & meal accounts!
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

  // Helper to compute combined financial reconciliation
  const getCombinedDetails = (inv: Invoice) => {
    const mealAcc = mealAccounts[inv.member] || {
      memberName: inv.member,
      room: inv.room,
      totalMeals: 30,
      mealRate: 54.5,
      totalBazarSpent: 1500,
      mealCost: 1635,
      netMealBalance: -135,
    };

    const rentDue = inv.dueAmount;
    // netMealBalance > 0 means the member contributed more bazar than meal expense => gets a refund (পাবে)
    // netMealBalance < 0 means the member owes money for meals eaten => meal due (দিবে)
    const mealRefund = mealAcc.netMealBalance > 0 ? mealAcc.netMealBalance : 0;
    const mealDue = mealAcc.netMealBalance < 0 ? Math.abs(mealAcc.netMealBalance) : 0;

    // Combined Net = Rent Due + Meal Due - Meal Refund
    const netCombinedBalance = rentDue + mealDue - mealRefund;
    const isNetRefund = netCombinedBalance < 0;
    const finalPayable = Math.max(0, netCombinedBalance);
    const finalRefund = isNetRefund ? Math.abs(netCombinedBalance) : 0;

    return {
      mealAcc,
      rentDue,
      mealRefund,
      mealDue,
      netCombinedBalance,
      isNetRefund,
      finalPayable,
      finalRefund,
    };
  };

  const handlePayInvoice = (inv: Invoice, defaultPurpose: "COMBINED" | "RENT" | "MEALS" = "COMBINED") => {
    setSelectedInvoice(inv);
    const details = getCombinedDetails(inv);
    setPayPurpose(defaultPurpose);

    if (defaultPurpose === "COMBINED") {
      setPayAmount(details.finalPayable.toString());
    } else if (defaultPurpose === "RENT") {
      setPayAmount(details.rentDue.toString());
    } else {
      setPayAmount(details.mealDue.toString());
    }

    setPaymentModalOpen(true);
  };

  const handlePurposeChange = (newPurpose: "COMBINED" | "RENT" | "MEALS" | "CUSTOM") => {
    setPayPurpose(newPurpose);
    const details = getCombinedDetails(selectedInvoice);
    if (newPurpose === "COMBINED") {
      setPayAmount(details.finalPayable.toString());
    } else if (newPurpose === "RENT") {
      setPayAmount(details.rentDue.toString());
    } else if (newPurpose === "MEALS") {
      setPayAmount(details.mealDue.toString());
    }
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

    // If paying towards rent invoice
    if (payPurpose === "RENT" || payPurpose === "COMBINED") {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === selectedInvoice.id) {
            const newPaid = inv.paidAmount + Math.min(inv.dueAmount, amountNum);
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
    }

    const purposeLabel =
      payPurpose === "COMBINED"
        ? "Combined Net Rent & Meal Bill"
        : payPurpose === "RENT"
        ? "Room Rent & Utilities"
        : "Meal & Bazar Bill Settlement";

    const newLedger = {
      id: `lg-${Date.now()}`,
      date: "2026-11-20",
      member: selectedInvoice.member,
      type: "CREDIT",
      description: `Payment via ${payMethod} for ${purposeLabel} (TrxID: ${trxId || "CASH-PAID"})`,
      amount: amountNum,
      balanceAfter: -Math.max(0, selectedInvoice.dueAmount - amountNum),
    };

    setLedgerEntries([newLedger, ...ledgerEntries]);
    showToast(
      locale === "bn"
        ? `৳ ${payAmount} টাকা ${purposeLabel} বাবদ সফলভাবে জমা হয়েছে!`
        : `Payment of ৳ ${payAmount} for ${purposeLabel} recorded successfully!`,
      "success"
    );
    setPaymentModalOpen(false);
    setTrxId("");
  };

  const handleMonthlyClosing = () => {
    showToast(
      locale === "bn"
        ? "নভেম্বর মাসের চূড়ান্ত হিসাব ক্লোজ ও মিল-বাজার ব্যালেন্স সমন্বয় করা হয়েছে!"
        : "Monthly closing completed! Final meal rate ৳54.50 reconciled, invoices updated.",
      "success"
    );
  };

  // Toggle card view mode for a specific invoice
  const toggleCardMode = (invId: string, currentEffectiveMode: "COMBINED" | "SEPARATE") => {
    setCardOverrides((prev) => ({
      ...prev,
      [invId]: currentEffectiveMode === "COMBINED" ? "SEPARATE" : "COMBINED",
    }));
  };

  // Top metric totals for current viewer
  const activeInvoice = visibleInvoices[0] || invoices[0];
  const activeDetails = getCombinedDetails(activeInvoice);

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
            {locale === "bn"
              ? "বিল, ব্যক্তিগত বাজার ব্যালেন্স ও সমন্বয়"
              : "Room Rent, Meal Ledger & Combined Bills"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === "bn"
              ? "বাসা ভাড়া ও মিল-বাজারের আলাদা আলাদা হিসাব অথবা একত্রিত কম্বাইন্ড বিল। কে বাজার থেকে কত টাকা পাবে বা দিবে তার লাইভ ব্যালেন্স।"
              : "Transparent separate rent and meal/bazar accounts, or unified combined net balance with 1-click toggles."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isOwnerOrAdmin && (
            <button
              onClick={handleMonthlyClosing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition active:scale-95"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{locale === "bn" ? "মাসিক ক্লোজিং সম্পন্ন করুন" : "Close Month"}</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Rent Due */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">{locale === "bn" ? "বাসা ভাড়া বকেয়া" : "Room Rent Due"}</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ৳ {activeDetails.rentDue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">
            {activeInvoice.member} ({activeInvoice.room})
          </p>
        </div>

        {/* Card 2: Personal Meal & Bazar Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">{locale === "bn" ? "ব্যক্তিগত বাজার ব্যালেন্স" : "Personal Bazar Status"}</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center gap-2">
            {activeDetails.mealAcc.netMealBalance > 0 ? (
              <span className="text-2xl font-black text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                +৳ {activeDetails.mealAcc.netMealBalance.toLocaleString()}
              </span>
            ) : activeDetails.mealAcc.netMealBalance < 0 ? (
              <span className="text-2xl font-black text-rose-600 flex items-center gap-1">
                <TrendingDown className="w-5 h-5 text-rose-500" />
                -৳ {Math.abs(activeDetails.mealAcc.netMealBalance).toLocaleString()}
              </span>
            ) : (
              <span className="text-2xl font-black text-slate-700">৳ 0</span>
            )}
          </div>
          <p className="text-[11px] font-semibold">
            {activeDetails.mealAcc.netMealBalance > 0 ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                {locale === "bn" ? "মেস তহবিল থেকে পাবেন (Refund)" : "Refund from Mess Fund"}
              </span>
            ) : activeDetails.mealAcc.netMealBalance < 0 ? (
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold">
                {locale === "bn" ? "মিল বাবদ বকেয়া (Meal Due)" : "Due for Meals"}
              </span>
            ) : (
              <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {locale === "bn" ? "হিসাব সমান (Settled)" : "Settled"}
              </span>
            )}
          </p>
        </div>

        {/* Card 3: Combined Net Payable */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl border border-indigo-800 p-4.5 shadow-md space-y-2">
          <div className="flex items-center justify-between text-indigo-300 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{locale === "bn" ? "সম্মিলিত নেট প্রদেয়" : "Combined Net Payable"}</span>
            </span>
            <Layers className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="text-2xl font-black text-white">
            {activeDetails.isNetRefund ? (
              <span className="text-emerald-400">+৳ {activeDetails.finalRefund.toLocaleString()} পাবে</span>
            ) : (
              <span>৳ {activeDetails.finalPayable.toLocaleString()}</span>
            )}
          </div>
          <p className="text-[11px] text-indigo-200">
            {locale === "bn"
              ? "ভাড়া ও বাজার রিফান্ড সমন্বয় করার পর চূড়ান্ত হিসাব"
              : "Reconciled total after applying bazar refund"}
          </p>
        </div>

        {/* Card 4: Meal Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">{locale === "bn" ? "বর্তমান মিল রেট" : "Current Meal Rate"}</span>
            <Calculator className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ৳ 54.50
          </div>
          <p className="text-[11px] text-slate-500">
            {locale === "bn" ? "মোট বাজার ÷ মোট খাওয়া মিল" : "Total Bazar ÷ Total Meals"}
          </p>
        </div>
      </div>

      {/* VIEW MODE CONTROLLER & PRIVACY CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {locale === "bn" ? "বিলের ভিউ মোড নির্বাচন করুন:" : "Select Bill Presentation Mode:"}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {globalViewMode === "COMBINED"
                ? locale === "bn"
                  ? "⚡ কম্বাইন্ড মোড (ভাড়া ও বাজার হিসাব একত্রিত সমন্বয়)"
                  : "⚡ Combined Mode (Rent & Meal Ledger Unified)"
                : globalViewMode === "SEPARATE"
                ? locale === "bn"
                  ? "🔄 আলাদা আলাদা মোড (বাসা ভাড়া এবং মিল-বাজার সম্পূর্ণ আলাদা)"
                  : "🔄 Separate Mode (Rent & Meal Ledger Side-by-Side)"
                : globalViewMode === "RENT_ONLY"
                ? locale === "bn"
                  ? "🏠 শুধু বাসা ভাড়া ও ইউটিলিটি বিল"
                  : "🏠 Room Rent & Utilities Only"
                : locale === "bn"
                ? "🍲 শুধু মিল ও ব্যক্তিগত বাজার ব্যালেন্স"
                : "🍲 Meal & Personal Bazar Ledger Only"}
            </h3>
          </div>

          {/* View Mode Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start lg:self-auto">
            <button
              onClick={() => setGlobalViewMode("COMBINED")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                globalViewMode === "COMBINED"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "কম্বাইন্ড বিল (Combined)" : "Combined Bill"}</span>
            </button>

            <button
              onClick={() => setGlobalViewMode("SEPARATE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                globalViewMode === "SEPARATE"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "আলাদা আলাদা (Separate)" : "Separate Bills"}</span>
            </button>

            <button
              onClick={() => setGlobalViewMode("RENT_ONLY")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                globalViewMode === "RENT_ONLY"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "শুধু বাসা ভাড়া" : "Rent Only"}</span>
            </button>

            <button
              onClick={() => setGlobalViewMode("MEALS_ONLY")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                globalViewMode === "MEALS_ONLY"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "শুধু মিল-বাজার" : "Meals Only"}</span>
            </button>
          </div>
        </div>

        {/* Privacy Notice Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isOwnerOrAdmin
                ? locale === "bn"
                  ? "🛡️ এডমিন ভিউ: আপনি সকল সদস্যের বিল দেখতে ও এডিট করতে পারেন।"
                  : "🛡️ Admin View: You can view and edit bills for all members."
                : locale === "bn"
                ? `🔒 ব্যক্তিগত নিরাপত্তা: আপনি শুধুমাত্র আপনার নিজের (${currentMemberName}) বাসা ভাড়া ও হিসাব দেখতে পাচ্ছেন।`
                : `🔒 Individual Privacy: You are only viewing your personal (${currentMemberName}) records.`}
            </span>
          </div>

          {/* Admin Member Filter */}
          {isOwnerOrAdmin && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">Filter:</span>
              <select
                value={adminMemberFilter}
                onChange={(e) => setAdminMemberFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-900 text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Members (সকল সদস্য)</option>
                <option value="Kamrul Islam">Kamrul Islam (101-A)</option>
                <option value="Sakib Al Mahmud">Sakib Al Mahmud (101-B)</option>
                <option value="Mehedi Hasan">Mehedi Hasan (102-A)</option>
                <option value="Tanvir Hasan">Tanvir Hasan (102-B)</option>
                <option value="Rahim Ahmed">Rahim Ahmed (201-A)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MEMBER INVOICES & LEDGER SECTION */}
      {/* ============================================================== */}
      <div className="space-y-6">
        {visibleInvoices.map((inv) => {
          const details = getCombinedDetails(inv);
          const effectiveMode =
            cardOverrides[inv.id] ||
            (globalViewMode === "RENT_ONLY" || globalViewMode === "MEALS_ONLY"
              ? globalViewMode
              : globalViewMode);

          return (
            <div
              key={inv.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              {/* Card Header Bar */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {inv.member.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{inv.member}</h3>
                      <span className="text-xs font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        {inv.number}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {inv.room} • {inv.month}
                    </p>
                  </div>
                </div>

                {/* Right controls on Card Header: 1-click Toggle & Edit */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {/* Local Mode Toggle Button */}
                  <button
                    onClick={() => toggleCardMode(inv.id, effectiveMode === "COMBINED" ? "COMBINED" : "SEPARATE")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
                    title="Toggle between separate bills and combined account"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {effectiveMode === "COMBINED"
                        ? locale === "bn"
                          ? "আলাদা আলাদা দেখুন ➔"
                          : "View Separately ➔"
                        : locale === "bn"
                        ? "কম্বাইন্ড করুন ➔"
                        : "Combine Together ➔"}
                    </span>
                  </button>

                  {/* Admin Edit Bill Button */}
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => handleOpenEditInvoice(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{locale === "bn" ? "বিল এডিট" : "Edit Bill"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* -------------------------------------------------------- */}
                {/* VIEW 1: COMBINED ACCOUNT (একত্রিত কম্বাইন্ড হিসাব) */}
                {/* -------------------------------------------------------- */}
                {(effectiveMode === "COMBINED" || globalViewMode === "COMBINED") &&
                  effectiveMode !== "SEPARATE" &&
                  effectiveMode !== "RENT_ONLY" &&
                  effectiveMode !== "MEALS_ONLY" && (
                    <div className="space-y-6">
                      {/* Combined Net Banner */}
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
                        <div className="space-y-1.5">
                          <span className="text-indigo-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>
                              {locale === "bn"
                                ? "কম্বাইন্ড সমন্বিত হিসাব (Combined Net Settlement)"
                                : "Combined Net Settlement"}
                            </span>
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black">
                              {details.isNetRefund ? (
                                <span className="text-emerald-400">
                                  +৳ {details.finalRefund.toLocaleString()} পাবে (Refund)
                                </span>
                              ) : (
                                <span>৳ {details.finalPayable.toLocaleString()}</span>
                              )}
                            </span>
                            <span className="text-xs text-slate-300">
                              {details.isNetRefund
                                ? locale === "bn"
                                  ? "(মেস তহবিল থেকে মেম্বার টাকা ফেরত পাবে)"
                                  : "(Net credit due to member)"
                                : locale === "bn"
                                ? "(ভাড়া ও মিল-বাজার সমন্বয় শেষে মোট দিতে হবে)"
                                : "(Net amount payable after reconciliation)"}
                            </span>
                          </div>
                        </div>

                        {/* Payment Button */}
                        <div className="flex items-center gap-2 self-start md:self-auto">
                          {details.finalPayable > 0 ? (
                            <button
                              onClick={() => handlePayInvoice(inv, "COMBINED")}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>
                                {locale === "bn"
                                  ? `সম্মিলিত ৳${details.finalPayable} পেমেন্ট করুন`
                                  : `Pay Combined ৳${details.finalPayable}`}
                              </span>
                            </button>
                          ) : (
                            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>
                                {locale === "bn" ? "কোনো বকেয়া নেই (সম্পূর্ণ পরিশোধিত)" : "Zero Due / Paid in Full"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reconciliation Math Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Box A: Rent & Utilities Breakdown */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <span>{locale === "bn" ? "১. বাসা ভাড়া ও ইউটিলিটি বিল" : "1. Rent & Utilities"}</span>
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.status === "PAID"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 text-xs text-slate-700">
                            {inv.items.map((item, idx) => (
                              <div key={idx} className="py-1.5 flex justify-between">
                                <span className="text-slate-600">{item.name}</span>
                                <span className="font-semibold text-slate-900">৳ {item.amount}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">ভাড়ার মোট বকেয়া (Rent Due):</span>
                            <span className="font-extrabold text-slate-900">৳ {details.rentDue}</span>
                          </div>
                        </div>

                        {/* Box B: Personal Meal & Bazar Breakdown */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <Utensils className="w-4 h-4 text-amber-600" />
                              <span>{locale === "bn" ? "২. ব্যক্তিগত মিল ও বাজার ব্যালেন্স" : "2. Meal & Bazar Balance"}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              {details.mealAcc.totalMeals} meals @ ৳{details.mealAcc.mealRate}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span>খাবারের মোট খরচ (Total Meal Cost):</span>
                              <span className="font-semibold text-slate-900">৳ {details.mealAcc.mealCost}</span>
                            </div>

                            <div className="flex justify-between text-slate-600">
                              <span>মেসের বাজারে খরচ/জমা (Bazar Contributed):</span>
                              <span className="font-semibold text-indigo-700 font-mono">৳ {details.mealAcc.totalBazarSpent}</span>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                              <span className="font-semibold text-slate-700">
                                {locale === "bn" ? "বাজার থেকে পাবে বা দিবে:" : "Meal / Bazar Net:"}
                              </span>
                              {details.mealAcc.netMealBalance > 0 ? (
                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                  +৳ {details.mealAcc.netMealBalance} পাবে (Refund)
                                </span>
                              ) : details.mealAcc.netMealBalance < 0 ? (
                                <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                  -৳ {Math.abs(details.mealAcc.netMealBalance)} দিবে (Due)
                                </span>
                              ) : (
                                <span className="font-bold text-slate-600">৳ 0 (Settled)</span>
                              )}
                            </div>
                          </div>

                          {/* Explanation Pill */}
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600">
                            {details.mealAcc.netMealBalance > 0 ? (
                              <p className="text-emerald-800 font-medium">
                                💡 এই সদস্য বাজারে ৳{details.mealAcc.totalBazarSpent} দিয়েছেন কিন্তু খেয়েছেন ৳{details.mealAcc.mealCost}। তাই ৳{details.mealRefund} টাকা ভাড়ার বকেয়া থেকে বাদ (সমন্বয়) হয়েছে।
                              </p>
                            ) : details.mealAcc.netMealBalance < 0 ? (
                              <p className="text-rose-800 font-medium">
                                💡 এই সদস্য মিল খেয়েছেন ৳{details.mealAcc.mealCost} কিন্তু বাজার করেছেন মাত্র ৳{details.mealAcc.totalBazarSpent}। তাই বাকি ৳{details.mealDue} টাকা ভাড়ার সাথে যোগ হয়েছে।
                              </p>
                            ) : (
                              <p className="text-slate-600">
                                💡 মিল খরচ ও বাজার জমার পরিমাণ সমান। কোনো সমন্বয় প্রয়োজন নেই।
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* -------------------------------------------------------- */}
                {/* VIEW 2: SEPARATE BILLS (আলাদা আলাদা বিল) */}
                {/* -------------------------------------------------------- */}
                {(effectiveMode === "SEPARATE" || globalViewMode === "SEPARATE") && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Separate Box 1: Room Rent & Utilities */}
                    <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <span>{locale === "bn" ? "বাসা ভাড়া ও ইউটিলিটি বিল" : "Room Rent & Utilities Bill"}</span>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {inv.room} • {inv.month}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              inv.status === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-100 text-xs text-slate-700">
                          {inv.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex justify-between">
                              <span className="text-slate-600">{item.name}</span>
                              <span className="font-semibold text-slate-900">৳ {item.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="text-slate-500 font-medium">মোট বাসা ভাড়া:</span>
                          <span className="text-base font-black text-slate-900">৳ {inv.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-slate-600">
                          <span>পরিশোধিত: ৳ {inv.paidAmount}</span>
                          <span className="font-bold text-rose-600">
                            {inv.dueAmount > 0 ? `বকেয়া: ৳ ${inv.dueAmount}` : "সম্পূর্ণ পরিশোধিত"}
                          </span>
                        </div>

                        {inv.dueAmount > 0 ? (
                          <button
                            onClick={() => handlePayInvoice(inv, "RENT")}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>{locale === "bn" ? `শুধু বাসা ভাড়া দিন (৳ ${inv.dueAmount})` : `Pay Rent (৳ ${inv.dueAmount})`}</span>
                          </button>
                        ) : (
                          <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-800 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>{locale === "bn" ? "ভাড়া পরিশোধিত" : "Rent Paid in Full"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Separate Box 2: Personal Meal & Bazar Ledger */}
                    <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <Utensils className="w-4 h-4 text-amber-600" />
                              <span>{locale === "bn" ? "ব্যক্তিগত মিল ও বাজার হিসাব" : "Meal & Bazar Ledger"}</span>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {details.mealAcc.totalMeals} টি মিল • রেট ৳ {details.mealAcc.mealRate}
                            </span>
                          </div>

                          {details.mealAcc.netMealBalance > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              পাবে (Refund)
                            </span>
                          ) : details.mealAcc.netMealBalance < 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                              দিবে (Due)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                              সমান
                            </span>
                          )}
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2.5 text-xs text-slate-700 pt-1">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600">মোট খাওয়ার মিল (Meals Eaten):</span>
                            <span className="font-extrabold text-slate-900">{details.mealAcc.totalMeals} টি</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600">খাবারের মোট খরচ ({details.mealAcc.totalMeals} × ৳{details.mealAcc.mealRate}):</span>
                            <span className="font-extrabold text-slate-900">৳ {details.mealAcc.mealCost}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                            <span className="text-slate-600">মেসের বাজারে জমা/খরচ (Bazar Spent):</span>
                            <span className="font-extrabold text-indigo-700">৳ {details.mealAcc.totalBazarSpent}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Result Box */}
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                          <span className="font-bold text-xs text-slate-700">বাজার হিসাব ফলাফল:</span>
                          {details.mealAcc.netMealBalance > 0 ? (
                            <span className="text-base font-black text-emerald-600 flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              +৳ {details.mealAcc.netMealBalance} পাবে
                            </span>
                          ) : details.mealAcc.netMealBalance < 0 ? (
                            <span className="text-base font-black text-rose-600 flex items-center gap-1">
                              <TrendingDown className="w-4 h-4" />
                              -৳ {Math.abs(details.mealAcc.netMealBalance)} দিবে
                            </span>
                          ) : (
                            <span className="text-base font-bold text-slate-700">৳ 0 পরিশোধিত</span>
                          )}
                        </div>

                        {details.mealDue > 0 ? (
                          <button
                            onClick={() => handlePayInvoice(inv, "MEALS")}
                            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>{locale === "bn" ? `মিল বাবদ বাকি দিন (৳ ${details.mealDue})` : `Pay Meal Due (৳ ${details.mealDue})`}</span>
                          </button>
                        ) : details.mealRefund > 0 ? (
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-center text-xs font-bold">
                            🎉 মেস ম্যানেজার থেকে ৳ {details.mealRefund} নগদ বা বিকাশে রিফান্ড পাবেন
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-center text-xs font-bold">
                            হিসাব সম্পূর্ণ পরিশোধিত
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* VIEW 3: RENT ONLY (শুধু বাসা ভাড়া) */}
                {/* -------------------------------------------------------- */}
                {effectiveMode === "RENT_ONLY" && (
                  <div className="space-y-4">
                    <div className="divide-y divide-slate-100 text-xs text-slate-700">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between">
                          <span className="text-slate-600">{item.name}</span>
                          <span className="font-semibold text-slate-900">৳ {item.amount}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">ভাড়ার মোট বকেয়া:</span>
                        <div className="text-xl font-black text-rose-600">৳ {inv.dueAmount}</div>
                      </div>
                      {inv.dueAmount > 0 && (
                        <button
                          onClick={() => handlePayInvoice(inv, "RENT")}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                        >
                          ভাড়া পরিশোধ করুন (৳ {inv.dueAmount})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* VIEW 4: MEALS ONLY (শুধু মিল-বাজার) */}
                {/* -------------------------------------------------------- */}
                {effectiveMode === "MEALS_ONLY" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">মোট মিল:</span>
                        <span className="font-bold text-base text-slate-900">{details.mealAcc.totalMeals} টি</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">মিল রেট:</span>
                        <span className="font-bold text-base text-slate-900">৳ {details.mealAcc.mealRate}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">খাবারের মোট খরচ:</span>
                        <span className="font-bold text-base text-slate-900">৳ {details.mealAcc.mealCost}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block">বাজারে জমা/খরচ:</span>
                        <span className="font-bold text-base text-indigo-700">৳ {details.mealAcc.totalBazarSpent}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-900">বাজার ব্যালেন্স স্ট্যাটাস:</span>
                        <p className="text-[11px] text-slate-600">বাজার খরচ থেকে মোট খাওয়ার খরচ বাদ দিয়ে হিসাব</p>
                      </div>
                      <span className="text-lg font-black">
                        {details.mealAcc.netMealBalance > 0 ? (
                          <span className="text-emerald-700">+৳ {details.mealAcc.netMealBalance} পাবে (Refund)</span>
                        ) : details.mealAcc.netMealBalance < 0 ? (
                          <span className="text-rose-700">-৳ {Math.abs(details.mealAcc.netMealBalance)} দিবে (Due)</span>
                        ) : (
                          <span className="text-slate-700">৳ 0 সমান</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* PAYMENT HISTORY / LEDGER TRAIL */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>
            {isOwnerOrAdmin
              ? locale === "bn"
                ? "সকল মেম্বারদের পেমেন্ট ও বাজার লেনদেন হিস্টোরি"
                : "Master Rent & Bazar Transaction Ledger"
              : locale === "bn"
              ? "আপনার ব্যক্তিগত জমার রসিদ ও লেজার"
              : "Your Personal Transaction History"}
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
              <div>
                <h3 className="font-bold text-slate-900 text-base">Quick Digital Pay</h3>
                <p className="text-xs text-slate-500">
                  {selectedInvoice?.number} ({selectedInvoice?.member})
                </p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPayment} className="space-y-3.5 text-xs">
              {/* Payment Purpose Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  পেমেন্টের খাত নির্বাচন করুন (Payment Purpose):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePurposeChange("COMBINED")}
                    className={`py-2 px-1 rounded-xl font-bold text-[11px] transition text-center ${
                      payPurpose === "COMBINED"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    কম্বাইন্ড বিল
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePurposeChange("RENT")}
                    className={`py-2 px-1 rounded-xl font-bold text-[11px] transition text-center ${
                      payPurpose === "RENT"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    শুধু বাসা ভাড়া
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePurposeChange("MEALS")}
                    className={`py-2 px-1 rounded-xl font-bold text-[11px] transition text-center ${
                      payPurpose === "MEALS"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    শুধু মিলের বাকি
                  </button>
                </div>
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
