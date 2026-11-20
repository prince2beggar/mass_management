"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShoppingCart,
  Plus,
  Receipt,
  CheckCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Tag,
  Calendar,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BazarRecord {
  id: string;
  date: string;
  shopper: string;
  category: string;
  totalAmount: number;
  notes: string;
  isVerified: boolean;
  verifiedBy?: string;
  items: { name: string; qty: string; price: number }[];
}

export default function BazarPage() {
  const { t, role, showToast } = useApp();
  const [bazarList, setBazarList] = useState<BazarRecord[]>([
    {
      id: "bz-1",
      date: "2026-11-18",
      shopper: "Tanvir Hasan",
      category: "MEAT_FISH",
      totalAmount: 1850,
      notes: "Bought Rui fish 2.5kg and Deshi chicken 2 pieces from Karwan Bazar.",
      isVerified: true,
      verifiedBy: "Rahim Ahmed (Owner)",
      items: [
        { name: "Rui Fish (Fresh)", qty: "2.5 kg", price: 950 },
        { name: "Deshi Broiler Chicken", qty: "4.5 kg", price: 900 },
      ],
    },
    {
      id: "bz-2",
      date: "2026-11-19",
      shopper: "Kamrul Islam",
      category: "VEGETABLE",
      totalAmount: 1240,
      notes: "Potato, onion, green chili, garlic, and soybean oil for cooking.",
      isVerified: false,
      items: [
        { name: "Potato (Alu)", qty: "10 kg", price: 450 },
        { name: "Onion (Peyaj)", qty: "5 kg", price: 450 },
        { name: "Soybean Oil", qty: "2 Liters", price: 340 },
      ],
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>("bz-1");
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Form State
  const [formDate, setFormDate] = useState("2026-11-20");
  const [formShopper, setFormShopper] = useState("Kamrul Islam");
  const [formCategory, setFormCategory] = useState("GROCERY");
  const [formAmount, setFormAmount] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formItemName, setFormItemName] = useState("");
  const [formItemQty, setFormItemQty] = useState("");
  const [formItemPrice, setFormItemPrice] = useState("");
  const [itemsList, setItemsList] = useState<{ name: string; qty: string; price: number }[]>([]);

  const addItemToForm = () => {
    if (!formItemName || !formItemPrice) {
      showToast("Please provide item name and price", "error");
      return;
    }
    const priceNum = parseFloat(formItemPrice);
    setItemsList((prev) => [
      ...prev,
      { name: formItemName, qty: formItemQty || "1 unit", price: priceNum },
    ]);
    // auto calculate total
    const newTotal = (parseFloat(formAmount || "0") + priceNum).toString();
    setFormAmount(newTotal);
    setFormItemName("");
    setFormItemQty("");
    setFormItemPrice("");
  };

  const handleCreateBazar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || parseFloat(formAmount) <= 0) {
      showToast("Please specify a valid total amount", "error");
      return;
    }

    const newRecord: BazarRecord = {
      id: `bz-${Date.now()}`,
      date: formDate,
      shopper: formShopper,
      category: formCategory,
      totalAmount: parseFloat(formAmount),
      notes: formNotes || "Regular daily mess bazar.",
      isVerified: false,
      items: itemsList.length > 0 ? itemsList : [{ name: "General Bazar Goods", qty: "1 batch", price: parseFloat(formAmount) }],
    };

    setBazarList([newRecord, ...bazarList]);
    showToast(`Bazar entry of ৳ ${formAmount} submitted for verification!`, "success");
    setModalOpen(false);
    setFormAmount("");
    setFormNotes("");
    setItemsList([]);
  };

  const verifyBazarEntry = (id: string) => {
    setBazarList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isVerified: true, verifiedBy: "Manager Verified" } : b))
    );
    showToast("Bazar expense verified and approved into meal ledger!", "success");
  };

  const totalSpent = bazarList.reduce((acc, b) => acc + b.totalAmount, 0);

  const filteredBazar = bazarList.filter((b) => {
    if (filterCategory === "ALL") return true;
    return b.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <ShoppingCart className="w-4 h-4" />
            <span>Daily Kitchen Accounting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.bazar.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent itemized bazar logs, receipt proof, and instant meal rate computation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{t.bazar.addEntry}</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total November Bazar</span>
          <div className="text-3xl font-black text-slate-900">৳ {totalSpent.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
            {bazarList.length} shopping runs recorded
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Verification Status</span>
          <div className="text-3xl font-black text-indigo-600">
            {bazarList.filter((b) => b.isVerified).length} / {bazarList.length}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {bazarList.filter((b) => !b.isVerified).length} pending manager approval
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Top Expense Category</span>
          <div className="text-2xl font-bold text-slate-800">Meat & Fish (59.8%)</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Rui fish & Deshi broiler</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Category:</span>
          {["ALL", "MEAT_FISH", "VEGETABLE", "GROCERY"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === cat
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat === "MEAT_FISH" ? "Meat & Fish" : cat === "VEGETABLE" ? "Vegetables" : "Groceries"}
            </button>
          ))}
        </div>
      </div>

      {/* Bazar Entries List */}
      <div className="space-y-4">
        {filteredBazar.map((bazar) => {
          const isExpanded = expandedId === bazar.id;
          return (
            <div
              key={bazar.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">৳ {bazar.totalAmount}</h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {bazar.category}
                      </span>
                      {bazar.isVerified ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{t.bazar.verifiedBadge}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{t.bazar.unverifiedBadge}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Shopper: <span className="font-semibold text-slate-800">{bazar.shopper}</span> • Date: {bazar.date}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 italic">"{bazar.notes}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center">
                  {!bazar.isVerified && (role === "OWNER" || role === "MEAL_MANAGER" || role === "SUPER_ADMIN") && (
                    <button
                      onClick={() => verifyBazarEntry(bazar.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      Verify & Approve
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : bazar.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <span>{isExpanded ? "Hide Items" : "View Items"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Itemized Breakdown */}
              {isExpanded && (
                <div className="bg-slate-50/70 border-t border-slate-100 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Itemized Shopping Slip
                  </h4>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3">Quantity</th>
                          <th className="py-2.5 px-3 text-right">Price (BDT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {bazar.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-medium text-slate-900">{it.name}</td>
                            <td className="py-2 px-3 text-slate-600">{it.qty}</td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900">৳ {it.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Record Bazar Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Bazar Purchase</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBazar} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Shopper Name</label>
                  <input
                    type="text"
                    required
                    value={formShopper}
                    onChange={(e) => setFormShopper(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Primary Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                  >
                    <option value="MEAT_FISH">Meat & Fish</option>
                    <option value="VEGETABLE">Vegetables & Greens</option>
                    <option value="GROCERY">Rice, Dal & Groceries</option>
                    <option value="OIL_SPICE">Oil & Spices</option>
                    <option value="GAS">LPG Cylinder / Gas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Bazar Cost (৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Add Individual Item Inputs */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 block">Add Itemized Products (Optional)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Product (e.g. Rice)"
                    value={formItemName}
                    onChange={(e) => setFormItemName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Qty (e.g. 5 kg)"
                    value={formItemQty}
                    onChange={(e) => setFormItemQty(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300"
                  />
                  <input
                    type="number"
                    placeholder="Price (৳)"
                    value={formItemPrice}
                    onChange={(e) => setFormItemPrice(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={addItemToForm}
                  className="w-full py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition"
                >
                  + Add Item to Slip
                </button>

                {itemsList.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {itemsList.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded">
                        <span>{it.name} ({it.qty})</span>
                        <span className="font-bold">৳ {it.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Shopping Notes / Market Location</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bought from Karwan Bazar morning market."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Save Bazar Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
