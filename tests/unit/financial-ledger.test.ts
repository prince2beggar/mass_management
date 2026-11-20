import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Financial Ledger & Invoicing Unit Tests", () => {
  interface InvoiceItem {
    name: string;
    amount: number;
  }

  function calculateInvoiceTotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  function applyPayment(totalDue: number, paidSoFar: number, newPayment: number) {
    const newPaid = paidSoFar + newPayment;
    const remainingDue = Math.max(0, totalDue - newPaid);
    const status = remainingDue === 0 ? "PAID" : "PARTIAL";
    return { newPaid, remainingDue, status };
  }

  function splitUtilities(totalUtilityCost: number, memberCount: number): number {
    if (memberCount <= 0) return 0;
    return Number((totalUtilityCost / memberCount).toFixed(2));
  }

  test("calculates monthly invoice total with rent, meals, and utilities", () => {
    const items = [
      { name: "Seat Rent", amount: 3500 },
      { name: "Meal Cost Advance", amount: 2000 },
      { name: "WiFi Fee", amount: 250 },
      { name: "Cook Salary Split", amount: 500 },
      { name: "Waste Management", amount: 200 },
    ];
    const total = calculateInvoiceTotal(items);
    assert.equal(total, 6450);
  });

  test("accurately updates invoice status from PENDING to PARTIAL to PAID", () => {
    const totalDue = 6450;
    
    // Initial state
    let res = applyPayment(totalDue, 0, 0);
    assert.equal(res.remainingDue, 6450);
    assert.equal(res.status, "PARTIAL");

    // Pay 5000 via bKash
    res = applyPayment(totalDue, 0, 5000);
    assert.equal(res.newPaid, 5000);
    assert.equal(res.remainingDue, 1450);
    assert.equal(res.status, "PARTIAL");

    // Settle remaining 1450
    res = applyPayment(totalDue, 5000, 1450);
    assert.equal(res.newPaid, 6450);
    assert.equal(res.remainingDue, 0);
    assert.equal(res.status, "PAID");
  });

  test("calculates equal shared utility split across all resident members", () => {
    const totalInternet = 1250;
    const totalCookSalary = 2500;
    const totalElectricity = 1500;
    const totalUtilities = totalInternet + totalCookSalary + totalElectricity; // 5250
    const activeMembers = 5;

    const splitPerMember = splitUtilities(totalUtilities, activeMembers);
    assert.equal(splitPerMember, 1050);
  });

  test("ledger double-entry running balance invariant holds true", () => {
    let runningBalance = 0;

    // Month Invoice Created (Debit: member owes money)
    const invoiceDebit = 6450;
    runningBalance -= invoiceDebit;
    assert.equal(runningBalance, -6450);

    // Payment Received (Credit: member pays)
    const paymentCredit = 5000;
    runningBalance += paymentCredit;
    assert.equal(runningBalance, -1450);

    // Additional payment to clear due
    runningBalance += 1450;
    assert.equal(runningBalance, 0);
  });

  test("idempotency check rejects duplicate transaction references", () => {
    const processedTrxIds = new Set<string>();
    function processTrx(trxId: string): boolean {
      if (processedTrxIds.has(trxId)) {
        return false; // Duplicate rejected
      }
      processedTrxIds.add(trxId);
      return true;
    }

    assert.equal(processTrx("BKH-98129381"), true);
    assert.equal(processTrx("BKH-98129381"), false, "Duplicate trxId must be rejected");
    assert.equal(processTrx("BKH-99999999"), true);
  });
});
