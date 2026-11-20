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
  ChevronLeft,
  Check,
  X,
  Palette,
  ExternalLink,
  Camera,
  Compass,
  Calendar,
  MapPin,
  Flame,
  Coffee,
  Sun,
  Moon,
  Info,
  Calculator,
  Lock,
  LogIn,
  KeyRound,
  Shield,
  Eye,
  Heart,
  Star,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Send,
  Zap,
} from "lucide-react";

// --- TYPES ---
interface GalleryItem {
  id: string;
  category: "MESS" | "EVENT" | "TOUR";
  title: string;
  titleBn: string;
  location: string;
  date: string;
  description: string;
  descriptionBn: string;
  image: string;
  tags: string[];
}

interface EventItem {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  time: string;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "COMPLETED";
  location: string;
  summary: string;
  summaryBn: string;
  menuOrItinerary: string[];
  image: string;
  participants: number;
}

export default function HomePage() {
  const { t, locale, role, setRole, showToast } = useApp();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [galleryFilter, setGalleryFilter] = useState<"ALL" | "MESS" | "EVENT" | "TOUR">("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string>("Room 102 - Bed B (Window Side)");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestInstitution, setGuestInstitution] = useState("");
  const [preferredMoveDate, setPreferredMoveDate] = useState("");

  // Login Modal
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Room Filter
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>("ALL");

  // Meal Menu Day Selector
  const [selectedMenuDay, setSelectedMenuDay] = useState<"TODAY" | "TOMORROW">("TODAY");

  // Interactive Budget Calculator States
  const [calcRent, setCalcRent] = useState<number>(3200);
  const [calcMealsPerDay, setCalcMealsPerDay] = useState<number>(2);
  const [calcMealRate, setCalcMealRate] = useState<number>(55);
  const calcEstimatedFoodCost = calcMealsPerDay * 30 * calcMealRate;
  const calcSharedUtility = 650; // Gas, Wi-Fi, Maid, Water, Waste
  const calcTotalBudget = calcRent + calcEstimatedFoodCost + calcSharedUtility;

  // --- DATA SOURCES ---

  // 1. Gallery Items (Mess Interior, Events, Tours)
  const galleryItems: GalleryItem[] = [
    // Mess Photos
    {
      id: "gal-1",
      category: "MESS",
      title: "Green View Residence Building",
      titleBn: "গ্রিন ভিউ মেস ভবন (ফার্মগেট)",
      location: "East Tejturi Bazar, Farmgate, Dhaka",
      date: "Permanent Facility",
      description: "6-story modern building with lift, 24/7 security guard, and CCTV coverage.",
      descriptionBn: "লিফট, সার্বক্ষণিক নিরাপত্তা গার্ড ও সিসিটিভি ক্যামেরা সমৃদ্ধ আধুনিক ৬ তলা ভবন।",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
      tags: ["Building", "Exterior", "Security"],
    },
    {
      id: "gal-2",
      category: "MESS",
      title: "Shared Double Bedroom with Study Desks",
      titleBn: "২-সিটের প্রশস্ত বেডরুম ও আলাদা পড়ার টেবিল",
      location: "Flat 4B, Room 102",
      date: "Freshly Renovated",
      description: "Ample daylight, cross ventilation, private storage wardrobes, and ergonomic study chairs.",
      descriptionBn: "প্রচুর আলো-বাতাস, আলাদা ওয়্যারড্রব এবং আরামদায়ক রিডিং টেবিল-চেয়ারের ব্যবস্থা।",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80",
      tags: ["Bedroom", "Study Desk", "Balcony"],
    },
    {
      id: "gal-3",
      category: "MESS",
      title: "Hygienic Modern Kitchen & Prep Station",
      titleBn: "স্বাস্থ্যসম্মত ও পরিষ্কার-পরিচ্ছন্ন মেস কিচেন",
      location: "Mess Kitchen Area",
      date: "Daily Sanitized",
      description: "Clean LPG cooking stoves, deep freezer for fresh fish & meat, and Kent RO drinking water filter.",
      descriptionBn: "এলপিজি গ্যাস চুলা, ডিপ ফ্রিজ এবং কেন্ট আরও পিউরিফাইড মিনারেল ওয়াটার ফিল্টার।",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
      tags: ["Kitchen", "Filter Water", "Hygiene"],
    },
    {
      id: "gal-4",
      category: "MESS",
      title: "Common Dining & Television Hall",
      titleBn: "সদস্যদের ডাইনিং স্পেস ও কমন রুম",
      location: "Center Hallway",
      date: "Active 24/7",
      description: "Spacious wooden dining tables accommodating 16 persons at a time with smart LED TV.",
      descriptionBn: "একসাথে ১৬ জনের বসে খাওয়ার উপযোগী কাঠের টেবিল ও খেলা দেখার জন্য স্মার্ট এলইডি টিভি।",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      tags: ["Dining Hall", "Community", "Smart TV"],
    },
    // Event Photos
    {
      id: "gal-5",
      category: "EVENT",
      title: "Annual Grand Kacchi Feast & Rezala Night",
      titleBn: "বার্ষিক গ্র্যান্ড মেস ভোজ (কাচ্চি বিরিয়ানি ও স্পেশাল রেজালা)",
      location: "Rooftop Dining Canopy",
      date: "Last Friday",
      description: "Traditional Dhaka style basmati mutton kacchi, chicken roast, borhani, and jorda cooked on-site.",
      descriptionBn: "মেসের ছাদে রাঁধুনির তৈরি ঐতিহ্যবাহী বাসমতী খাসির কাচ্চি, চিকেন রোস্ট, বোরহানি ও জর্দা উৎসব।",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80",
      tags: ["Grand Feast", "Kacchi Biryani", "Celebration"],
    },
    {
      id: "gal-6",
      category: "EVENT",
      title: "Ramadan Community Iftar Mahfil",
      titleBn: "পবিত্র মাহে রমজানের মেস ইফতার মাহফিল",
      location: "Main Dining Hall",
      date: "Ramadan Special",
      description: "Fresh dates, halim, peyaju, beguni, jilapi, and seasonal fruit sherbet shared with all members.",
      descriptionBn: "সকল মেস সদস্য ও প্রাক্তন বড় ভাইদের নিয়ে ঐতিহ্যবাহী শাহী হালিম ও বিশেষ ইফতারের আয়োজন।",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
      tags: ["Iftar", "Ramadan", "Brotherhood"],
    },
    {
      id: "gal-7",
      category: "EVENT",
      title: "Winter Badminton Championship",
      titleBn: "শীতকালীন মেস ব্যাডমিন্টন টুর্নামেন্ট",
      location: "Mess Rooftop Court",
      date: "Winter Series",
      description: "Exciting doubles tournament with floodlights, commentary, and champion trophy ceremony.",
      descriptionBn: "ছাদে ফ্লাডলাইটের আলোয় জমজমাট ব্যাডমিন্টন ডাবলস প্রতিযোগিতা ও চ্যাম্পিয়ন ট্রফি বিতরণ।",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
      tags: ["Badminton", "Sports", "Rooftop"],
    },
    {
      id: "gal-8",
      category: "EVENT",
      title: "Senior Farewell & Alumni Get-Together",
      titleBn: "গ্র্যাজুয়েট বড় ভাইদের বিদায় ও মিলনমেলা",
      location: "Conference Lounge",
      date: "Annual Event",
      description: "Heartwarming farewell banquet honoring members who completed their university degrees and landed jobs.",
      descriptionBn: "ডিগ্রি সম্পন্ন ও চাকরিতে যোগদানকারী সিনিয়র ভাইদের সম্মাননা স্মারক প্রদান ও নৈশভোজ।",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
      tags: ["Farewell", "Alumni", "Milad"],
    },
    // Tour Photos
    {
      id: "gal-9",
      category: "TOUR",
      title: "Sajek Valley Cloud Kingdom Tour",
      titleBn: "মেঘের দেশ সাজেক ভ্যালি বার্ষিক মেস ট্যুর",
      location: "Sajek, Rangamati",
      date: "January 2026",
      description: "3 days 2 nights adventurous trip with open hood Chander Gari, Konglak Para sunrise, and helipad BBQ night.",
      descriptionBn: "খোলা চাঁদের গাড়ির রোমাঞ্চ, কংলাক পাহাড়ে সূর্যাস্ত এবং হেলিপ্যাডে স্মরণীয় বারবিকিউ নাইট।",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
      tags: ["Sajek Valley", "Chander Gari", "Mountains"],
    },
    {
      id: "gal-10",
      category: "TOUR",
      title: "Cox's Bazar Beach & Inani Coral Trip",
      titleBn: "কক্সবাজার সমুদ্র সৈকত ও ইনানী প্রবাল দ্বীপ ভ্রমণ",
      location: "Cox's Bazar Sea Beach",
      date: "Post-Semester Tour",
      description: "World's longest sandy beach, sunset football, Marine Drive cruise, and fresh seafood barbecue.",
      descriptionBn: "মেরিন ড্রাইভ ড্রাইভ, লাবণী পয়েন্টে সূর্যাস্ত, ফুটবল ম্যাচ ও রূপচাঁদা ফ্রাই ফিস্ট।",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      tags: ["Cox's Bazar", "Beach", "Marine Drive"],
    },
    {
      id: "gal-11",
      category: "TOUR",
      title: "Sreemangal Tea Gardens & Lawachara Forest",
      titleBn: "শ্রীমঙ্গল সবুজ চা বাগান ও লাউয়াছড়া রেইনফরেস্ট",
      location: "Sreemangal, Sylhet",
      date: "Spring Vacation",
      description: "Cycling through lush emerald tea estates, 7-layer Nilkantha tea, and pristine Madhabpur Lake.",
      descriptionBn: "সবুজ চা বাগানে সাইক্লিং, মাধবপুর লেক ও নীলকণ্ঠের বিখ্যাত ৭ রঙের লেয়ার চা আস্বাদন।",
      image: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=900&q=80",
      tags: ["Sreemangal", "Tea Garden", "Nature"],
    },
    {
      id: "gal-12",
      category: "TOUR",
      title: "Bandarban Nilgiri & Nafakhum Expedition",
      titleBn: "বান্দরবান নীলগিরি ও নাফাখুম ট্র্যাকিং অভিযান",
      location: "Bandarban Hill Tracts",
      date: "Adventure Tour",
      description: "Trekking across crystal mountain rivers, staying above the clouds at Nilgiri, and local indigenous cuisine.",
      descriptionBn: "মেঘের ওপর নীলগিরি রিসোর্টে রাতযাপন, নাফাখুম জলপ্রপাত ট্র্যাকিং ও পাহাড়ি বাঁশ কোড়ল রান্না।",
      image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
      tags: ["Bandarban", "Nilgiri", "Trekking"],
    },
  ];

  const filteredGallery = galleryItems.filter((item) => {
    if (galleryFilter === "ALL") return true;
    return item.category === galleryFilter;
  });

  // 2. Events & Celebrations Data
  const eventList: EventItem[] = [
    {
      id: "ev-1",
      title: "Annual Grand Feast 2026",
      titleBn: "বার্ষিক গ্র্যান্ড মেস ভোজ ২০২৬",
      date: "Friday, 28 November 2026",
      time: "8:30 PM",
      status: "REGISTRATION_OPEN",
      location: "Green View Mess Rooftop Terrace",
      summary: "Traditional Shahi Kacchi Biryani cooked by seasoned Old Dhaka bawarchi with unlimited dessert.",
      summaryBn: "পুরান ঢাকার স্পেশাল বাবুর্চির হাতে তৈরি খাসির কাচ্চি বিরিয়ানি, চিকেন রোস্ট, ফিরনি ও কোল্ড ড্রিঙ্কস।",
      menuOrItinerary: ["Mutton Kacchi Biryani (বাসমতী খাসির কাচ্চি)", "Chicken Roast (স্পেশাল চিকেন রোস্ট)", "Shahi Borhani (টক-মিষ্টি বোরহানি)", "Zafrani Firni & Jorda (জাফরানি ফিরনি ও জর্দা)"],
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80",
      participants: 28,
    },
    {
      id: "ev-2",
      title: "Sajek Valley Winter Tour 2027",
      titleBn: "সাজেক ভ্যালি শীতকালীন মেস ট্যুর ২০২৭",
      date: "15 - 18 January 2027",
      time: "4 Days 3 Nights",
      status: "UPCOMING",
      location: "Sajek Valley, Rangamati & Khagrachhari",
      summary: "Complete group excursion covering Risang Waterfall, Alutila Cave, Konglak Para, and campfire BBQ.",
      summaryBn: "রিসাং ঝর্ণা, আলুটিলা গুহা ও কংলাক পাহাড় ট্র্যাকিং এবং হেলিপ্যাডে বারবিকিউ নাইট সহ সম্পূর্ণ মেস ট্যুর।",
      menuOrItinerary: ["Day 1: Dhaka to Khagrachhari & Chander Gari to Sajek", "Day 2: Sunrise at Konglak, Helipad sightseeing & Campfire BBQ", "Day 3: Risang Waterfall & Mysterious Alutila Cave", "Day 4: Traditional indigenous lunch & return to Dhaka"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
      participants: 18,
    },
    {
      id: "ev-3",
      title: "Inter-Flat Winter Badminton Cup",
      titleBn: "আন্তঃফ্ল্যাট শীতকালীন ব্যাডমিন্টন টুর্নামেন্ট",
      date: "12 - 14 December 2026",
      time: "Every Evening 7:00 PM",
      status: "UPCOMING",
      location: "Mess Rooftop Floodlit Court",
      summary: "Double elimination knockout tournament between Flat 4B and Flat 5A with attractive prizes.",
      summaryBn: "ফ্লাট ৪বি ও ফ্লাট ৫এ-এর সদস্যদের মাঝে ডাবলস নকআউট টুর্নামেন্ট এবং বিজয়ী দলের জন্য আকর্ষণীয় পুরস্কার।",
      menuOrItinerary: ["Opening Match & Toss", "Quarter-Finals & Semi-Finals", "Grand Finale & Prize Giving Ceremony", "Post-Match Special Chicken Khichuri Feast"],
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=700&q=80",
      participants: 16,
    },
  ];

  // 3. Room & Seat Data
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
      amenities: ["Attached Balcony", "100 Mbps Wi-Fi", "Separate Study Table", "Filter RO Water"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bed-101a",
      room: "Room 101",
      bed: "Bed A (Corner Bed)",
      type: "SHARED",
      monthlyRent: 3500,
      dailyRent: 300,
      status: "AVAILABLE",
      floor: 1,
      amenities: ["Large Wooden Wardrobe", "Ceiling Fan", "IPS Power Backup", "Mosquito Net Frame"],
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "room-201a",
      room: "Room 201",
      bed: "Master Suite (Single Occupancy)",
      type: "SINGLE",
      monthlyRent: 6500,
      dailyRent: 600,
      status: "RESERVED",
      floor: 2,
      amenities: ["Private Attached Bathroom", "South-Facing Balcony", "Air Cooler Space", "Executive Table"],
      image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredRooms = roomsData.filter((r) => {
    if (selectedRoomFilter === "ALL") return true;
    return r.type === selectedRoomFilter;
  });

  // 4. Live Notice Board Items
  const publicNotices = [
    {
      id: "n-1",
      priority: "URGENT",
      title: "Annual Grand Feast Contributions Due",
      titleBn: "বার্ষিক মেস ভোজের চাঁদা জমার শেষ তারিখ",
      date: "24 Nov 2026",
      tag: "Event & Food",
      content: "All members must deposit the special feast contribution of ৳450 to Manager Tanvir by Tuesday night for grocery reservations.",
      contentBn: "আগামী শুক্রবারের মেস ভোজের বাজার করার জন্য সকল সদস্যকে মঙ্গলবার রাত ১০টার মধ্যে ম্যানেজার তানভীরের নিকট ৪৫০ টাকা জমা দেওয়ার অনুরোধ করা হলো।",
    },
    {
      id: "n-2",
      priority: "NORMAL",
      title: "Rooftop Water Tank Cleaning & Chlorine Flush",
      titleBn: "ছাদের পানির ট্যাংক পরিষ্কার ও জীবানুনাশক স্প্রে",
      date: "26 Nov 2026",
      tag: "Maintenance",
      content: "Water supply will remain paused between 10:00 AM and 1:00 PM this Sunday for routine hygiene maintenance.",
      contentBn: "স্বাস্থ্য সুরক্ষায় আগামী রবিবার সকাল ১০টা থেকে দুপুর ১টা পর্যন্ত পানির ট্যাংক পরিষ্কারের কাজ চলবে। প্রয়োজনীয় পানি সংরক্ষণ করুন।",
    },
    {
      id: "n-3",
      priority: "NORMAL",
      title: "Monthly Mess Meeting & Bazar Schedule Rotation",
      titleBn: "মাসিক মেস মিটিং ও নতুন বাজারের রুটিন বণ্টন",
      date: "28 Nov 2026",
      tag: "Administration",
      content: "Monthly meeting will be held on Friday at 9:30 PM sharp to review the meal rate and assign December bazar duties.",
      contentBn: "ডিসেম্বর মাসের বাজারের শিডিউল নির্ধারণ ও চলতি মাসের হিসাব পর্যালোচনার জন্য শুক্রবার রাত ৯:৩০ এ ডাইনিং হলে সাধারণ মিটিং অনুষ্ঠিত হবে।",
    },
  ];

  // --- HANDLERS ---
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      showToast(locale === "bn" ? "দয়া করে আপনার নাম এবং ফোন নম্বর দিন" : "Please provide name and phone number", "error");
      return;
    }
    showToast(
      locale === "bn"
        ? `${selectedSeat} এর জন্য আপনার বুকিং/ভিজিট আবেদন গ্রহণ করা হয়েছে। ম্যানেজার শীঘ্রই কল করবেন!`
        : `Booking inquiry for ${selectedSeat} received! Manager will call you shortly.`,
      "success"
    );
    setBookingModalOpen(false);
    setGuestName("");
    setGuestPhone("");
    setGuestInstitution("");
  };

  const handleRoleQuickLogin = (selectedRole: UserRole, targetName: string) => {
    setRole(selectedRole);
    setLoginModalOpen(false);
    showToast(
      locale === "bn"
        ? `স্বাগতম ${targetName}! আপনি ${selectedRole} হিসেবে সফলভাবে পোর্টাল লগইন করেছেন।`
        : `Welcome ${targetName}! Logged into the portal as ${selectedRole}.`,
      "success"
    );
    if (selectedRole === "SUPER_ADMIN") {
      router.push("/super-admin");
    } else if (selectedRole === "OWNER" || selectedRole === "MEAL_MANAGER") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole("MEMBER");
    setLoginModalOpen(false);
    showToast(
      locale === "bn" ? "লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করছেন..." : "Login successful! Entering Member Dashboard...",
      "success"
    );
    router.push("/dashboard");
  };

  return (
    <div className="space-y-20 pb-24 text-slate-800 bg-slate-50/50">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: Professional, Modern, Trustworthy Mess Portal */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 border-b border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === "bn" ? "গ্রিন ভিউ স্টুডেন্ট মেস • ফার্মগেট, ঢাকা" : "Green View Student Mess • Farmgate, Dhaka"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  {locale === "bn" ? "২টি সিট খালি আছে (ডিসেম্বর সেশন)" : "2 Vacant Seats Open for Next Month"}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18] text-white">
                {locale === "bn" ? (
                  <>
                    ফার্মগেটে আধুনিক, স্বাস্থ্যসম্মত ও <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">সম্পূর্ণ ডিজিটাল</span> ছাত্র মেস
                  </>
                ) : (
                  <>
                    Modern, Hygienic &amp; <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Fully Digital</span> Student Mess in Dhaka
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {locale === "bn"
                  ? "টাটকা দেশি খাবারের ৩ বেলা ব্যবস্থা, ১০০ এমবিপিএস নিরবচ্ছিন্ন ওয়াইফাই, জেনারেটর ব্যাকআপ, নিরাপদ পানির ফিল্টার এবং অনলাইন স্বচ্ছ মিল ও বাজার হিসাবের সেরা ঠিকানা।"
                  : "Enjoy 3 hygienic home-cooked meals daily, 100 Mbps fiber Wi-Fi, generator backup, filtered RO drinking water, and 100% transparent automated meal & bazar accounting."}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                {/* Member Portal Login Modal Trigger */}
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{locale === "bn" ? "মেম্বার পোর্টাল লগইন" : "Member Portal Login"}</span>
                </button>

                {/* View Gallery Link */}
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 backdrop-blur transition active:scale-95"
                >
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>{locale === "bn" ? "মেসের ছবি ও ট্যুর গ্যালারি" : "Mess & Tour Gallery"}</span>
                </a>

                {/* Check Available Beds */}
                <a
                  href="#rooms"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 font-semibold text-xs border border-emerald-700/60 transition"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{locale === "bn" ? "খালি সিট দেখুন" : "View Vacant Beds"}</span>
                </a>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
                <div className="text-left">
                  <div className="text-xl font-bold text-white flex items-center gap-1">
                    <span>4.9</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">38+ Google Reviews</div>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-emerald-400">৳ 54.50</div>
                  <div className="text-[11px] text-slate-400">Avg. Meal Rate</div>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-sky-400">100 Mbps</div>
                  <div className="text-[11px] text-slate-400">Dedicated Fiber Net</div>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-purple-400">100%</div>
                  <div className="text-[11px] text-slate-400">Zero-Hidden Cost</div>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Website Highlights & Live Snapshot */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Green View Student Mess</h3>
                      <p className="text-xs text-slate-400">Flat 4B &amp; 5A • 24 Residents</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    OPEN ADMISSION
                  </span>
                </div>

                {/* Today's Special Dish highlight */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80"
                      alt="Special Dish"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                      {locale === "bn" ? "আজকের বিশেষ খাবার" : "Today's Dinner Special"}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {locale === "bn" ? "দেশি মুরগির ঝোল ও আলুর দম" : "Desi Chicken Curry & Aloo Dum"}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {locale === "bn" ? "রাত ৯:৩০ টায় ডাইনিং শুরু" : "Dinner served from 9:30 PM"}
                    </p>
                  </div>
                </div>

                {/* Quick Interactive Info Blocks */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] mb-1">
                      {locale === "bn" ? "রুমের ধরন" : "Room Categories"}
                    </span>
                    <span className="font-bold text-slate-200">২-সিট ও সিঙ্গেল রুম</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">সংযুক্ত বারান্দাসহ</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px] mb-1">
                      {locale === "bn" ? "মাসিক সিট ভাড়া" : "Monthly Seat Rent"}
                    </span>
                    <span className="font-bold text-emerald-400">৳ ৩,২০০ - ৳ ৬,৫০০</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">সব সার্ভিস চার্জ সহ</span>
                  </div>
                </div>

                {/* Quick Schedule Visit CTA */}
                <button
                  onClick={() => {
                    setSelectedSeat("General Mess Visit & Seat Inspection");
                    setBookingModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-600"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{locale === "bn" ? "মেস সরাসরি পরিদর্শন বা সিট বুকিং করুন" : "Schedule a Visit or Book a Bed"}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TODAY'S LIVE MEAL MENU & TIMETABLE (Interactive) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-1">
                <Utensils className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "দৈনিক মেস খাবার রুটিন" : "Daily Dining Timetable"}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {locale === "bn" ? "আজকের ফ্রেশ হোম-কুকড মিল মেনু" : "Today's Home-Cooked Meal Menu"}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
              <button
                onClick={() => setSelectedMenuDay("TODAY")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMenuDay === "TODAY" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
                }`}
              >
                {locale === "bn" ? "আজকের মেনু" : "Today's Menu"}
              </button>
              <button
                onClick={() => setSelectedMenuDay("TOMORROW")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedMenuDay === "TOMORROW" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"
                }`}
              >
                {locale === "bn" ? "আগামীকালের মেনু" : "Tomorrow's Menu"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                  <Coffee className="w-3.5 h-3.5" />
                  {locale === "bn" ? "সকালের নাস্তা (৭:৩০ - ৯:০০ AM)" : "Breakfast (7:30 - 9:00 AM)"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Cut-off: 10 PM Prev</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {selectedMenuDay === "TODAY"
                  ? locale === "bn"
                    ? "ডিম খিচুড়ি ও আচার / পরোটা ডাল"
                    : "Egg Khichuri with Pickle / Paratha Dal"
                  : locale === "bn"
                  ? "গরম পরোটা, ডিম পোচ ও স্পেশাল বুটের ডাল"
                  : "Hot Paratha, Fried Egg & Gram Dal"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "bn"
                  ? "টাটকা সরিষার তেলে ভাজা ডিম এবং খাঁটি গাওয়া ঘিয়ে রান্না খিচুড়ি।"
                  : "Freshly prepared with pure mustard oil and hygienic spice mix."}
              </p>
            </div>

            {/* Lunch */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg">
                  <Sun className="w-3.5 h-3.5" />
                  {locale === "bn" ? "দুপুরের খাবার (১:৩০ - ৩:০০ PM)" : "Lunch (1:30 - 3:00 PM)"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Cut-off: 8:00 AM</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {selectedMenuDay === "TODAY"
                  ? locale === "bn"
                    ? "রুই মাছ ভুনা, আলু-পটোল ভাজি, ঘন ডাল ও ভাত"
                    : "Rui Fish Curry, Vegetable Fry, Thick Dal & Steamed Rice"
                  : locale === "bn"
                  ? "ব্রয়লার মুরগির ঝোল, পেঁপে ভাজি, মসুর ডাল ও লেবু"
                  : "Chicken Gravy, Papaya Fry, Red Lentil Dal & Lemon"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "bn"
                  ? "প্রতিদিন কাওরান বাজার থেকে আনা ফ্রেশ মাছ ও টাটকা শাকসবজি।"
                  : "Locally sourced fresh fish from Kawran Bazar, unlimited rice and dal."}
              </p>
            </div>

            {/* Dinner */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-lg">
                  <Moon className="w-3.5 h-3.5" />
                  {locale === "bn" ? "রাতের খাবার (৯:৩০ - ১১:০০ PM)" : "Dinner (9:30 - 11:00 PM)"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Cut-off: 4:00 PM</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {selectedMenuDay === "TODAY"
                  ? locale === "bn"
                    ? "দেশি মুরগির মাংসের ঝোল, লাউ শাক ও সালাদ"
                    : "Desi Chicken Curry, Bottle Gourd Greens & Salad"
                  : locale === "bn"
                  ? "ডিম কারি, বেগুন ভর্তা, পাতলা ডাল ও গরম ভাত"
                  : "Egg Curry, Mashed Eggplant (Bhorta) & Dal"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "bn"
                  ? "রাতের খাবার গরম গরম পরিবেশন করা হয়। দেরি হলে খাবার আলাদা বক্সে রাখা হয়।"
                  : "Served hot in the dining room. Late-night study boxes available upon request."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. VISUAL SHOWCASE & PHOTO GALLERY (Mass er pic, Events, Tours) */}
      {/* ============================================================== */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "ছবি ও স্মরণীয় মুহূর্তসমূহ" : "Photo Gallery & Memories"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {locale === "bn" ? "মেসের পরিবেশ, বার্ষিক আয়োজন ও ট্যুর স্মৃতি" : "Mess Lifestyle, Events & Annual Tour Memories"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
              {locale === "bn"
                ? "আমাদের মেস শুধুমাত্র থাকার জায়গা নয়, বরং ভ্রাতৃত্ব ও পারিবারিক বন্ধনের সুন্দর এক ঠিকানা।"
                : "Explore real snapshots of our living spaces, grand annual feasts, and exciting student travel tours."}
            </p>
          </div>

          {/* Interactive Gallery Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start">
            {[
              { id: "ALL", label: locale === "bn" ? "সব ছবি (১২)" : "All (12)" },
              { id: "MESS", label: locale === "bn" ? "মেস ও রুম (৪)" : "Mess & Rooms (4)" },
              { id: "EVENT", label: locale === "bn" ? "ইভেন্ট ও ভোজ (৪)" : "Events & Feasts (4)" },
              { id: "TOUR", label: locale === "bn" ? "বার্ষিক ট্যুর (৪)" : "Tours & Trips (4)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setGalleryFilter(cat.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  galleryFilter === cat.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Photo Box */}
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-md shadow-xs ${
                      item.category === "TOUR"
                        ? "bg-sky-600 text-white"
                        : item.category === "EVENT"
                        ? "bg-amber-600 text-white"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {item.category === "TOUR"
                      ? locale === "bn"
                        ? "ট্যুর"
                        : "Tour"
                      : item.category === "EVENT"
                      ? locale === "bn"
                        ? "ইভেন্ট"
                        : "Event"
                      : locale === "bn"
                      ? "মেস"
                      : "Mess"}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1.5 rounded-full bg-slate-900/80 text-white backdrop-blur flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Location Bar */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent text-white text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium truncate">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="text-[10px] text-slate-300 shrink-0">{item.date}</span>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition line-clamp-1">
                    {locale === "bn" ? item.titleBn : item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {locale === "bn" ? item.descriptionBn : item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DEDICATED EVENTS & TOURS HIGHLIGHT SECTION */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "আসন্ন বার্ষিক ইভেন্ট ও ট্যুর" : "Upcoming Events & Mess Tours"}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {locale === "bn" ? "মেসের যৌথ আনন্দ ও ভ্রাতৃত্বের উৎসব" : "Community Gatherings & Annual Travel Tours"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">
                {locale === "bn" ? "মেস সদস্যরা সরাসরি রেজিস্ট্রেশন করতে পারবেন" : "Registered members can join from portal"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventList.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/80 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40">
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow">
                      {ev.status === "REGISTRATION_OPEN"
                        ? locale === "bn"
                          ? "রেজিস্ট্রেশন চলছে"
                          : "Registration Open"
                        : locale === "bn"
                        ? "আসন্ন"
                        : "Upcoming"}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/80 text-[11px] font-bold text-white backdrop-blur">
                    {ev.date}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{locale === "bn" ? ev.titleBn : ev.title}</h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      {locale === "bn" ? ev.summaryBn : ev.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ev.participants} Members Confirmed</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEventModal(ev)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    <span>{locale === "bn" ? "বিস্তারিত শিডিউল ও মেনু দেখুন" : "View Itinerary & Menu"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE ROOMS & BED ACCOMMODATION SHOWCASE */}
      {/* ============================================================== */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              {locale === "bn" ? "সিট ও রুম বুকিং" : "Accommodations & Beds"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {locale === "bn" ? "খালি সিটের বিবরণ ও মাসিক ভাড়া" : "Available Rooms & Seat Listings"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {locale === "bn"
                ? "আমাদের প্রতিটি রুমে পড়ার উপযোগী নিরিবিলি পরিবেশ, উচ্চগতির ইন্টারনেট এবং আলো-বাতাস নিশ্চিত করা হয়েছে।"
                : "Comfortable shared beds and private rooms designed for focused study and relaxed bachelor living."}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start">
            {[
              { id: "ALL", label: locale === "bn" ? "সকল রুম" : "All Rooms" },
              { id: "SHARED", label: locale === "bn" ? "শেয়ার্ড সিট" : "Shared Beds" },
              { id: "SINGLE", label: locale === "bn" ? "সিঙ্গেল মাস্টার রুম" : "Single Suites" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedRoomFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedRoomFilter === f.id
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
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
                    {room.status === "AVAILABLE"
                      ? locale === "bn"
                        ? "খালি আছে"
                        : "AVAILABLE"
                      : room.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-extrabold text-slate-900">৳ {room.monthlyRent}</span>
                    <span className="text-xs text-slate-500 font-medium">{locale === "bn" ? "/ মাস" : "/ month"}</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-3">
                    {locale === "bn" ? "দৈনিক গেস্ট ভাড়া:" : "Daily Guest Stay:"}{" "}
                    <span className="font-semibold text-slate-800">৳ {room.dailyRent} / day</span>
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
                      <span>{locale === "bn" ? "সিট বুকিং / ভিজিট করুন" : "Book Bed / Visit"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>{locale === "bn" ? "সিট পূর্ণ" : "Seat Occupied"}</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. DYNAMIC MONTHLY MESS BUDGET CALCULATOR (Interactive Tool) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description & Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-2">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{locale === "bn" ? "মাসিক খরচ ক্যালকুলেটর" : "Interactive Expense Estimator"}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {locale === "bn" ? "আপনার মাসিক মেস খরচের আগাম হিসেব" : "Calculate Your Expected Monthly Mess Budget"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {locale === "bn"
                    ? "স্লাইডার পরিবর্তন করে দেখুন সিট ভাড়া, মিল ও ইউটিলিটি মিলিয়ে আপনার মাসে মোট কত খরচ হতে পারে।"
                    : "Adjust the sliders below to estimate your exact monthly expenses including rent, food, and utilities."}
                </p>
              </div>

              {/* Slider 1: Room Rent */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{locale === "bn" ? "রুম / সিট ভাড়া:" : "Room / Bed Rent:"}</span>
                  <span className="text-indigo-600">৳ {calcRent} / month</span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="6500"
                  step="100"
                  value={calcRent}
                  onChange={(e) => setCalcRent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>৳ 2,500 (Shared)</span>
                  <span>৳ 6,500 (Single Master)</span>
                </div>
              </div>

              {/* Slider 2: Daily Meals */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{locale === "bn" ? "প্রতিদিন গড় মিল সংখ্যা:" : "Average Daily Meals:"}</span>
                  <span className="text-indigo-600">{calcMealsPerDay} Meals / Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={calcMealsPerDay}
                  onChange={(e) => setCalcMealsPerDay(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Meal (Dinner only)</span>
                  <span>2 Meals (Lunch + Dinner)</span>
                  <span>3 Meals (All meals)</span>
                </div>
              </div>

              {/* Slider 3: Meal Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{locale === "bn" ? "প্রত্যাশিত মিল রেট:" : "Expected Meal Rate:"}</span>
                  <span className="text-indigo-600">৳ {calcMealRate} / meal</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="75"
                  step="1"
                  value={calcMealRate}
                  onChange={(e) => setCalcMealRate(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>৳ 45 (Economic)</span>
                  <span>৳ 55 (Standard Average)</span>
                  <span>৳ 75 (Special Feast Heavy)</span>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-indigo-100 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {locale === "bn" ? "আনুমানিক মাসিক খরচ বিবরণী" : "Estimated Monthly Breakdown"}
              </span>

              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>{locale === "bn" ? "সিট ভাড়া" : "Bed / Room Rent"}</span>
                  <span className="font-bold text-slate-800">৳ {calcRent}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {locale === "bn"
                      ? `খাবার খরচ (${calcMealsPerDay * 30} মিল × ৳${calcMealRate})`
                      : `Food Cost (${calcMealsPerDay * 30} meals × ৳${calcMealRate})`}
                  </span>
                  <span className="font-bold text-slate-800">৳ {calcEstimatedFoodCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "bn" ? "ইউটিলিটি ও সার্ভিস (গ্যাস, ওয়াইফাই, বুয়া)" : "Shared Utilities (Gas, Net, Maid)"}</span>
                  <span className="font-bold text-slate-800">৳ {calcSharedUtility}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-bold text-slate-900">
                  {locale === "bn" ? "মোট আনুমানিক খরচ:" : "Total Monthly Budget:"}
                </span>
                <span className="text-3xl font-extrabold text-indigo-600">৳ {calcTotalBudget.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {locale === "bn"
                  ? "*মিল বন্ধ রাখলে স্বয়ংক্রিয়ভাবে মিলের টাকা মাইনাস হবে। কোনো লুকানো চার্জ নেই।"
                  : "*Meal cost automatically reduces whenever you toggle meals OFF. Zero hidden charges."}
              </p>

              <button
                onClick={() => {
                  setSelectedSeat(`Estimated Plan: ৳${calcTotalBudget}/mo`);
                  setBookingModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
              >
                {locale === "bn" ? "এই বাজেটে সিট বুক করতে আবেদন করুন" : "Apply for Bed at this Budget"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. NOTICE BOARD & ANNOUNCEMENTS (Notice) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold mb-1">
                <BadgeAlert className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "মেস নোটিশ বোর্ড" : "Mess Notice Board"}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {locale === "bn" ? "জরুরি ঘোষণা ও মেসের হালনাগাদ তথ্য" : "Official Announcements & Directives"}
              </h2>
            </div>
            <Link
              href="/notices"
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-center"
            >
              <span>{locale === "bn" ? "সকল নোটিশ আর্কাইভ দেখুন" : "View Full Notice Archive"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publicNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNoticeModal(n)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  n.priority === "URGENT"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      n.priority === "URGENT" ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-slate-500">{n.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  {locale === "bn" ? n.titleBn : n.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {locale === "bn" ? n.contentBn : n.content}
                </p>
                <span className="text-[11px] text-indigo-600 font-semibold mt-3 inline-block">
                  {locale === "bn" ? "সম্পূর্ণ পড়ুন →" : "Read details →"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. RESIDENT REVIEWS & TESTIMONIALS */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {locale === "bn" ? "সদস্যদের অভিজ্ঞতা" : "Resident Voices"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {locale === "bn" ? "মেসের বর্তমান ও প্রাক্তন সদস্যদের মতামত" : "What Our Residents Say About MessMate"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;৩ বছর ধরে গ্রিন ভিউ মেসে আছি। প্রতি মাসের বাজারের হিসাব ও মিল রেট স্বচ্ছভাবে পোর্টাল থেকে দেখা যায়। কখনো কোনো গরমিল বা ভুল বোঝাবুঝি হয়নি!&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 text-xs block">ফাহিম হোসেন</span>
              <span className="text-[10px] text-slate-500">মাস্টার্স শিক্ষার্থী, ঢাকা বিশ্ববিদ্যালয়</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;অফিসের কাজে প্রায়ই হঠাৎ বাইরে খেতে হয়। মেসে আসার পর থেকে ১ ক্লিকে মোবাইল থেকে মিল বন্ধ করতে পারি, আমার খাবারের টাকা পুরোপুরি বেঁচে যায়!&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 text-xs block">তানজিল আহমেদ</span>
              <span className="text-[10px] text-slate-500">সফটওয়্যার ইঞ্জিনিয়ার, কারওয়ান বাজার</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;গত বছর সাজেক ভ্যালির মেস ট্যুরটা ছিল জীবনের সেরা অভিজ্ঞতা। এখানে পড়াশোনার পরিবেশ যেমন শান্ত, মেসের সদস্যদের মাঝে আন্তরিকতাও তেমনই চমৎকার।&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 text-xs block">কামরুল ইসলাম</span>
              <span className="text-[10px] text-slate-500">সিএসই শিক্ষার্থী ও রুম ১০২ এর বাসিন্দা</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. EMERGENCY QUICK-ACCESS FOOTER BANNER */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {locale === "bn" ? "২৪/৭ জরুরি নিরাপত্তা ও যোগাযোগ নম্বর" : "24/7 Verified Emergency Directory"}
              </h3>
              <p className="text-xs text-rose-200">
                {locale === "bn"
                  ? "জাতীয় জরুরি সেবা ৯৯৯, ফায়ার সার্ভিস, তেজগাঁও থানা ও মেস ওনারের সরাসরি হটলাইন।"
                  : "Direct hotline for Police, Fire Brigade, Tejgaon Thana, and Mess Landlord."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:999"
              className="px-4 py-2.5 rounded-xl bg-white text-rose-900 font-bold text-xs shadow-md hover:bg-rose-100 transition"
            >
              Emergency 999
            </a>
            <Link
              href="/emergency"
              className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs border border-rose-700 transition"
            >
              {locale === "bn" ? "সম্পূর্ণ ডায়রেক্টরি" : "All Contacts"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL 1: FULLSCREEN PHOTO LIGHTBOX (Gallery Zoom) */}
      {/* ============================================================== */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                  {filteredGallery[activeLightboxIndex].category} • {filteredGallery[activeLightboxIndex].location}
                </span>
                <h3 className="text-base font-bold text-white">
                  {locale === "bn"
                    ? filteredGallery[activeLightboxIndex].titleBn
                    : filteredGallery[activeLightboxIndex].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[500px] overflow-hidden">
              <img
                src={filteredGallery[activeLightboxIndex].image}
                alt={filteredGallery[activeLightboxIndex].title}
                className="w-full h-full object-contain"
              />

              {/* Prev Button */}
              {activeLightboxIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex(activeLightboxIndex - 1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {activeLightboxIndex < filteredGallery.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex(activeLightboxIndex + 1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Footer Story / Details */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1 text-xs">
                <p className="text-slate-300">
                  {locale === "bn"
                    ? filteredGallery[activeLightboxIndex].descriptionBn
                    : filteredGallery[activeLightboxIndex].description}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Date: {filteredGallery[activeLightboxIndex].date}
                </span>
              </div>
              <div className="flex gap-2">
                {filteredGallery[activeLightboxIndex].tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EVENT ITINERARY & MENU DETAILS */}
      {/* ============================================================== */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-4">
            <div className="relative h-44">
              <img
                src={selectedEventModal.image}
                alt={selectedEventModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-xs font-bold backdrop-blur">
                {selectedEventModal.date}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-indigo-600 block">
                  {selectedEventModal.location}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {locale === "bn" ? selectedEventModal.titleBn : selectedEventModal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {locale === "bn" ? selectedEventModal.summaryBn : selectedEventModal.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  {locale === "bn" ? "ইভেন্টের বিস্তারিত সূচি / মেনু:" : "Highlights & Itinerary:"}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedEventModal.menuOrItinerary.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  {locale === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventModal(null);
                    setLoginModalOpen(true);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
                >
                  {locale === "bn" ? "লগইন করে অংশ নিন" : "Join via Portal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: NOTICE DETAIL MODAL */}
      {/* ============================================================== */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedNoticeModal.tag} • {selectedNoticeModal.date}
              </span>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {locale === "bn" ? selectedNoticeModal.titleBn : selectedNoticeModal.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {locale === "bn" ? selectedNoticeModal.contentBn : selectedNoticeModal.content}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                {locale === "bn" ? "ঠিক আছে" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: INTERACTIVE SEAT BOOKING & VISIT INQUIRY */}
      {/* ============================================================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {locale === "bn" ? "মেস সিট বুকিং বা সরাসরি ভিজিট আবেদন" : "Schedule a Visit / Book Seat"}
                </h3>
                <span className="text-[11px] text-slate-500">Green View Student Mess • Farmgate</span>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {locale === "bn" ? "পছন্দের সিট বা রুম:" : "Selected Accommodation:"}
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedSeat}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {locale === "bn" ? "আপনার পুরো নাম:" : "Your Full Name:"}
                </label>
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
                <label className="block text-slate-600 font-semibold mb-1">
                  {locale === "bn" ? "মোবাইল নম্বর:" : "Mobile Number:"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01712345678"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {locale === "bn" ? "প্রতিষ্ঠান / কর্মস্থল:" : "University / Office:"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka University / Software Engineer"
                  value={guestInstitution}
                  onChange={(e) => setGuestInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-[11px] space-y-1">
                <span className="font-bold">{locale === "bn" ? "পরবর্তী ধাপ:" : "Next Steps:"}</span>
                <p>
                  {locale === "bn"
                    ? "আবেদনটি সরাসরি মেস ম্যানেজারের নিকট পৌঁছাবে। তিনি দ্রুত কল করে রুম পরিদর্শনের সময় নির্ধারণ করবেন।"
                    : "The mess manager will verify seat availability and call you to arrange an in-person room visit."}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  {locale === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  {locale === "bn" ? "আবেদন পাঠান" : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: MEMBER PORTAL LOGIN (With 1-Click Role Switcher Demo) */}
      {/* ============================================================== */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Top Header */}
            <div className="p-6 bg-gradient-to-tr from-slate-900 to-indigo-950 text-white relative">
              <button
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {locale === "bn" ? "মেসমেট মেম্বার পোর্টাল" : "MessMate Member Portal"}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {locale === "bn" ? "মিলের হিসাব, বাজার ও ড্যাশবোর্ডে প্রবেশ" : "Access meals, ledger, bills & operations"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* 1-Click Role Simulator Section */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {locale === "bn" ? "দ্রুত ১-ক্লিকে লগইন ডেমো (যেকোনো রোলে ঢুকুন):" : "Instant 1-Click Login (Select Persona):"}
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button
                    onClick={() => handleRoleQuickLogin("MEMBER", "Kamrul Islam")}
                    className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 flex items-center justify-between text-left transition"
                  >
                    <div>
                      <span className="font-bold text-indigo-900 block">Kamrul Islam (Resident Member)</span>
                      <span className="text-[11px] text-indigo-600">Toggle meals ON/OFF, view balance & bills</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleRoleQuickLogin("MEAL_MANAGER", "Tanvir Hasan")}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 flex items-center justify-between text-left transition"
                  >
                    <div>
                      <span className="font-bold text-amber-900 block">Tanvir Hasan (Meal Manager)</span>
                      <span className="text-[11px] text-amber-700">Enter daily bazar, verify meals, set cutoff</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleRoleQuickLogin("OWNER", "Rahim Ahmed")}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 flex items-center justify-between text-left transition"
                  >
                    <div>
                      <span className="font-bold text-emerald-900 block">Rahim Ahmed (Mess Admin / Owner)</span>
                      <span className="text-[11px] text-emerald-700">Monthly closing, rent billing, room management</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleRoleQuickLogin("SUPER_ADMIN", "Platform Super Admin")}
                    className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 flex items-center justify-between text-left transition"
                  >
                    <div>
                      <span className="font-bold text-purple-900 block">Platform Super Admin</span>
                      <span className="text-[11px] text-purple-700">SaaS multi-tenant control & tenant analytics</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-500 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Standard Password Login Form Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[11px] text-slate-400 font-medium absolute">or phone login</span>
              </div>

              <form onSubmit={handleStandardLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mobile / Email</label>
                  <input
                    type="text"
                    defaultValue="01712345678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{locale === "bn" ? "পোর্টাল লগইন করুন" : "Sign In to Member Portal"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
