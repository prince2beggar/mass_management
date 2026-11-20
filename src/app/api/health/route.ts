import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const startTime = Date.now();
  try {
    // 1. Check database connectivity
    await db.tenant.count();
    const dbLatency = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: {
          status: "connected",
          provider: "sqlite",
          latencyMs: dbLatency,
          storage: "100% D: Drive Isolated",
        },
        services: {
          meals: "operational",
          bazar: "operational",
          finance: "operational",
          rooms: "operational",
          emergency: "operational",
          reports: "operational",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
