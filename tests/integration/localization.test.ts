import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { translations } from "../../src/lib/i18n";

describe("Bilingual Localization & i18n Verification Tests", () => {
  const en = translations.en;
  const bn = translations.bn;

  test("translations.en and translations.bn have identical top-level sections", () => {
    const enSections = Object.keys(en);
    const bnSections = Object.keys(bn);

    assert.deepEqual(
      enSections.sort(),
      bnSections.sort(),
      "Every translation section in English must be present in Bangla"
    );
  });

  test("all keys in every section are translated in both English and Bangla without missing tokens", () => {
    for (const section of Object.keys(en) as (keyof typeof en)[]) {
      const enKeys = Object.keys(en[section]);
      const bnKeys = Object.keys(bn[section]);

      assert.deepEqual(
        enKeys.sort(),
        bnKeys.sort(),
        `Section '${section}' keys do not match between English and Bangla`
      );

      // Verify no empty string
      for (const k of enKeys) {
        const enVal = (en[section] as any)[k];
        const bnVal = (bn[section] as any)[k];

        assert.ok(typeof enVal === "string" && enVal.length > 0, `en.${section}.${k} is empty`);
        assert.ok(typeof bnVal === "string" && bnVal.length > 0, `bn.${section}.${k} is empty`);
      }
    }
  });

  test("Bangla strings contain valid Bengali Unicode script characters", () => {
    // Regular expression for Unicode Bengali block (U+0980 to U+09FF)
    const bengaliRegex = /[\u0980-\u09FF]/;

    assert.ok(bengaliRegex.test(bn.common.appName), "App name must contain Bengali script");
    assert.ok(bengaliRegex.test(bn.nav.dashboard), "Dashboard link must contain Bengali script");
    assert.ok(bengaliRegex.test(bn.meals.breakfast), "Breakfast label must contain Bengali script");
    assert.ok(bengaliRegex.test(bn.finance.rent), "Rent label must contain Bengali script");
  });
});
