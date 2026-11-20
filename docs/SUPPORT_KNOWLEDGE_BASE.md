# MessMate SaaS — Support Knowledge Base & User Manual

**Target Audience:** Mess Residents, Meal Managers, Accountants, Mess Owners, and Platform Super Admins

---

## 1. Member Self-Service Guide

### Q1: How do I turn OFF my meals for a day when I will be eating outside?
1. Log into your mess portal (`green-view.messmate.com`) or navigate to **Dashboard**.
2. Under **Today's Meal Status**, click the toggle button for the meal you want to turn off (Breakfast, Lunch, or Dinner).
3. If you want to turn off all meals at once, click **"Turn All Meals OFF"**.
4. **Note:** Ensure you make changes before the cut-off time (Breakfast: 10 PM prev, Lunch: 8 AM, Dinner: 4 PM).

### Q2: How do I pay my monthly seat rent and meal dues?
1. Open **Bills & Ledger** (`/finance`) or click **Pay Due** on your dashboard.
2. Click **Pay with bKash / Nagad / Bank**.
3. Send the amount to the manager's merchant/personal number listed in the modal.
4. Paste the **Transaction ID (TrxID)** and submit.
5. Your payment will be recorded in the immutable audit ledger.

### Q3: How do I invite a guest for dinner?
1. Go to **Meals & Diet** (`/meals`).
2. Beside your attendance row, click **+** on the **Guest Meals** column for Lunch or Dinner.
3. Guest meals are charged at the designated guest rate (e.g., ৳85) and added to your personal monthly invoice.

---

## 2. Mess Manager & Accountant Manual

### Q1: How do I record daily kitchen bazar expenses?
1. Go to **Bazar & Expenses** (`/bazar`) and click **Record New Bazar**.
2. Enter the date, total amount, primary category (e.g. *Meat & Fish*, *Vegetables*), and shopping location.
3. Add itemized products (Item name, Quantity, Price) and click **Save Bazar Entry**.
4. The system will immediately update the live estimated meal rate.

### Q2: How do I allocate a room or bed to a new resident member?
1. Open **Rooms & Beds** (`/rooms`).
2. Locate the room with an **AVAILABLE** bed status.
3. Click **Allocate Member**, type the member's full name, and confirm.
4. The bed status automatically shifts to **OCCUPIED**, and the member's monthly rent billing is activated.

### Q3: How do I execute Monthly Account Closing?
1. Navigate to **Mess Admin Area** (`/admin`) and select the **Monthly Closing** tab.
2. Review the aggregated metrics: Total Kitchen Bazar Spent, Total Consumed Meals, and Computed Meal Rate.
3. Click **Execute Monthly Closing**.
4. The system automatically reconciles member balances, closes past vouchers, and produces finalized printable PDF statements.

---

## 3. Platform Super Admin Guide

### Q1: How do I onboard a brand-new mess onto MessMate?
1. Navigate to **Platform Super Admin** (`/super-admin`).
2. Click **Provision New Mess Tenant**.
3. Fill in the Mess Name (e.g. *Shapla Student Mess*), Subdomain slug (`shapla`), Location, and Resident Type.
4. The system automatically creates the tenant, database schema relations, default meal configuration, and sub-portal URL (`shapla.messmate.com`).
