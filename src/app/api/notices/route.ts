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

    const notices = await db.notice.findMany({
      where: { tenantId: tenant.id },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ notices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantSlug, title, content, priority } = body;

    const tenant = await db.tenant.findUnique({
      where: { slug: tenantSlug || "green-view" },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const notice = await db.notice.create({
      data: {
        tenantId: tenant.id,
        title,
        content,
        priority: priority || "NORMAL",
      },
    });

    return NextResponse.json({ notice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
