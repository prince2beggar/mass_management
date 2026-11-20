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

    const rooms = await db.room.findMany({
      where: { tenantId: tenant.id },
      include: {
        beds: {
          include: {
            allocations: {
              where: { status: "ACTIVE" },
              include: {
                membership: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ rooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bedId, membershipId } = body;

    const allocation = await db.memberAllocation.create({
      data: {
        bedId,
        membershipId,
        status: "ACTIVE",
      },
    });

    await db.bed.update({
      where: { id: bedId },
      data: { status: "OCCUPIED" },
    });

    return NextResponse.json({ allocation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bedId } = body;

    await db.memberAllocation.updateMany({
      where: { bedId, status: "ACTIVE" },
      data: { status: "VACATED", endDate: new Date() },
    });

    const bed = await db.bed.update({
      where: { id: bedId },
      data: { status: "AVAILABLE" },
    });

    return NextResponse.json({ bed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
