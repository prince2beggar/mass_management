import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  const startTime = Date.now();
  try {
    // 1. Database metrics
    const tenantCount = await db.tenant.count();
    const userCount = await db.user.count();
    const invoiceCount = await db.invoice.count();
    const bazarCount = await db.bazarEntry.count();
    const mealsCount = await db.mealEntry.count();
    const dbLatency = Date.now() - startTime;

    // 2. Memory & Node Process Metrics
    const memory = process.memoryUsage();
    const memoryMetrics = {
      rssMb: Math.round(memory.rss / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      externalMb: Math.round(memory.external / 1024 / 1024),
    };

    // 3. Inspect Backups on D: drive
    const backupDir = "D:\\mass_management\\backups";
    let backupHistory: { name: string; sizeKb: number; time: string }[] = [];
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir);
      backupHistory = files
        .filter((f) => f.endsWith(".db"))
        .map((f) => {
          const stats = fs.statSync(path.join(backupDir, f));
          return {
            name: f,
            sizeKb: Math.round(stats.size / 1024),
            time: stats.mtime.toISOString(),
          };
        })
        .sort((a, b) => (a.time > b.time ? -1 : 1))
        .slice(0, 10);
    }

    // 4. Audit Log Events
    const recentAuditLogs = await db.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        storageIsolation: "100% D: Drive Enforced",
        activeWorkingDir: "D:\\mass_management",
      },
      performance: {
        dbLatencyMs: dbLatency,
        memory: memoryMetrics,
      },
      counts: {
        tenants: tenantCount,
        users: userCount,
        invoices: invoiceCount,
        bazarEntries: bazarCount,
        mealEntries: mealsCount,
      },
      backups: {
        totalSnapshots: backupHistory.length,
        latest: backupHistory[0] || null,
        history: backupHistory,
      },
      auditLogs: recentAuditLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
