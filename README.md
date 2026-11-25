# 🏢 MessMate — Modern Student & Bachelor Mess Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3.0-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-27%20Passed-emerald?style=for-the-badge&logo=checkmarx)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

> **MessMate** (মেসমেট) is a full-featured, modern multi-tenant web application engineered specifically for **student hostels, bachelor messes, and shared apartments** across Bangladesh and South Asia. It replaces messy paper khatas, cutoff disputes, and manual expense calculations with transparent, automated financial ledgers and meal tracking.

---

## 🌟 Key Highlights & Core Features

### 1. 🍱 Transparent Meal & Kitchen Ledger
- **Live Meal Rate Engine:** Dynamically calculates meal rates based on `Total Bazar Spent ÷ Total Consumed Meals`.
- **Automated Cut-Off Schedules:** Daily breakfast (10 PM prev night), lunch (8 AM), and dinner (4 PM) toggles prevent food wastage and kitchen conflicts.
- **Shared Ledger Transparency:** Everyone can see who ate how many meals, total bazar contributions, and real-time net balance:
  - **`+৳ Refund (পাবে):`** Member spent more on bazar than eaten; receives refund from mess fund or gets rent deducted.
  - **`-৳ Due (দিবে / বাকি):`** Member ate more than contributed; food dues are added to settlement.
- **Permission Guard:** Individual members can only toggle their own meals before cutoffs; only the **Meal Manager** or **Admin** can edit records across the kitchen.

### 2. 💳 Simplified & Clean Bills Section
- **Clean 2-Way View Switcher:**
  - **⚡ Combined Net Settlement (একত্রিত মোট বিল):** Unifies room rent, utilities, and meal/bazar refund/due into a single streamlined receipt with 1-click digital pay.
  - **📑 Separate View (আলাদা আলাদা হিসাব):** Keeps room rent & utilities in one card and the kitchen/bazar account in another card for messes that settle them independently.
- **Interactive Bill Editing (Admin Control):** Admin can modify seat rent, Wi-Fi, maid/cook salary, waste fee, or add custom charges/discounts on the fly.
- **Privacy Guaranteed:** In compliance with mess customs, room rent invoices remain strictly confidential per member (`Admin sees all; Member sees only their own`).

### 3. 👥 Comprehensive Member Profiles & Emergency Contacts
- **Rich Profiles:** Add full name, phone number, email, assigned room/bed, university/institution, and custom bio/notes.
- **Profile Avatars:** Clickable 1-click avatar presets or custom photo URLs with live preview.
- **Emergency Contacts:** Every resident profile includes guardian name, emergency phone number, and relation (`Father / Mother / Brother / Spouse`), displayed prominently for safety.
- **Alumni Hall of Fame:** Dedicated section celebrating former residents who graduated and established successful careers.

### 4. 🛡️ Role-Based Access Control (RBAC)
- **Admin (মেস এডমিন):** Full mess control — add members, edit roles, adjust rent bills, approve bazar expenses, execute monthly closings.
- **Meal Manager (মিল ও বাজার ম্যানেজার):** Monthly rotating kitchen in-charge — logs daily groceries, manages meal attendance, reconciles kitchen fund.
- **Resident Member (সাধারণ সদস্য):** Toggles daily meals, views live meal rates, views private rent bill, submits digital payments.

