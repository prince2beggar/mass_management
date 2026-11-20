# MessMate SaaS — Release Notes v1.0.0 (MVP Baseline)

**Release Version:** 1.0.0\
**Release Date:** 20 November 2026\
**Target Operating Environment:** Multi-Tenant Web (Next.js 15 App Router + Prisma ORM)\
**Repository Status:** Production-Ready Baseline (`master` branch on D: Drive)

---

## 1. Release Overview

MessMate v1.0.0 marks the initial public release of Bangladesh's premier **Multi-Tenant Mess & Hostel Management SaaS Platform**. The platform provides complete automation for student messes, bachelor flats, job-holder hostels, and shared family sublet apartments.

---

## 2. Highlights & New Features

### Multi-Tenant Architecture & Branding
- **Subdomain-based Mess Portals:** Each mess gets its own isolated portal (`slug.messmate.com`) with custom branding and colors.
- **5-Tier Role-Based Access Control:** Built-in permission switching between Platform Super Admin, Mess Owner, Meal Manager, Accountant, Member, and Guest.
- **Bilingual Interface:** Instant seamless switching between **Bangla (বাংলা)** and **English**.

### Kitchen & Meal Operations
- **1-Click Daily Attendance:** Members toggle breakfast, lunch, dinner, and guest meals with real-time feedback.
- **Automated Cut-off Enforcements:** Strict cut-off limits prevent unauthorized retroactive changes (Breakfast: 10 PM prev, Lunch: 8 AM, Dinner: 4 PM).
- **Dynamic Meal Rate Engine:** Real-time formula calculates:
  $$\text{Meal Rate} = \frac{\text{Total Month Bazar Expense}}{\text{Total Consumed Meals}}$$

### Kitchen Bazar Accounting & Proof of Purchase
- **Itemized Shopping Slips:** Record weights, quantities, unit prices, and store locations.
- **Manager Approval Workflow:** Unverified vouchers require review before inclusion in the final meal ledger.

### Finance, Ledger & Digital Payments
- **Automated Monthly Invoicing:** Rent, meal advances, high-speed WiFi, cook salary, and city waste fees.
- **Digital Payment Submission:** bKash, Nagad, Rocket, Bank Transfer, and Cash with TrxID tracking.
- **Append-Only Double Entry Ledger:** Traceable running balances protecting financial integrity.
- **One-Click Monthly Account Closing:** Automatically reconciles meals and generates finalized member balances.

### Accommodation & Room Management
- **Visual Floorplan Matrix:** Room-by-room graphical display of bed availability (*Available*, *Occupied*, *Reserved*).
- **Interactive Allocation & Vacating:** One-click member room assignment.
- **Seat Rental Listings:** Public showcase with booking inquiry modal for prospective tenants.

### Safety, Community & Verification
- **24/7 Verified Emergency Directory:** National helplines (999, 16163, 16263, 333) and localized mess contacts (Police, Ambulance, Landlord, Electrician).
- **Mess Notice Board:** Prioritized announcements (*Urgent*, *Important*, *Normal*).
- **In-App Maintenance Box:** Direct channel for residents to report electrical, water, or hygiene issues.

### Reporting & Data Exports
- **Automated CSV/Excel Downloads:** 1-click export of Bazar Ledger, Full-Month Meal Attendance, and Member Dues Matrix.
- **Formal Printable Member Statements:** Print-optimized PDF statements featuring detailed itemized deductions, payment credits, and official manager signature lines.

---

## 3. Security & Quality Assurance Verification

- **Automated Test Suites:** 27 unit and integration tests passing with 100% success rate across 6 test suites.
- **Tenant Isolation:** Cross-tenant queries verified to prevent any data leakage between messes.
- **Zero C: Drive Policy:** 100% of node dependencies, Prisma database, temp files, and build artifacts reside on `D:\mass_management`.

---

## 4. Verification Checkpoint

```powershell
# Run smoke tests
powershell -File scripts/smoke-test.ps1

# Run unit & integration tests
pnpm test

# Create database backup
powershell -File scripts/backup-db.ps1
```
