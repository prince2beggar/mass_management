# MessMate SaaS — Routine Maintenance Schedule & Operations

**Document Type:** Standard Operating Procedure (SOP)\
**Scope:** Automated & Manual Platform Maintenance Routines

---

## 1. Cadence Overview

```
Daily:     Automated DB Snapshots (03:00 UTC) + Meal Cut-off Notifications (10 PM, 8 AM, 4 PM)
Weekly:    Prune Temp Caches on D: + Review Unverified Bazar Entries + Integrity Drills
Monthly:   Automated Rent Invoicing (1st) + Monthly Closing Reconciliation + Statement Dispatch
Quarterly: Disaster Recovery Restoration Drills + Dependency Security Audit + SSL Certificate Renewals
```

---

## 2. Daily Routine
1. **Automated Database Snapshot (`03:00 UTC`):**
   - Executed via `scripts/backup-db.ps1`.
   - Saved to `D:\mass_management\backups\`.
   - SHA-256 integrity hash logged.
2. **Meal Cut-off Enforcements:**
   - **Breakfast:** 10:00 PM previous night (locks breakfast adjustments).
   - **Lunch:** 08:00 AM same day (locks lunch adjustments).
   - **Dinner:** 04:00 PM same day (locks dinner adjustments).
3. **Health Check Monitoring:**
   - Ping `/api/health` continuously to detect database latency spikes (>100ms).

---

## 3. Weekly Routine
1. **Cache & Scratch Cleanup (`Every Sunday at 02:00 AM`):**
   - Automatically cleans files older than 3 days in `D:\mass_management\.temp`.
2. **Bazar Verification Sweep:**
   - Mess Manager reviews all pending unverified shopping slips in `/bazar`.
3. **Weekly Attendance Audit:**
   - Exports `/api/reports?dataset=meals` to review attendance anomalies.

---

## 4. Monthly Routine
1. **Monthly Invoicing (`1st of each month at 00:00 AM`):**
   - Generates member seat rent, advance meal deposit, and equal utility splits.
2. **Monthly Closing & Reconciliation (`Last day of the month`):**
   - Finalizes total kitchen bazar expenses.
   - Computes official final meal rate.
   - Reconciles individual member credit/debit balances in the ledger.
3. **Formal Statements Dispatch:**
   - Members receive individual printable PDF statements with net dues.

---

## 5. Quarterly Routine
1. **Disaster Recovery Restoration Drill:**
   - Stop web container, restore database using `scripts/restore-db.ps1`, verify integrity, and run smoke tests.
2. **Security Vulnerability Audit:**
   - Run `pnpm audit` to check and patch dependencies.
3. **SSL / DNS Audit:**
   - Check wildcard Let's Encrypt certificate renewals for `*.messmate.com`.
