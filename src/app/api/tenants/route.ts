import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const tenant = await db.tenant.findUnique({
        where: { slug },
        include: {
          mealConfig: true,
          rooms: {
            include: { beds: true },
          },
          memberships: {
            include: { user: true },
          },
        },
      });
      if (!tenant) {
        return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
      }
      return NextResponse.json({ tenant });
    }

    const tenants = await db.tenant.findMany({
      include: {
        _count: {
          select: { memberships: true, rooms: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tenants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, messType, address, phone, email } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const tenant = await db.tenant.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        messType: messType || "STUDENT",
        address,
        phone,
        email,
        mealConfig: {
          create: {
            breakfastEnabled: true,
            lunchEnabled: true,
            dinnerEnabled: true,
            cutoffBreakfastHour: 22,
            cutoffLunchHour: 8,
            cutoffDinnerHour: 16,
            fixedBreakfastCost: 35,
            fixedLunchCost: 65,
            fixedDinnerCost: 65,
            guestMealRate: 85,
          },
        },
      },
    });

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
