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

    const invoices = await db.invoice.findMany({
      where: { tenantId: tenant.id },
      include: {
        membership: {
          include: { user: true },
        },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const ledgerEntries = await db.ledgerEntry.findMany({
      where: { tenantId: tenant.id },
      include: {
        membership: {
          include: { user: true },
        },
      },
      orderBy: { date: "desc" },
      take: 20,
    });

    const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const totalDue = totalInvoiced - totalCollected;

    return NextResponse.json({
      invoices,
      ledgerEntries,
      summary: {
        totalInvoiced,
        totalCollected,
        totalDue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, membershipId, amount, method, trxId } = body;

    const amountNum = parseFloat(amount);

    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const payment = await db.payment.create({
      data: {
        tenantId: invoice.tenantId,
        membershipId: membershipId || invoice.membershipId,
        invoiceId,
        amount: amountNum,
        method: method || "BKASH",
        trxId,
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: "Manager Reconciled",
      },
    });

    const newPaid = invoice.paidAmount + amountNum;
    const newStatus = newPaid >= invoice.totalAmount ? "PAID" : "PARTIAL";

    const updatedInvoice = await db.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaid,
        status: newStatus,
      },
    });

    const lastLedger = await db.ledgerEntry.findFirst({
      where: { membershipId: invoice.membershipId },
      orderBy: { date: "desc" },
    });

    const currentBalance = lastLedger ? lastLedger.balanceAfter : 0;

    await db.ledgerEntry.create({
      data: {
        tenantId: invoice.tenantId,
        membershipId: invoice.membershipId,
        type: "CREDIT",
        category: "PAYMENT_RECEIVED",
        amount: amountNum,
        balanceAfter: currentBalance + amountNum,
        description: `Payment received via ${method} (TrxID: ${trxId || "CASH"})`,
      },
    });

    return NextResponse.json({ payment, invoice: updatedInvoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
