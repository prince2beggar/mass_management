"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations, getTranslation } from "@/lib/i18n";

export type UserRole = "ADMIN" | "OWNER" | "MEAL_MANAGER" | "MEMBER" | "SUPER_ADMIN" | "GUEST";

export interface CurrentUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  room: string;
}

export interface AppMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  room: string;
  institution: string;
  description?: string;
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  status: "ACTIVE" | "EX_MEMBER";
  joinedDate: string;
  leftDate?: string;
  achievement?: string;
  achievementBn?: string;
}

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  currentUser: CurrentUser | null;
  loginAs: (role: UserRole, customName?: string, customRoom?: string) => void;
  logout: () => void;
  members: AppMember[];
  alumni: AppMember[];
  addMember: (newMember: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    roomNumber: string;
    institution: string;
    description?: string;
    avatarUrl?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
  }) => Promise<boolean>;
  updateMemberRole: (memberId: string, newRole: UserRole) => Promise<boolean>;
  t: (typeof translations)["en"];
  themeColor: string;
  setThemeColor: (color: string) => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial default active members roster
const initialActiveMembers: AppMember[] = [
  {
    id: "mem-1",
    name: "Rahim Ahmed",
    phone: "01711223344",
    email: "rahim@greenview.com",
    role: "ADMIN",
    room: "Room 201 (Master Bed)",
    institution: "Mess Admin / Manager",
    description: "মেস অ্যাডমিনিস্ট্রেশন ও ম্যানেজমেন্ট ইনচার্জ",
    emergencyContactName: "ফারহানা আহমেদ",
    emergencyContactPhone: "01711009988",
    emergencyContactRelation: "Spouse",
    status: "ACTIVE",
    joinedDate: "2020-01-01",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "mem-2",
    name: "Tanvir Hasan",
    phone: "01811556677",
    email: "tanvir@greenview.com",
    role: "MEAL_MANAGER",
    room: "Room 102 (Bed C)",
    institution: "Dhaka University (Accounting)",
    description: "চলতি মাসের মিল ও বাজার হিসাব ইনচার্জ",
    emergencyContactName: "আনোয়ার হোসেন",
    emergencyContactPhone: "01912554433",
    emergencyContactRelation: "Brother",
    status: "ACTIVE",
    joinedDate: "2024-01-15",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "mem-3",
    name: "Kamrul Islam",
    phone: "01911889900",
    email: "kamrul@greenview.com",
    role: "MEMBER",
    room: "Room 101 (Bed A)",
    institution: "Dhaka University (CSE)",
    description: "সিএসই বিভাগ, ৩য় বর্ষ। রক্তের গ্রুপ B+",
    emergencyContactName: "মো. রফিকুল ইসলাম",
    emergencyContactPhone: "01712998877",
    emergencyContactRelation: "Father",
    status: "ACTIVE",
    joinedDate: "2024-03-01",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "mem-4",
    name: "Sakib Al Mahmud",
    phone: "01611334455",
    email: "sakib@greenview.com",
    role: "MEMBER",
    room: "Room 101 (Bed B)",
    institution: "BUET (EEE)",
    description: "বুয়েট ইইই বিভাগ। রক্তের গ্রুপ O+",
    emergencyContactName: "মাহমুদা বেগম",
    emergencyContactPhone: "01819776655",
    emergencyContactRelation: "Mother",
    status: "ACTIVE",
    joinedDate: "2024-05-10",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "mem-5",
    name: "Mehedi Hasan",
    phone: "01511778899",
    email: "mehedi@greenview.com",
    role: "MEMBER",
    room: "Room 102 (Bed A)",
    institution: "Green University (BBA)",
    description: "বিবিএ শিক্ষার্থী। টেবিল টেনিস ও দাবা প্রিয়",
    emergencyContactName: "হাসান আলী",
    emergencyContactPhone: "01511002233",
    emergencyContactRelation: "Father",
    status: "ACTIVE",
    joinedDate: "2024-06-01",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
  },
];

