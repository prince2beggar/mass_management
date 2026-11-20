"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, UserRole } from "@/context/AppContext";
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
  Camera,
  Calendar,
  MapPin,
  Lock,
  LogIn,
  Shield,
  User,
  Star,
  UserCheck,
  Award,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Edit3,
} from "lucide-react";

export default function HomePage() {
  const { locale, role, isLoggedIn, currentUser, loginAs, members, alumni, updateMemberRole, showToast } = useApp();
  const router = useRouter();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Role Edit Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<(typeof members)[0] | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>("MEMBER");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const handleOpenRoleModal = (m: (typeof members)[0]) => {
    setEditingMember(m);
    setSelectedNewRole(m.role);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsUpdatingRole(true);
    await updateMemberRole(editingMember.id, selectedNewRole);
    setIsUpdatingRole(false);
    setRoleModalOpen(false);
    setEditingMember(null);
  };

  // Clean Mess & Tour Photos
  const photoHighlights = [
    {
      title: "Student Double Bedroom",
      titleBn: "২-সিটের প্রশস্ত বেডরুম ও স্টাডি টেবিল",
      category: "Room",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Common Dining Room",
      titleBn: "সদস্যদের ডাইনিং স্পেস ও টিভি",
      category: "Dining",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Hygienic Modern Kitchen",
      titleBn: "স্বাস্থ্যসম্মত মেস কিচেন ও ফিল্টার পানি",
      category: "Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Annual Grand Feast",
      titleBn: "বার্ষিক গ্র্যান্ড মেস ভোজ (কাচ্চি বিরিয়ানি)",
      category: "Event",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Sajek Valley Tour",
      titleBn: "মেঘের দেশ সাজেক ভ্যালি মেস ট্যুর",
      category: "Tour",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Cox's Bazar Beach Trip",
      titleBn: "কক্সবাজার সমুদ্র সৈকত বার্ষিক ভ্রমণ",
      category: "Tour",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleMemberQuickLogin = (m: any) => {
    loginAs(m.role as UserRole, m.name, m.room);
    showToast(
      locale === "bn"
        ? `স্বাগতম ${m.name}! আপনার ড্যাশবোর্ডে প্রবেশ করছেন...`
        : `Welcome ${m.name}! Logging into your dashboard...`,
      "success"
    );
    router.push("/dashboard");
  };

  return (
    <div className="space-y-16 pb-20 text-slate-800">
      {/* ========================================================= */}
      {/* 1. SIMPLE & CLEAR HERO SECTION */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            {/* Location & Tenant Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{locale === "bn" ? "ফার্মগেট, ঢাকা • প্রতিষ্ঠিত ২০২০" : "Farmgate, Dhaka • Estd. 2020"}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {locale === "bn" ? (
                <>গ্রিন ভিউ ছাত্র মেস — সম্পূর্ণ ডিজিটাল পোর্টাল</>
              ) : (
                <>Green View Student Mess — Official Portal</>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {locale === "bn"
                ? "শান্ত ও পড়াশোনার অনুকূল পরিবেশে ছাত্রদের থাকার আধুনিক ঠিকানা। প্রতিদিনের মিল, বাজার খরচ ও ব্যক্তিগত লেজার সম্পূর্ণ অনলাইনে পরিচালিত।"
                : "A peaceful and disciplined student residence in Central Dhaka. Daily meals, grocery accounts, and monthly bills are 100% digitally automated."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  <Utensils className="w-4 h-4" />
                  <span>{locale === "bn" ? "আমার ড্যাশবোর্ড ও মিল হিসাব" : "My Dashboard & Meals"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{locale === "bn" ? "মেম্বার লগইন করুন" : "Member Login"}</span>
                  </button>

                  <button
                    onClick={() => {
                      loginAs("OWNER", "Rahim Ahmed", "Room 201");
                      showToast(locale === "bn" ? "অ্যাডমিন হিসেবে লগইন হয়েছে" : "Logged in as Admin", "success");
                      router.push("/admin");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition active:scale-95"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>{locale === "bn" ? "অ্যাডমিন পোর্টাল (মেম্বার এড)" : "Admin Portal (Add Member)"}</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto border-t border-slate-200 text-center">
              <div>
                <span className="text-xl font-bold text-slate-900">{members.length}</span>
                <span className="block text-[11px] text-slate-500 font-medium">
                  {locale === "bn" ? "বর্তমান মেম্বার" : "Residents"}
                </span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">{alumni.length}+</span>
                <span className="block text-[11px] text-slate-500 font-medium">
                  {locale === "bn" ? "প্রাক্তন মেম্বার (Alumni)" : "Ex-Members"}
                </span>
              </div>
              <div>
                <span className="text-xl font-bold text-emerald-600">৳ 54.50</span>
                <span className="block text-[11px] text-slate-500 font-medium">
                  {locale === "bn" ? "বর্তমান মিল রেট" : "Meal Rate"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CURRENT RESIDENT MEMBERS ROSTER (কারা কারা মেম্বার) */}
      {/* ========================================================= */}
      <section id="members" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>{locale === "bn" ? "সদস্য তালিকা" : "Resident Roster"}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {locale === "bn" ? "মেসের বর্তমান মেম্বারবৃন্দ" : "Current Mess Members"}
            </h2>
            <p className="text-xs text-slate-500">
              {locale === "bn"
                ? "কোন মেম্বার কোন রুমে থাকেন এবং তাদের পদবী নিচে দেওয়া হলো। যেকোনো মেম্বারের প্রোফাইলে ক্লিক করে লগইন টেস্ট করতে পারেন।"
                : "Active resident members, room numbers, and roles. Click any profile to simulate login."}
            </p>
          </div>

          {!isLoggedIn && (
            <button
              onClick={() => {
                loginAs("OWNER", "Rahim Ahmed", "Room 201");
                router.push("/admin");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition self-start sm:self-auto"
            >
              + {locale === "bn" ? "নতুন মেম্বার এড করুন (Admin)" : "Add New Member"}
            </button>
          )}
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={m.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt={m.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{m.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        m.role === "ADMIN" || m.role === "OWNER"
                          ? "bg-emerald-100 text-emerald-800"
                          : m.role === "MEAL_MANAGER"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {m.role === "ADMIN" || m.role === "OWNER" ? "Admin" : m.role === "MEAL_MANAGER" ? "Manager" : "Member"}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold">{m.room}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{m.description || m.institution}</p>
                  {m.emergencyContactPhone && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 border border-rose-100/80 px-2 py-0.5 rounded-lg w-fit">
                      <span>জরুরি: {m.emergencyContactPhone} ({m.emergencyContactRelation || "অভিভাবক"})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Joined: {m.joinedDate}</span>
                <div className="flex items-center gap-1.5">
                  {(role === "OWNER" || role === "SUPER_ADMIN") && (
                    <button
                      onClick={() => handleOpenRoleModal(m)}
                      title="মেম্বারের মেসের পদবী বা রোল পরিবর্তন করুন"
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200 transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{locale === "bn" ? "রোল এডিট" : "Edit Role"}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleMemberQuickLogin(m)}
                    className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition"
                  >
                    {locale === "bn" ? "লগইন করুন →" : "Login as →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. EX-MEMBERS & ALUMNI HALL OF FAME (প্রাক্তন মেম্বার) */}
      {/* ========================================================= */}
      <section id="alumni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>{locale === "bn" ? "অ্যালামনাই ও প্রাক্তন মেম্বার" : "Alumni & Ex-Members"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {locale === "bn" ? "যাঁরা এই মেসে ছিলেন ও স্মৃতি রেখে গেছেন" : "Former Residents Hall of Fame"}
          </h2>
          <p className="text-xs text-slate-500">
            {locale === "bn"
              ? "এই মেস থেকে পড়াশোনা শেষ করে যারা কর্মক্ষেত্রে সফলভাবে প্রতিষ্ঠিত হয়েছেন তাদের তালিকা ও স্মৃতি।"
              : "Honoring former residents who completed their degrees while staying at Green View Mess and are now successful professionals."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {alumni.map((a) => (
            <div
              key={a.id}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={a.avatarUrl}
                  alt={a.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium block">{a.room}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{a.institution}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/60 text-xs text-indigo-900">
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-indigo-700">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{locale === "bn" ? "বর্তমান অবস্থান:" : "Current Position:"}</span>
                </div>
                <p className="text-slate-700">{locale === "bn" ? a.achievementBn : a.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. MESS PHOTOS & TOUR MOMENTS (মেস ও ট্যুর ছবি) */}
      {/* ========================================================= */}
      <section id="photos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>{locale === "bn" ? "মেসের ছবি ও ট্যুর" : "Photo Moments"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {locale === "bn" ? "মেসের ভেতরের ছবি ও বার্ষিক ট্যুর স্মৃতি" : "Mess Living Spaces & Travel Memories"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {photoHighlights.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(p.image)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs hover:shadow-md transition"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="p-2 text-left">
                <span className="font-bold text-[11px] text-slate-800 line-clamp-1 block">
                  {locale === "bn" ? p.titleBn : p.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. NOTICE BOARD & EMERGENCY (নোটিশ ও জরুরি হটলাইন) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notices */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeAlert className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  {locale === "bn" ? "সাম্প্রতিক মেস নোটিশ" : "Recent Mess Notices"}
                </h3>
              </div>
              <Link href="/notices" className="text-xs text-indigo-600 font-bold hover:underline">
                {locale === "bn" ? "সবগুলো দেখুন →" : "View All →"}
              </Link>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block">বার্ষিক মেস ভোজের চাঁদা জমার শেষ তারিখ</span>
                <p className="text-slate-600 mt-0.5">মঙ্গলবার রাত ১০টার মধ্যে ম্যানেজার তানভীরের নিকট ৪৫০ টাকা জমা দিন।</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="font-bold text-indigo-900 block">নতুন ১০০ এমবিপিএস ফাইবার ওয়াইফাই সক্রিয়</span>
                <p className="text-slate-600 mt-0.5">নতুন ওয়াইফাই রাউটারের পাসওয়ার্ড জানতে ম্যানেজার ভাইয়ের সাথে যোগাযোগ করুন।</p>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-base">
                {locale === "bn" ? "জরুরি হটলাইন ও যোগাযোগ" : "Emergency Direct Line"}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {locale === "bn"
                ? "যেকোনো জরুরি প্রয়োজনে জাতীয় হটলাইন অথবা মেস এডমিনের সরাসরি নম্বরে কল করুন।"
                : "For police, medical, fire, or mess admin emergencies."}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:999"
                className="p-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 font-bold text-center block text-white"
              >
                National 999
              </a>
              <a
                href="tel:+8801711223344"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-center block text-slate-200 border border-slate-700"
              >
                Call Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SIMPLE LOGIN MODAL */}
      {/* ========================================================= */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {locale === "bn" ? "মেসমেট মেম্বার লগইন" : "Sign in to MessMate"}
                </h3>
                <p className="text-xs text-slate-500">Green View Student Mess</p>
              </div>
              <button onClick={() => setLoginModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Login List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-600 block">
                {locale === "bn" ? "১-ক্লিকে যেকোনো মেম্বার হিসেবে ঢুকুন:" : "1-Click Demo Login:"}
              </span>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    handleMemberQuickLogin(m);
                    setLoginModalOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 flex items-center justify-between text-left transition"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{m.name}</span>
                    <span className="text-[11px] text-slate-500">{m.room} • {m.role}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center">
            <img src={selectedPhoto} alt="Photo" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Role Edit Modal (Admin / Owner quick action from homepage) */}
      {roleModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    মেম্বার রোল ও দায়িত্ব পরিবর্তন (Edit Role)
                  </h3>
                  <p className="text-xs text-slate-500">
                    নির্দিষ্ট মেম্বারের পারমিশন এবং দায়িত্ব পরিবর্তন করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Member Info Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{editingMember.name}</h4>
                <p className="text-xs text-slate-500">{editingMember.email} • {editingMember.room}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800">
                বর্তমান: {editingMember.role}
              </span>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  নতুন পদবী / রোল নির্বাচন করুন:
                </label>

                {/* Option 1: MEMBER */}
                <label
                  onClick={() => setSelectedNewRole("MEMBER")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "MEMBER"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">MEMBER (সাধারণ সদস্য)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">Resident</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        নিজের মিল অন/অফ করতে পারবে, সার্বিক মিল-বাজার ব্যালেন্স দেখতে পারবে, নিজের বাসা ভাড়ার ইনভয়েস দেখতে পারবে।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="homeRoleOption"
                      checked={selectedNewRole === "MEMBER"}
                      onChange={() => setSelectedNewRole("MEMBER")}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </label>

                {/* Option 2: MEAL_MANAGER */}
                <label
                  onClick={() => setSelectedNewRole("MEAL_MANAGER")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "MEAL_MANAGER"
                      ? "border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">MEAL_MANAGER (মিল ও বাজার ম্যানেজার)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Monthly Manager</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        চলতি মাসের দায়িত্বপ্রাপ্ত ম্যানেজার। সবার মিল এন্ট্রি পরিবর্তন করতে পারবে, প্রতিদিনের বাজার খরচ যুক্ত করতে পারবে।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="homeRoleOption"
                      checked={selectedNewRole === "MEAL_MANAGER"}
                      onChange={() => setSelectedNewRole("MEAL_MANAGER")}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                </label>

                {/* Option 3: ADMIN */}
                <label
                  onClick={() => setSelectedNewRole("ADMIN")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "ADMIN" || selectedNewRole === "OWNER"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">ADMIN (মেস এডমিন)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Full Access</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        সম্পূর্ণ মেস নিয়ন্ত্রণ: নতুন সদস্য ও ছবি অ্যাড করা, রোল এডিট করা, ভাড়া ও ইউটিলিটি বিল এডিট করা এবং মাস শেষ ক্লোজিং অনুমোদন করা।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="homeRoleOption"
                      checked={selectedNewRole === "ADMIN" || selectedNewRole === "OWNER"}
                      onChange={() => setSelectedNewRole("ADMIN")}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                </label>

                {/* Option 4: SUPER_ADMIN */}
                <label
                  onClick={() => setSelectedNewRole("SUPER_ADMIN")}
                  className={`block p-3 rounded-2xl border cursor-pointer transition ${
                    selectedNewRole === "SUPER_ADMIN"
                      ? "border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">SUPER_ADMIN (সুপার এডমিন)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">System Root</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        প্ল্যাটফর্মের সর্বোচ্চ লেভেল অ্যাক্সেস ও কনফিগারেশন।
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="homeRoleOption"
                      checked={selectedNewRole === "SUPER_ADMIN"}
                      onChange={() => setSelectedNewRole("SUPER_ADMIN")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRole}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  {isUpdatingRole ? (
                    <span>সংরক্ষণ হচ্ছে...</span>
                  ) : (
                    <span>রোল পরিবর্তন সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
