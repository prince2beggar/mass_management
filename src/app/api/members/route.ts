import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initial alumni / ex-members who stayed at the mess
const initialAlumni = [
  {
    id: "alumni-1",
    name: "Fahim Hossain (ফাহিম হোসেন)",
    phone: "+8801712001122",
    email: "fahim.alumni@greenview.com",
    role: "EX_MEMBER",
    room: "Room 101 (Alumni 2020-2023)",
    institution: "Dhaka University (CSE)",
    status: "EX_MEMBER",
    joinedDate: "2020-01-10",
    leftDate: "2023-12-31",
    achievement: "Now Software Engineer at Brain Station 23",
    achievementBn: "বর্তমানে ব্রেন স্টেশন ২৩-এ সফটওয়্যার ইঞ্জিনিয়ার",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "alumni-2",
    name: "Engr. Ariful Islam (প্রকৌ. আরিফুল ইসলাম)",
    phone: "+8801819002233",
    email: "ariful.alumni@greenview.com",
    role: "EX_MEMBER",
    room: "Room 201 (Alumni 2019-2024)",
    institution: "BUET (EEE)",
    status: "EX_MEMBER",
    joinedDate: "2019-03-01",
    leftDate: "2024-04-15",
    achievement: "Assistant Engineer at PGCB (Power Grid Company)",
    achievementBn: "সহকারী প্রকৌশলী, পাওয়ার গ্রিড কোম্পানি অব বাংলাদেশ (PGCB)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "alumni-3",
    name: "Dr. Nazmul Huda (ডা. নাজমুল হুদা)",
    phone: "+8801912003344",
    email: "nazmul.alumni@greenview.com",
    role: "EX_MEMBER",
    room: "Room 102 (Alumni 2018-2023)",
    institution: "Dhaka Medical College (MBBS)",
    status: "EX_MEMBER",
    joinedDate: "2018-05-12",
    leftDate: "2023-06-30",
    achievement: "Medical Officer at BSMMU Hospital",
    achievementBn: "চিকিৎসক ও মেডিকেল অফিসার, বিএসএমএমইউ",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "green-view";

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        memberships: {
          include: {
            user: true,
            allocations: {
              where: { status: "ACTIVE" },
              include: {
                bed: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const activeMembers = tenant.memberships.map((m) => {
      const activeBed = m.allocations[0]?.bed;
      const roomDesc = activeBed
        ? `Room ${activeBed.room.roomNumber} (${activeBed.bedNumber})`
        : "Room Assigned";

      return {
        id: m.id,
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        phone: m.user.phone || "017XXXXXXXX",
        role: m.role,
        status: m.status,
        joinedDate: m.joinedAt.toISOString().split("T")[0],
        room: roomDesc,
        institution:
          m.role === "OWNER"
            ? "Mess Landlord / Flat Owner"
            : m.role === "MEAL_MANAGER"
            ? "Dhaka University (Accounting)"
            : "Dhaka University / Student",
      };
    });

    return NextResponse.json({
      activeMembers,
      alumni: initialAlumni,
      totalCount: activeMembers.length + initialAlumni.length,
    });
  } catch (error: any) {
    console.error("GET /api/members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role = "MEMBER", tenantSlug = "green-view", roomNumber, institution } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Upsert or create user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        phone: phone || null,
      },
      create: {
        name,
        email,
        phone: phone || null,
        passwordHash: "demo123",
      },
    });

    // Create membership
    const membership = await prisma.membership.upsert({
      where: {
        userId_tenantId: {
          userId: user.id,
          tenantId: tenant.id,
        },
      },
      update: {
        role,
        status: "ACTIVE",
      },
      create: {
        userId: user.id,
        tenantId: tenant.id,
        role,
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Member ${name} added successfully!`,
      member: {
        id: membership.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: membership.role,
        status: membership.status,
        room: roomNumber ? `Room ${roomNumber}` : "Room Pending",
        institution: institution || "Dhaka University",
      },
    });
  } catch (error: any) {
    console.error("POST /api/members error:", error);
    return NextResponse.json({ error: error.message || "Failed to create member" }, { status: 500 });
  }
}
