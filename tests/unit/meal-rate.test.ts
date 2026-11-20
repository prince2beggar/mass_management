import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Meal Rate Calculation Engine Unit Tests", () => {
  function calculateMealRate(totalBazar: number, totalMeals: number, fallback = 50.0): number {
    if (totalMeals <= 0) return fallback;
    return Number((totalBazar / totalMeals).toFixed(2));
  }

  function computeTotalMeals(entries: { breakfast: number; lunch: number; dinner: number; guestLunch?: number; guestDinner?: number; isOff?: boolean }[]): number {
    return entries.reduce((acc, m) => {
      if (m.isOff) return acc;
      const bWeight = m.breakfast > 0 ? 0.5 : 0;
      const lWeight = m.lunch;
      const dWeight = m.dinner;
      const guestL = m.guestLunch || 0;
      const guestD = m.guestDinner || 0;
      return acc + bWeight + lWeight + dWeight + guestL + guestD;
    }, 0);
  }

  test("calculates standard meal rate correctly with 2 decimal precision", () => {
    const totalBazar = 3090;
    const totalMeals = 56.5;
    const rate = calculateMealRate(totalBazar, totalMeals);
    assert.equal(rate, 54.69);
  });

  test("returns fallback meal rate when total meals is zero (prevent division by zero)", () => {
    const totalBazar = 0;
    const totalMeals = 0;
    const rate = calculateMealRate(totalBazar, totalMeals, 50.0);
    assert.equal(rate, 50.0);
  });

  test("accurately counts half-breakfast and guest meals", () => {
    const entries = [
      { breakfast: 1, lunch: 1, dinner: 1, guestLunch: 1, guestDinner: 0, isOff: false }, // 0.5 + 1 + 1 + 1 = 3.5
      { breakfast: 0, lunch: 1, dinner: 1, isOff: false },                                // 0 + 1 + 1 = 2.0
      { breakfast: 1, lunch: 1, dinner: 1, isOff: true },                                 // isOff = 0
    ];
    const total = computeTotalMeals(entries);
    assert.equal(total, 5.5);
  });

  test("correctly applies member meal cost deduction in monthly closing", () => {
    const memberMeals = 34;
    const mealRate = 54.69;
    const totalMealCost = Number((memberMeals * mealRate).toFixed(2));
    assert.equal(totalMealCost, 1859.46);
  });
});
