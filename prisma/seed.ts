import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding realistic multi-tenant data into SQLite...");

  // 1. Create Platform Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@messmate.com" },
    update: {},
    create: {
      email: "admin@messmate.com",
      name: "Platform Super Admin",
      phone: "+8801700000000",
      passwordHash: "demo123", // In production hashed with bcrypt
      isSuperAdmin: true,
    },
  });

  // 2. Create Tenant: Green View Student Mess
  const greenView = await prisma.tenant.upsert({
    where: { slug: "green-view" },
    update: {},
    create: {
      name: "Green View Student Mess",
      slug: "green-view",
      description: "Premier academic residence for students and job candidates in Central Dhaka.",
      address: "House 42, Road 4, Farmgate, Tejgaon, Dhaka-1215",
      phone: "+8801819223344",
      email: "contact@greenviewmess.com",
      messType: "STUDENT",
      mealSystem: "FLEXIBLE",
      currency: "BDT",
      primaryColor: "#4f46e5",
      secondaryColor: "#06b6d4",
      isVerified: true,
      mealConfig: {
        create: {
          breakfastEnabled: true,
          lunchEnabled: true,
          dinnerEnabled: true,
          cutoffBreakfastHour: 22,
          cutoffLunchHour: 8,
          cutoffDinnerHour: 16,
          fixedBreakfastCost: 35,
          fixedLunchCost: 65,
          fixedDinnerCost: 65,
          guestMealRate: 85,
        },
      },
    },
  });

  // 3. Create Tenant Users & Memberships
  const usersData = [
    {
      email: "rahim@greenview.com",
      name: "Rahim Ahmed",
      phone: "+8801711223344",
      role: "OWNER",
    },
    {
      email: "tanvir@greenview.com",
      name: "Tanvir Hasan",
      phone: "+8801811556677",
      role: "MEAL_MANAGER",
    },
    {
      email: "kamrul@greenview.com",
      name: "Kamrul Islam",
      phone: "+8801911889900",
      role: "MEMBER",
    },
    {
      email: "sakib@greenview.com",
      name: "Sakib Al Mahmud",
      phone: "+8801611334455",
      role: "MEMBER",
    },
    {
      email: "mehedi@greenview.com",
      name: "Mehedi Hasan",
      phone: "+8801511778899",
      role: "MEMBER",
    },
  ];

  const createdMemberships: any[] = [];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        phone: u.phone,
        passwordHash: "password123",
      },
    });

    const membership = await prisma.membership.upsert({
      where: {
        userId_tenantId: {
          userId: user.id,
          tenantId: greenView.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        tenantId: greenView.id,
        role: u.role,
        status: "ACTIVE",
      },
    });

    createdMemberships.push({ ...membership, user });
  }

  // 4. Create Rooms & Beds
  const room101 = await prisma.room.upsert({
    where: {
      tenantId_roomNumber: {
        tenantId: greenView.id,
        roomNumber: "101",
      },
    },
    update: {},
    create: {
      tenantId: greenView.id,
      roomNumber: "101",
      floor: 1,
      roomType: "SHARED",
      capacity: 2,
      baseRent: 3500,
      facilities: JSON.stringify(["Attached Balcony", "High-speed Wi-Fi", "Separate Study Table", "Ceiling Fan"]),
      isRentableShortTerm: true,
      shortTermDailyRate: 300,
    },
  });

  const bed101A = await prisma.bed.upsert({
    where: { roomId_bedNumber: { roomId: room101.id, bedNumber: "A" } },
    update: {},
    create: {
      roomId: room101.id,
      bedNumber: "A",
      status: "OCCUPIED",
      monthlyRent: 3500,
    },
  });

  const bed101B = await prisma.bed.upsert({
    where: { roomId_bedNumber: { roomId: room101.id, bedNumber: "B" } },
    update: {},
    create: {
      roomId: room101.id,
      bedNumber: "B",
      status: "OCCUPIED",
      monthlyRent: 3500,
    },
  });

  const room102 = await prisma.room.upsert({
    where: {
      tenantId_roomNumber: {
        tenantId: greenView.id,
        roomNumber: "102",
      },
    },
    update: {},
    create: {
      tenantId: greenView.id,
      roomNumber: "102",
      floor: 1,
      roomType: "SHARED",
      capacity: 3,
      baseRent: 3200,
      facilities: JSON.stringify(["Wi-Fi", "Large Window", "Wall Cupboard"]),
      isRentableShortTerm: false,
    },
  });

  const bed102A = await prisma.bed.upsert({
    where: { roomId_bedNumber: { roomId: room102.id, bedNumber: "A" } },
    update: {},
    create: {
      roomId: room102.id,
      bedNumber: "A",
      status: "OCCUPIED",
      monthlyRent: 3200,
    },
  });

  const bed102B = await prisma.bed.upsert({
    where: { roomId_bedNumber: { roomId: room102.id, bedNumber: "B" } },
    update: {},
    create: {
      roomId: room102.id,
      bedNumber: "B",
      status: "AVAILABLE",
      monthlyRent: 3200,
    },
  });

  // 5. Rental Listing for Available Bed
  await prisma.rentalListing.create({
    data: {
      tenantId: greenView.id,
      title: "Clean Window-Side Bed Seat in Farmgate",
      description: "Quiet study-friendly environment for university students or BCS examinees. 3-minute walk to Farmgate metro station.",
      roomType: "SHARED",
      rentMonthly: 3200,
      rentDaily: 250,
      availableFrom: new Date("2026-12-01"),
      isAvailable: true,
      amenities: JSON.stringify(["Wi-Fi", "3-time Meal Facility", "Filter Water", "24/7 Generator", "Daily Cleaning"]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
      ]),
    },
  });

  // 6. Record Bazar Purchases
  const managerMembership = createdMemberships.find((m) => m.role === "MEAL_MANAGER");
  if (managerMembership) {
    const b1 = await prisma.bazarEntry.create({
      data: {
        tenantId: greenView.id,
        shopperMembershipId: managerMembership.id,
        date: "2026-11-18",
        totalAmount: 1850,
        category: "MEAT_FISH",
        notes: "Bought Rui fish 2.5kg and Deshi chicken 2 pieces from Karwan Bazar.",
        isVerified: true,
        verifiedBy: "Rahim Ahmed",
        items: {
          create: [
            { itemName: "Rui Fish (Fresh)", quantity: 2.5, unit: "kg", unitPrice: 380, totalPrice: 950 },
            { itemName: "Deshi Broiler Chicken", quantity: 4.5, unit: "kg", unitPrice: 200, totalPrice: 900 },
          ],
        },
      },
    });

    const b2 = await prisma.bazarEntry.create({
      data: {
        tenantId: greenView.id,
        shopperMembershipId: managerMembership.id,
        date: "2026-11-19",
        totalAmount: 1240,
        category: "VEGETABLE",
        notes: "Vegetables, potato, onion, green chili, and cooking oil.",
        isVerified: true,
        verifiedBy: "Rahim Ahmed",
        items: {
          create: [
            { itemName: "Potato (Alu)", quantity: 10, unit: "kg", unitPrice: 45, totalPrice: 450 },
            { itemName: "Onion (Peyaj)", quantity: 5, unit: "kg", unitPrice: 90, totalPrice: 450 },
            { itemName: "Soybean Oil (Teel)", quantity: 2, unit: "liter", unitPrice: 170, totalPrice: 340 },
          ],
        },
      },
    });
  }

  // 7. Seed Daily Meals for members (November 2026)
  const todayStr = "2026-11-20";
  for (const m of createdMemberships) {
    await prisma.mealEntry.upsert({
      where: {
        tenantId_membershipId_date: {
          tenantId: greenView.id,
          membershipId: m.id,
          date: todayStr,
        },
      },
      update: {},
      create: {
        tenantId: greenView.id,
        membershipId: m.id,
        date: todayStr,
        breakfast: 1,
        lunch: 1,
        dinner: 1,
        isOff: false,
      },
    });
  }

  // 8. Emergency Contacts (National & Local)
  const nationalEmergencies = [
    { name: "National Emergency Helpline (Police / Fire / Ambulance)", serviceType: "POLICE", phone: "999", isNational: true },
    { name: "Government Info & Citizen Services", serviceType: "POLICE_STATION", phone: "333", isNational: true },
    { name: "Fire Service Central Control Room", serviceType: "FIRE_SERVICE", phone: "16163", isNational: true },
    { name: "Health Hotline (Shastho Batayan)", serviceType: "AMBULANCE", phone: "16263", isNational: true },
  ];

  for (const ne of nationalEmergencies) {
    await prisma.emergencyContact.create({
      data: {
        name: ne.name,
        serviceType: ne.serviceType,
        phone: ne.phone,
        isNational: true,
      },
    });
  }

  const localEmergencies = [
    { tenantId: greenView.id, name: "Tejgaon Model Police Station", serviceType: "POLICE_STATION", phone: "+88028143300", address: "Tejgaon, Dhaka" },
    { tenantId: greenView.id, name: "Suhrawardy Medical College Hospital Ambulance", serviceType: "AMBULANCE", phone: "+8801713000000", address: "Sher-e-Bangla Nagar, Dhaka" },
    { tenantId: greenView.id, name: "Al-Razi 24hr Emergency Pharmacy", serviceType: "PHARMACY", phone: "+8801819001122", address: "Farmgate Overbridge" },
    { tenantId: greenView.id, name: "Mess Building Owner (Haji Abul Kashem)", serviceType: "LANDLORD", phone: "+8801712345678", address: "Flat 5A, Green View House" },
    { tenantId: greenView.id, name: "Mess Emergency Electrician (Sohel Bhai)", serviceType: "ELECTRICIAN", phone: "+8801911443322", address: "Tejkunipara, Farmgate" },
  ];

  for (const le of localEmergencies) {
    await prisma.emergencyContact.create({
      data: le,
    });
  }

  // 9. Notices & Announcements
  await prisma.notice.createMany({
    data: [
      {
        tenantId: greenView.id,
        title: "Monthly Mess Meeting & Bazar Rotation Review",
        content: "All members are requested to attend the monthly mess general meeting on Friday at 9:00 PM in the dining room.",
        priority: "IMPORTANT",
      },
      {
        tenantId: greenView.id,
        title: "High-Speed Fiber Internet Upgrade Completed",
        content: "New 100 Mbps dual-band WiFi connection installed. Please contact Tanvir for the new WPA3 password.",
        priority: "NORMAL",
      },
      {
        tenantId: greenView.id,
        title: "Water Tank Cleaning Notice (Sunday 10 AM - 1 PM)",
        content: "Water supply will remain suspended for 3 hours on Sunday due to regular overhead tank hygiene cleaning.",
        priority: "URGENT",
      },
    ],
  });

  // 10. Invoices & Ledger sample
  const kamrulMember = createdMemberships.find((m) => m.user.email === "kamrul@greenview.com");
  if (kamrulMember) {
    const inv = await prisma.invoice.create({
      data: {
        tenantId: greenView.id,
        membershipId: kamrulMember.id,
        monthYear: "2026-11",
        invoiceNumber: "INV-GV-202611-001",
        totalAmount: 6450,
        paidAmount: 5000,
        status: "PARTIAL",
        dueDate: new Date("2026-11-25"),
        items: {
          create: [
            { description: "Seat Rent (Room 101, Bed A)", category: "RENT", amount: 3500 },
            { description: "Advance Meal Deposit (Estimated 50 meals)", category: "MEAL", amount: 2000 },
            { description: "High-Speed WiFi & Router Fee", category: "WIFI", amount: 250 },
            { description: "Cook & Maid Salary Shared Split", category: "MAID", amount: 500 },
            { description: "Waste Management Fee", category: "TRASH", amount: 200 },
          ],
        },
      },
    });

    await prisma.payment.create({
      data: {
        tenantId: greenView.id,
        membershipId: kamrulMember.id,
        invoiceId: inv.id,
        amount: 5000,
        method: "BKASH",
        trxId: "BKH9123891823",
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: "Tanvir Hasan",
      },
    });

    await prisma.ledgerEntry.createMany({
      data: [
        {
          tenantId: greenView.id,
          membershipId: kamrulMember.id,
          type: "DEBIT",
          category: "RENT_CHARGE",
          amount: 6450,
          balanceAfter: -6450,
          description: "November 2026 Monthly Invoice INV-GV-202611-001",
        },
        {
          tenantId: greenView.id,
          membershipId: kamrulMember.id,
          type: "CREDIT",
          category: "PAYMENT_RECEIVED",
          amount: 5000,
          balanceAfter: -1450,
          description: "bKash Payment TrxID: BKH9123891823",
        },
      ],
    });
  }

  console.log("Seeding completed successfully on D: drive!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