// Initial Ex-Members / Alumni Hall of Fame
const initialAlumni: AppMember[] = [
  {
    id: "alumni-1",
    name: "Fahim Hossain (ফাহিম হোসেন)",
    phone: "01712001122",
    email: "fahim.alumni@greenview.com",
    role: "MEMBER",
    room: "Room 101 (Alumni 2020-2023)",
    institution: "Dhaka University (CSE)",
    status: "EX_MEMBER",
    joinedDate: "2020-01-10",
    leftDate: "2023-12-31",
    achievement: "Software Engineer at Brain Station 23",
    achievementBn: "বর্তমানে ব্রেন স্টেশন ২৩-এ সফটওয়্যার ইঞ্জিনিয়ার",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "alumni-2",
    name: "Engr. Ariful Islam (প্রকৌ. আরিফুল ইসলাম)",
    phone: "01819002233",
    email: "ariful.alumni@greenview.com",
    role: "MEMBER",
    room: "Room 201 (Alumni 2019-2024)",
    institution: "BUET (EEE)",
    status: "EX_MEMBER",
    joinedDate: "2019-03-01",
    leftDate: "2024-04-15",
    achievement: "Assistant Engineer at Power Grid Co. (PGCB)",
    achievementBn: "সহকারী প্রকৌশলী, পাওয়ার গ্রিড কোম্পানি অব বাংলাদেশ (PGCB)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "alumni-3",
    name: "Dr. Nazmul Huda (ডা. নাজমুল হুদা)",
    phone: "01912003344",
    email: "nazmul.alumni@greenview.com",
    role: "MEMBER",
    room: "Room 102 (Alumni 2018-2023)",
    institution: "Dhaka Medical College (MBBS)",
    status: "EX_MEMBER",
    joinedDate: "2018-05-12",
    leftDate: "2023-06-30",
    achievement: "Medical Officer at BSMMU Hospital",
    achievementBn: "চিকিৎসক ও মেডিকেল অফিসার, বিএসএমএমইউ হাসপাতাল",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [role, setRoleState] = useState<UserRole>("GUEST");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [members, setMembers] = useState<AppMember[]>(initialActiveMembers);
  const [alumni] = useState<AppMember[]>(initialAlumni);

  const [themeColor, setThemeColor] = useState<string>("#4f46e5");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("messmate_locale", newLocale);
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "GUEST") {
      setIsLoggedIn(false);
      setCurrentUser(null);
    } else {
      setIsLoggedIn(true);
      const matched = members.find((m) => m.role === newRole) || members[2];
      setCurrentUser({
        name: matched ? matched.name : "Kamrul Islam",
        email: matched ? matched.email : "kamrul@greenview.com",
        phone: matched ? matched.phone : "01911889900",
        role: newRole,
        room: matched ? matched.room : "Room 101",
      });
    }
  };

  const loginAs = (targetRole: UserRole, customName?: string, customRoom?: string) => {
    setRoleState(targetRole);
    setIsLoggedIn(true);
    const matched = members.find((m) => m.role === targetRole) || members[2];
    setCurrentUser({
      name: customName || (matched ? matched.name : "Kamrul Islam"),
      email: matched ? matched.email : "kamrul@greenview.com",
      phone: matched ? matched.phone : "01911889900",
      role: targetRole,
      room: customRoom || (matched ? matched.room : "Room 101"),
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleState("GUEST");
    setCurrentUser(null);
  };

  const addMember = async (newMember: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    roomNumber: string;
    institution: string;
    description?: string;
    avatarUrl?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
  }): Promise<boolean> => {
    try {
      // Also sync with backend API
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMember,
          tenantSlug: "green-view",
        }),
      });

      const memberItem: AppMember = {
        id: `mem-${Date.now()}`,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.role,
        room: `Room ${newMember.roomNumber}`,
        institution: newMember.institution || "Dhaka University",
        description: newMember.description || "Active mess resident",
        avatarUrl:
          newMember.avatarUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        emergencyContactName: newMember.emergencyContactName,
        emergencyContactPhone: newMember.emergencyContactPhone,
        emergencyContactRelation: newMember.emergencyContactRelation,
        status: "ACTIVE",
        joinedDate: new Date().toISOString().split("T")[0],
      };

      setMembers((prev) => [memberItem, ...prev]);
      showToast(
        locale === "bn"
          ? `মেম্বার ${newMember.name} সফলভাবে যুক্ত হয়েছে! ছবি ও ইমার্জেন্সি কন্টাক্ট সেভ করা হয়েছে।`
          : `Member ${newMember.name} added with photo and emergency contact!`,
        "success"
      );
      return true;
    } catch (e) {
      console.error("addMember error:", e);
      return false;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: UserRole): Promise<boolean> => {
    try {
      // Sync with backend API
      await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberId, role: newRole }),
      });

      // Update members state
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );

      // If updating the currently logged-in persona, update currentUser and active role
      const targetMember = members.find((m) => m.id === memberId);
      if (
        currentUser &&
        targetMember &&
        (currentUser.email === targetMember.email || currentUser.name === targetMember.name)
      ) {
        setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
        setRoleState(newRole);
      }

      showToast(
        locale === "bn"
          ? `${targetMember?.name || "সদস্য"}-এর মেসের পদবী/রোল পরিবর্তন করে "${newRole}" করা হয়েছে!`
          : `Role for ${targetMember?.name || "Member"} updated to ${newRole}!`,
        "success"
      );
      return true;
    } catch (err) {
      console.error("updateMemberRole error:", err);
      showToast(
        locale === "bn" ? "রোল আপডেট করতে সমস্যা হয়েছে" : "Failed to update role",
        "error"
      );
      return false;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("messmate_locale") as Locale | null;
      if (savedLocale === "en" || savedLocale === "bn") {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const t = getTranslation(locale);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        role,
        setRole,
        isLoggedIn,
        currentUser,
        loginAs,
        logout,
        members,
        alumni,
        addMember,
        updateMemberRole,
        t,
        themeColor,
        setThemeColor,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
