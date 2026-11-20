import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "green-view";

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const entries = await db.bazarEntry.findMany({
      where: { tenantId: tenant.id },
      include: {
        shopper: {
          include: { user: true },
        },
        items: true,
      },
      orderBy: { date: "desc" },
    });

    const totalSpent = entries.reduce((acc, e) => acc + e.totalAmount, 0);

    return NextResponse.json({
      entries,
      totalSpent,
      count: entries.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantSlug, shopperMembershipId, date, totalAmount, category, notes, items } = body;

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug || "green-view" },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const newEntry = await db.bazarEntry.create({
      data: {
        tenantId: tenant.id,
        shopperMembershipId,
        date: date || new Date().toISOString().split("T")[0],
        totalAmount: parseFloat(totalAmount),
        category: category || "GROCERY",
        notes,
        isVerified: false,
        items: {
          create: items?.map((it: any) => ({
            itemName: it.name,
            quantity: parseFloat(it.qty) || 1,
            unit: it.unit || "unit",
            unitPrice: parseFloat(it.price) || 0,
            totalPrice: parseFloat(it.price) || 0,
          })) || [],
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, verifiedBy } = body;

    const updated = await db.bazarEntry.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedBy: verifiedBy || "Mess Admin",
      },
    });

    return NextResponse.json({ entry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
