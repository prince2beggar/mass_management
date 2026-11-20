import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { db } from "../../src/lib/db";

describe("Multi-Tenant Data Isolation Integration Tests", () => {
  let greenViewTenantId: string;
  let secondTenantId: string;

  before(async () => {
    // 1. Locate Green View Tenant
    const gv = await db.tenant.findUnique({
      where: { slug: "green-view" },
    });
    assert.ok(gv, "Green View Tenant must exist in SQLite database");
    greenViewTenantId = gv.id;

    // 2. Ensure or create a Second Tenant for boundary tests
    const t2 = await db.tenant.upsert({
      where: { slug: "comfort-living" },
      update: {},
      create: {
        name: "Comfort Living Bachelor Mess",
        slug: "comfort-living",
        address: "Mirpur 10, Dhaka",
        messType: "BACHELOR",
        mealSystem: "FIXED",
      },
    });
    secondTenantId = t2.id;
  });

  test("tenant queries strictly isolate records by tenantId", async () => {
    // Green view bazar entries
    const gvBazar = await db.bazarEntry.findMany({
      where: { tenantId: greenViewTenantId },
    });

    // Second tenant bazar entries
    const t2Bazar = await db.bazarEntry.findMany({
      where: { tenantId: secondTenantId },
    });

    // Verify all entries in gvBazar strictly belong to greenViewTenantId
    for (const b of gvBazar) {
      assert.equal(b.tenantId, greenViewTenantId);
      assert.notEqual(b.tenantId, secondTenantId);
    }

    // Verify cross-tenant isolation
    assert.ok(gvBazar.length > 0, "Green View has bazar entries");
    assert.equal(t2Bazar.length, 0, "Second tenant has zero bazar entries without leakage");
  });

  test("memberships are strictly isolated between messes", async () => {
    const gvMembers = await db.membership.findMany({
      where: { tenantId: greenViewTenantId },
      include: { user: true },
    });

    const t2Members = await db.membership.findMany({
      where: { tenantId: secondTenantId },
    });

    assert.ok(gvMembers.length >= 5, "Green View has at least 5 resident members");
    assert.equal(t2Members.length, 0, "Second tenant does not inherit Green View members");
  });

  test("cross-tenant meal attendance queries return zero leak", async () => {
    const t2Meals = await db.mealEntry.findMany({
      where: { tenantId: secondTenantId },
    });

    assert.equal(t2Meals.length, 0, "No meal entries leak across tenant boundaries");
  });

  test("room numbers are unique per tenant, allowing identical room numbers in different messes", async () => {
    // Green View has Room 101
    const gvRoom101 = await db.room.findFirst({
      where: { tenantId: greenViewTenantId, roomNumber: "101" },
    });
    assert.ok(gvRoom101, "Room 101 exists in Green View");

    // Creating Room 101 in Comfort Living must succeed independently
    const t2Room101 = await db.room.upsert({
      where: {
        tenantId_roomNumber: {
          tenantId: secondTenantId,
          roomNumber: "101",
        },
      },
      update: {},
      create: {
        tenantId: secondTenantId,
        roomNumber: "101",
        floor: 1,
        capacity: 4,
        baseRent: 2800,
      },
    });

    assert.ok(t2Room101);
    assert.equal(t2Room101.roomNumber, "101");
    assert.equal(t2Room101.tenantId, secondTenantId);
    assert.notEqual(t2Room101.id, gvRoom101.id, "Different database IDs across tenants");
  });

  after(async () => {
    await db.$disconnect();
  });
});
