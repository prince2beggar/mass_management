import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "green-view";
    const date = searchParams.get("date") || "2026-11-20";

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const members = await db.membership.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      include: {
        user: true,
        allocations: {
          where: { status: "ACTIVE" },
          include: { bed: { include: { room: true } } },
        },
        mealEntries: {
          where: { date },
        },
      },
    });

    const mealConfig = await db.mealConfiguration.findUnique({
      where: { tenantId: tenant.id },
    });

    const bazarTotal = await db.bazarEntry.aggregate({
      where: { tenantId: tenant.id },
      _sum: { totalAmount: true },
    });

    const allMeals = await db.mealEntry.findMany({
      where: { tenantId: tenant.id },
    });

    const totalMealsConsumed = allMeals.reduce(
      (sum, m) =>
        sum +
        (m.breakfast > 0 ? 0.5 : 0) +
        m.lunch +
        m.dinner +
        (m.guestBreakfast > 0 ? 0.5 : 0) +
        m.guestLunch +
        m.guestDinner,
      0
    );

    const totalBazarAmount = bazarTotal._sum.totalAmount || 0;
    const calculatedMealRate =
      totalMealsConsumed > 0
        ? Number((totalBazarAmount / totalMealsConsumed).toFixed(2))
        : 50.0;

    return NextResponse.json({
      date,
      members,
      mealConfig,
      stats: {
        totalBazarAmount,
        totalMealsConsumed,
        calculatedMealRate,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantSlug, membershipId, date, breakfast, lunch, dinner, guestLunch, guestDinner, isOff } = body;

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug || "green-view" },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const entry = await db.mealEntry.upsert({
      where: {
        tenantId_membershipId_date: {
          tenantId: tenant.id,
          membershipId,
          date: date || "2026-11-20",
        },
      },
      update: {
        breakfast: breakfast !== undefined ? breakfast : undefined,
        lunch: lunch !== undefined ? lunch : undefined,
        dinner: dinner !== undefined ? dinner : undefined,
        guestLunch: guestLunch !== undefined ? guestLunch : undefined,
        guestDinner: guestDinner !== undefined ? guestDinner : undefined,
        isOff: isOff !== undefined ? isOff : undefined,
      },
      create: {
        tenantId: tenant.id,
        membershipId,
        date: date || "2026-11-20",
        breakfast: breakfast || 0,
        lunch: lunch || 0,
        dinner: dinner || 0,
        guestLunch: guestLunch || 0,
        guestDinner: guestDinner || 0,
        isOff: !!isOff,
      },
    });

    return NextResponse.json({ entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
