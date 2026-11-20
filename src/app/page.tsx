"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Utensils,
  ShoppingCart,
  CreditCard,
  Building,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
  BadgeAlert,
  ChevronRight,
  Check,
  X,
  Palette,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { t, locale, showToast } = useApp();
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>("ALL");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string>("Room 102 - Bed B");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [accentTheme, setAccentTheme] = useState("#4f46e5");

  // Sample rooms & seats data
  const roomsData = [
    {
      id: "bed-102b",
      room: "Room 102",
      bed: "Bed B (Window Side)",
      type: "SHARED",
      monthlyRent: 3200,
      dailyRent: 250,
      status: "AVAILABLE",
      floor: 1,
      amenities: ["Attached Balcony", "High-speed Wi-Fi", "Separate Study Table", "Filter Water"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bed-101a",
      room: "Room 101",
      bed: "Bed A",
      type: "SHARED",
      monthlyRent: 3500,
      dailyRent: 300,
      status: "OCCUPIED",
      floor: 1,
      amenities: ["Large Wardrobe", "Ceiling Fan", "Power Backup"],
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "room-201a",
      room: "Room 201",
      bed: "Master Suite Bed",
      type: "SINGLE",
      monthlyRent: 6500,
      dailyRent: 600,
      status: "RESERVED",
      floor: 2,
      amenities: ["Private Attached Bath", "Balcony View", "Air Cooler Support"],
      image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredRooms = roomsData.filter((r) => {
    if (selectedRoomFilter === "ALL") return true;
    return r.type === selectedRoomFilter;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      showToast("Please provide both name and phone number", "error");
      return;
    }
    showToast(`Booking request for ${selectedSeat} submitted successfully! We will contact you soon.`, "success");
    setBookingModalOpen(false);
    setGuestName("");
    setGuestPhone("");
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900/10 via-slate-50 to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {t.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95"
                >
                  <LayoutDashboardIcon className="w-4 h-4" />
                  <span>{t.nav.dashboard}</span>
                </Link>
                <Link
                  href="/meals"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition active:scale-95"
                >
                  <Utensils className="w-4 h-4 text-indigo-600" />
                  <span>{t.meals.title}</span>
                </Link>
                <Link
                  href="/emergency"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>999 Emergency</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Audit Transparency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">৳ 54.50</div>
                  <div className="text-xs text-slate-500 font-medium">Avg. Meal Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">0%</div>
                  <div className="text-xs text-slate-500 font-medium">C: Drive Storage</div>
                </div>
              </div>
            </div>

            {/* Hero Live Snapshot Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Green View Student Mess</h3>
                      <p className="text-xs text-slate-500">Farmgate, Dhaka • Live Portal</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Tenant
                  </span>
                </div>

                {/* Live Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                    <span className="text-slate-500 block mb-1">Today's Total Meals</span>
                    <span className="text-xl font-bold text-indigo-700">15 Meals</span>
                    <span className="block text-[10px] text-indigo-500 mt-0.5">5 Breakfast • 5 Lunch • 5 Dinner</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-slate-500 block mb-1">Estimated Meal Rate</span>
                    <span className="text-xl font-bold text-emerald-700">৳ 54.50</span>
                    <span className="block text-[10px] text-emerald-600 mt-0.5">Based on ৳3,090 Bazar</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                    <span className="text-slate-500 block mb-1">Seat Occupancy</span>
                    <span className="text-xl font-bold text-amber-700">4 / 5 Occupied</span>
                    <span className="block text-[10px] text-amber-600 mt-0.5">1 Vacant Seat Left</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                    <span className="text-slate-500 block mb-1">Next Cut-off Timer</span>
                    <span className="text-xl font-bold text-purple-700">Dinner 4:00 PM</span>
                    <span className="block text-[10px] text-purple-600 mt-0.5">Automated SMS/Alert</span>
                  </div>
                </div>

                {/* Quick Interactive Meal Status Toggle Preview */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">My Status Today (Kamrul Islam)</span>
                    <span className="text-emerald-400 font-semibold">ALL MEALS ON</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Breakfast: 1
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Lunch: 1
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Dinner: 1
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block text-center text-xs font-semibold py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                  >
                    Open Member Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Room & Seat Accommodation Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              {t.rentals.subtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t.rentals.title}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
            {["ALL", "SHARED", "SINGLE"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedRoomFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedRoomFilter === f
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f === "ALL" ? "All Rooms" : f === "SHARED" ? "Shared Beds" : "Single Suites"}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.room}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur">
                    {room.room} • {room.bed}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur ${
                      room.status === "AVAILABLE"
                        ? "bg-emerald-500 text-white"
                        : room.status === "OCCUPIED"
                        ? "bg-slate-800/80 text-slate-200"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-extrabold text-slate-900">৳ {room.monthlyRent}</span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-3">
                    Daily Guest Stay: <span className="font-semibold text-slate-800">৳ {room.dailyRent} / day</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {room.amenities.map((am, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  disabled={room.status !== "AVAILABLE"}
                  onClick={() => {
                    setSelectedSeat(`${room.room} - ${room.bed}`);
                    setBookingModalOpen(true);
                  }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
                    room.status === "AVAILABLE"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {room.status === "AVAILABLE" ? (
                    <>
                      <span>{t.rentals.bookNow}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Seat Occupied</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Emergency Hotline Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-rose-900/40 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
                <BadgeAlert className="w-3.5 h-3.5" />
                <span>Verified 24/7 Safety Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.emergency.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {t.emergency.subtitle}
              </p>
            </div>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition self-start"
            >
              <span>Full Emergency Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* National 999 */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-rose-500/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  National Hotline
                </span>
                <h4 className="font-bold text-white text-sm">Police / Ambulance / Fire</h4>
                <p className="text-xs text-slate-400">Bangladesh National Emergency Response</p>
              </div>
              <a
                href="tel:999"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                <span>Call 999</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Fire Service */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-amber-500/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Civil Defence
                </span>
                <h4 className="font-bold text-white text-sm">Fire Service Control Room</h4>
                <p className="text-xs text-slate-400">Direct Central Control Hotline</p>
              </div>
              <a
                href="tel:16163"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
              >
                <span>Call 16163</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tejgaon Police */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-indigo-500/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  Local Police Station
                </span>
                <h4 className="font-bold text-white text-sm">Tejgaon Model Thana</h4>
                <p className="text-xs text-slate-400">Direct Duty Officer Hotline</p>
              </div>
              <a
                href="tel:+88028143300"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                <span>Call 02-8143300</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Landlord Contact */}
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-emerald-500/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Mess Authority
                </span>
                <h4 className="font-bold text-white text-sm">Haji Abul Kashem (Owner)</h4>
                <p className="text-xs text-slate-400">Green View House, Flat 5A</p>
              </div>
              <a
                href="tel:+8801712345678"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                <span>Call Landlord</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* House Rules & Notices Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rules Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">{t.notices.houseRules}</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                  1
                </span>
                <span>{t.notices.rule1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                  2
                </span>
                <span>{t.notices.rule2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                  3
                </span>
                <span>{t.notices.rule3}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                  4
                </span>
                <span>{t.notices.rule4}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                  5
                </span>
                <span>{t.notices.rule5}</span>
              </li>
            </ul>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeAlert className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-lg">{t.notices.title}</h3>
              </div>
              <Link href="/notices" className="text-xs text-indigo-600 hover:underline font-semibold">
                {t.common.viewAll} →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1">
                  <span>MONTHLY MESS MEETING</span>
                  <span>Friday 9:00 PM</span>
                </div>
                <p className="text-xs text-slate-700">
                  All members must attend to review the monthly bazar rotation schedule and meal rate calculation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 mb-1">
                  <span>WATER TANK CLEANING</span>
                  <span>Sunday 10 AM - 1 PM</span>
                </div>
                <p className="text-xs text-slate-700">
                  Water supply will remain off for 3 hours for routine tank cleaning and hygiene inspection.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 mb-1">
                  <span>WIFI UPGRADE DONE</span>
                  <span>Active Now</span>
                </div>
                <p className="text-xs text-slate-700">
                  New 100 Mbps fiber line installed. Contact Tanvir for credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Seat Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Seat Booking Inquiry</h3>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Selected Seat / Bed</label>
                <input
                  type="text"
                  disabled
                  value={selectedSeat}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number (Mobile)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01712345678"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-[11px] space-y-1">
                <span className="font-bold">Next Steps:</span>
                <p>The mess manager will verify seat availability and call you for an in-person room visit.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