### 5. 🌐 Full Bilingual Support (Bangla & English)
- Instant 1-click toggle between **English** and **বাংলা (Bengali)** across the entire user interface and notifications.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **Database & ORM** | [Prisma 6.3](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/) (Production-ready for PostgreSQL / MySQL) |
| **Styling & UI** | [Tailwind CSS 3.4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Testing** | Node.js Test Runner + [tsx](https://github.com/privatenumber/tsx) (27 Unit & Integration Tests) |
| **State & i18n** | React Context API with LocalStorage sync & Zero-Dependency translation matrix |

---

## 📁 Project Directory Structure

```text
mass_management/
├── prisma/
│   ├── schema.prisma         # Multi-tenant schema (Tenant, User, Membership, MealEntry, Invoice, Ledger)
│   ├── dev.db                # SQLite local database
│   └── seed.ts               # Demo data seeder for Green View Student Mess
├── src/
│   ├── app/
│   │   ├── admin/            # Admin Control Center (Member additions, role edit, settings)
│   │   ├── bazar/            # Daily grocery logging and expense tracking
│   │   ├── dashboard/        # Resident daily command center (Cutoff meal toggles)
│   │   ├── finance/          # Simplified bills (Combined vs Separate, bazar reconciliation)
│   │   ├── meals/            # Kitchen attendance & transparent master meal rate ledger
│   │   ├── notices/          # Mess digital announcement board
│   │   ├── reports/          # Financial audit trail & CSV data export
│   │   ├── rooms/            # Room floorplans and bed occupancy management
│   │   ├── api/              # RESTful API endpoints (/meals, /bazar, /finance, /members, etc.)
│   │   ├── layout.tsx        # App RootLayout with hydration guards & font configurations
│   │   └── page.tsx          # Interactive Homepage & Mess Living Showcase
│   ├── components/
│   │   └── Header.tsx        # Global responsive navbar with persona quick-switcher & i18n
│   ├── context/
│   │   └── AppContext.tsx    # Unified global state (Auth persona, members, roles, toast)
│   └── lib/
│       ├── db.ts             # Prisma singleton client instance
│       └── i18n.ts           # Complete bilingual translation matrix (EN/BN)
├── tests/
│   ├── unit/                 # Unit tests (Financial ledger, meal rate engine)
│   └── integration/          # Integration tests (Multi-tenant isolation, APIs, room booking)
├── package.json              # Dependencies and execution scripts
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.ts        # Custom Tailwind design tokens
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `pnpm` (recommended), `npm`, or `yarn`
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prince2beggar/mass_management.git
   cd mass_management
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Initialize Database & Seed Data:**
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

4. **Start the local development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Automated Testing

MessMate includes comprehensive automated test suites covering financial invariants, multi-tenant isolation, room allocation constraints, and live API endpoints.

To run the test suite:
```bash
pnpm test
```

**Test Suite Coverage (27 Tests):**
- ✅ Live API Endpoints (`GET /api/meals`, `/api/bazar`, `/api/finance`, `/api/rooms`, `/api/emergency`, `/api/reports`)
- ✅ Bilingual Localization & i18n Verification (Identical keys, valid Bengali Unicode)
- ✅ Room & Bed Allocation Constraints (Single occupancy, vacancy management)
- ✅ Multi-Tenant Data Isolation (Strict tenant boundaries, zero cross-leak)
- ✅ Financial Ledger & Invoicing (Double-entry invariants, idempotency, utility splits)
- ✅ Meal Rate Calculation Engine (Precision rounding, zero division fallbacks)

---

## 👤 Demo Personas & Roles

For immediate evaluation, use the persona quick-switcher in the top navbar:

| Persona Name | Role | Room | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Rahim Ahmed** | `ADMIN` | Room 201 (Master Bed) | Manages members, edits rent bills, rotates managers, executes monthly closing. |
| **Tanvir Hasan** | `MEAL_MANAGER` | Room 102 (Bed B) | Logs daily bazar shopping, manages meal attendance, controls cut-off schedules. |
| **Kamrul Islam** | `MEMBER` | Room 101 (Bed A) | Toggles daily meals, views transparent meal ledger, pays personal rent invoice. |
| **Sakib Al Mahmud** | `MEMBER` | Room 101 (Bed B) | Resident student with food balance dues. |

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/meals` | `GET`, `POST` | Fetch or submit daily breakfast, lunch, and dinner attendance logs. |
| `/api/bazar` | `GET`, `POST` | Itemized grocery logs with purchaser details and total expenditure. |
| `/api/finance` | `GET`, `POST` | Invoices, payment submissions, and audit trail ledger. |
| `/api/members` | `GET`, `POST`, `PATCH` | Manage member roster, profile pictures, emergency contacts, and roles. |
| `/api/rooms` | `GET`, `POST` | Room inventory and bed occupancy status. |
| `/api/reports` | `GET` | Export live CSV reports for bazar and financial accounts. |
| `/api/emergency` | `GET` | Verified local emergency contacts and national hotlines. |

---

## 🤝 Contributing

Contributions, feature requests, and feedback are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See `LICENSE` for more details.

Developed with ❤️ for making mess life simple, transparent, and hassle-free.
