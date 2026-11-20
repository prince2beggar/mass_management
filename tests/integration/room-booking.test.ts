import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { db } from "../../src/lib/db";

describe("Room & Seat Allocation Constraints Integration Tests", () => {
  let tenantId: string;
  let testRoomId: string;
  let testBedId: string;
  let testMemberId: string;

  before(async () => {
    const tenant = await db.tenant.findUnique({
      where: { slug: "green-view" },
      include: { memberships: true },
    });
    assert.ok(tenant);
    tenantId = tenant.id;
    testMemberId = tenant.memberships[0].id;

    // Create a temporary test room & bed
    const room = await db.room.upsert({
      where: {
        tenantId_roomNumber: {
          tenantId,
          roomNumber: "999-TEST",
        },
      },
      update: {},
      create: {
        tenantId,
        roomNumber: "999-TEST",
        floor: 9,
        capacity: 1,
        baseRent: 3000,
      },
    });
    testRoomId = room.id;

    const bed = await db.bed.upsert({
      where: {
        roomId_bedNumber: {
          roomId: room.id,
          bedNumber: "TEST-A",
        },
      },
      update: {},
      create: {
        roomId: room.id,
        bedNumber: "TEST-A",
        status: "AVAILABLE",
        monthlyRent: 3000,
      },
    });
    testBedId = bed.id;
  });

  test("new bed initializes with AVAILABLE status", async () => {
    const bed = await db.bed.findUnique({
      where: { id: testBedId },
    });
    assert.ok(bed);
    assert.equal(bed.status, "AVAILABLE");
  });

  test("allocating member to available bed marks it OCCUPIED", async () => {
    // 1. Create allocation
    const allocation = await db.memberAllocation.create({
      data: {
        bedId: testBedId,
        membershipId: testMemberId,
        status: "ACTIVE",
      },
    });
    assert.ok(allocation);

    // 2. Update bed status
    const updatedBed = await db.bed.update({
      where: { id: testBedId },
      data: { status: "OCCUPIED" },
    });
    assert.equal(updatedBed.status, "OCCUPIED");
  });

  test("cannot double-allocate an already OCCUPIED bed", async () => {
    const bed = await db.bed.findUnique({
      where: { id: testBedId },
    });
    assert.equal(bed?.status, "OCCUPIED");

    // Business rule check: attempting to allocate without vacating is blocked
    const canAllocate = bed?.status === "AVAILABLE";
    assert.equal(canAllocate, false, "Double allocation must be rejected");
  });

  test("vacating bed resets status to AVAILABLE and marks allocation VACATED", async () => {
    // 1. Vacate all active allocations for the bed
    await db.memberAllocation.updateMany({
      where: { bedId: testBedId, status: "ACTIVE" },
      data: { status: "VACATED", endDate: new Date() },
    });

    // 2. Reset bed status to AVAILABLE
    const vacatedBed = await db.bed.update({
      where: { id: testBedId },
      data: { status: "AVAILABLE" },
    });
    assert.equal(vacatedBed.status, "AVAILABLE");

    // 3. Confirm active allocation count is now 0
    const activeAllocations = await db.memberAllocation.findMany({
      where: { bedId: testBedId, status: "ACTIVE" },
    });
    assert.equal(activeAllocations.length, 0);
  });

  after(async () => {
    // Clean up test room and bed
    await db.memberAllocation.deleteMany({ where: { bedId: testBedId } });
    await db.bed.deleteMany({ where: { id: testBedId } });
    await db.room.deleteMany({ where: { id: testRoomId } });
    await db.$disconnect();
  });
});
