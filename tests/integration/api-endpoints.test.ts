import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Live API Endpoints Integration Tests", () => {
  const BASE_URL = "http://localhost:3000";

  test("GET /api/meals returns 200 OK with live SQLite attendance and stats", async () => {
    const res = await fetch(`${BASE_URL}/api/meals?tenant=green-view&date=2026-11-20`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.date, "2026-11-20");
    assert.ok(Array.isArray(data.members), "Members array returned");
    assert.ok(data.members.length >= 5, "Green View has 5 seeded members");
    assert.ok(data.stats, "Stats object present");
    assert.ok(data.stats.totalBazarAmount > 0, "Bazar total > 0");
    assert.ok(data.stats.calculatedMealRate > 0, "Meal rate calculated");
  });

  test("GET /api/bazar returns 200 OK with itemized records and total", async () => {
    const res = await fetch(`${BASE_URL}/api/bazar?tenant=green-view`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.entries), "Entries array returned");
    assert.ok(data.totalSpent >= 3090, "Total bazar matches seed amount");
    assert.ok(data.entries[0].items.length > 0, "Itemized products present");
  });

  test("GET /api/finance returns 200 OK with invoices and ledger audit trail", async () => {
    const res = await fetch(`${BASE_URL}/api/finance?tenant=green-view`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.invoices), "Invoices array returned");
    assert.ok(Array.isArray(data.ledgerEntries), "Ledger audit trail returned");
    assert.ok(data.summary.totalInvoiced > 0, "Total invoiced > 0");
    assert.ok(data.summary.totalCollected > 0, "Total collected > 0");
  });

  test("GET /api/rooms returns 200 OK with room floorplan and bed occupancy", async () => {
    const res = await fetch(`${BASE_URL}/api/rooms?tenant=green-view`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.rooms), "Rooms array returned");
    const room101 = data.rooms.find((r: any) => r.roomNumber === "101");
    assert.ok(room101, "Room 101 exists");
    assert.equal(room101.beds.length, 2, "Room 101 has 2 beds");
  });

  test("GET /api/emergency returns 200 OK with verified national and local contacts", async () => {
    const res = await fetch(`${BASE_URL}/api/emergency?tenant=green-view`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.contacts), "Contacts array returned");
    const hotline999 = data.contacts.find((c: any) => c.phone === "999");
    assert.ok(hotline999, "National 999 hotline present");
  });

  test("GET /api/reports?dataset=bazar returns text/csv attachment with proper headers", async () => {
    const res = await fetch(`${BASE_URL}/api/reports?tenant=green-view&dataset=bazar`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("content-type")?.includes("text/csv"));

    const csvText = await res.text();
    assert.ok(csvText.startsWith("ID,Date,Shopper,Category,TotalAmount,Verified,VerifiedBy,Notes,Items"));
  });

  test("GET /api/reports?dataset=finance returns text/csv attachment with invoice dues", async () => {
    const res = await fetch(`${BASE_URL}/api/reports?tenant=green-view&dataset=finance`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("content-type")?.includes("text/csv"));

    const csvText = await res.text();
    assert.ok(csvText.startsWith("InvoiceNo,MonthYear,MemberName,TotalBill,PaidAmount,DueAmount,Status,DueDate"));
  });
});
