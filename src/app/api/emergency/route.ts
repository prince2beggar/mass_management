import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant") || "green-view";

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    const contacts = await db.emergencyContact.findMany({
      where: {
        OR: [
          { isNational: true },
          tenant ? { tenantId: tenant.id } : { tenantId: null },
        ],
      },
      orderBy: { isNational: "desc" },
    });

    return NextResponse.json({ contacts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
