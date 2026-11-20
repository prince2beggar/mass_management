import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "green-view";
    const dataset = searchParams.get("dataset");

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // 1. Export CSV: Bazar
    if (dataset === "bazar") {
      const entries = await db.bazarEntry.findMany({
        where: { tenantId: tenant.id },
        include: {
          shopper: { include: { user: true } },
          items: true,
        },
        orderBy: { date: "asc" },
      });

      let csv = "ID,Date,Shopper,Category,TotalAmount,Verified,VerifiedBy,Notes,Items\n";
      for (const e of entries) {
        const itemsStr = e.items.map((i) => `${i.itemName} (${i.quantity} ${i.unit} - ৳${i.totalPrice})`).join("; ");
        csv += `"${e.id}","${e.date}","${e.shopper.user.name}","${e.category}",${e.totalAmount},${e.isVerified},"${e.verifiedBy || ""}","${e.notes || ""}","${itemsStr}"\n`;
      }

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bazar-report-${tenantSlug}.csv"`,
        },
      });
    }

    // 2. Export CSV: Meals
    if (dataset === "meals") {
      const entries = await db.mealEntry.findMany({
        where: { tenantId: tenant.id },
        include: {
          membership: { include: { user: true } },
        },
        orderBy: [{ date: "asc" }, { membershipId: "asc" }],
      });

      let csv = "Date,MemberName,Breakfast,Lunch,Dinner,GuestLunch,GuestDinner,Status\n";
      for (const m of entries) {
        csv += `"${m.date}","${m.membership.user.name}",${m.breakfast},${m.lunch},${m.dinner},${m.guestLunch},${m.guestDinner},"${m.isOff ? "OFF" : "ACTIVE"}"\n`;
      }

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="meals-report-${tenantSlug}.csv"`,
        },
      });
    }

    // 3. Export CSV: Financial Dues Summary
    if (dataset === "finance") {
      const invoices = await db.invoice.findMany({
        where: { tenantId: tenant.id },
        include: {
          membership: { include: { user: true } },
          items: true,
        },
      });

      let csv = "InvoiceNo,MonthYear,MemberName,TotalBill,PaidAmount,DueAmount,Status,DueDate\n";
      for (const inv of invoices) {
        const due = Math.max(0, inv.totalAmount - inv.paidAmount);
        csv += `"${inv.invoiceNumber}","${inv.monthYear}","${inv.membership.user.name}",${inv.totalAmount},${inv.paidAmount},${due},"${inv.status}","${inv.dueDate.toISOString().split("T")[0]}"\n`;
      }

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="finance-dues-${tenantSlug}.csv"`,
        },
      });
    }

    // Default: Aggregate Statistical Insights
    const bazarTotal = await db.bazarEntry.aggregate({
      where: { tenantId: tenant.id },
      _sum: { totalAmount: true },
    });

    const invoices = await db.invoice.findMany({
      where: { tenantId: tenant.id },
    });

    const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const collectionRate = totalInvoiced > 0 ? Number(((totalCollected / totalInvoiced) * 100).toFixed(1)) : 0;

    const meals = await db.mealEntry.findMany({
      where: { tenantId: tenant.id },
    });

    const totalMealsConsumed = meals.reduce(
      (sum, m) => sum + (m.breakfast > 0 ? 0.5 : 0) + m.lunch + m.dinner + m.guestLunch + m.guestDinner,
      0
    );

    const activeMembersCount = await db.membership.count({
      where: { tenantId: tenant.id, status: "ACTIVE" },
    });

    return NextResponse.json({
      tenant: {
        name: tenant.name,
        slug: tenant.slug,
      },
      summary: {
        totalBazarExpense: bazarTotal._sum.totalAmount || 0,
        totalInvoiced,
        totalCollected,
        collectionRate,
        totalMealsConsumed,
        activeMembersCount,
        currentMealRate:
          totalMealsConsumed > 0
            ? Number(((bazarTotal._sum.totalAmount || 0) / totalMealsConsumed).toFixed(2))
            : 50.0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
