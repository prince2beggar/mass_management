"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Building,
  Plus,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  DoorOpen,
  Bed as BedIcon,
  Layers,
  Sparkles,
  Wifi,
  Wind,
  Bath,
  Sun,
  X,
} from "lucide-react";

interface Bed {
  id: string;
  bedNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  monthlyRent: number;
  occupant?: string;
}

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  capacity: number;
  facilities: string[];
  beds: Bed[];
}

export default function RoomsPage() {
  const { t, role, showToast } = useApp();

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "r-101",
      roomNumber: "101",
      floor: 1,
      type: "SHARED (2 Beds)",
      capacity: 2,
      facilities: ["Attached Balcony", "High-speed Wi-Fi", "Separate Study Table"],
      beds: [
        { id: "b-101a", bedNumber: "Bed A", status: "OCCUPIED", monthlyRent: 3500, occupant: "Kamrul Islam" },
        { id: "b-101b", bedNumber: "Bed B", status: "OCCUPIED", monthlyRent: 3500, occupant: "Sakib Al Mahmud" },
      ],
    },
    {
      id: "r-102",
      roomNumber: "102",
      floor: 1,
      type: "SHARED (3 Beds)",
      capacity: 3,
      facilities: ["Wi-Fi", "Large Window", "Wall Cupboard"],
      beds: [
        { id: "b-102a", bedNumber: "Bed A", status: "OCCUPIED", monthlyRent: 3200, occupant: "Mehedi Hasan" },
        { id: "b-102b", bedNumber: "Bed B", status: "AVAILABLE", monthlyRent: 3200 },
        { id: "b-102c", bedNumber: "Bed C", status: "OCCUPIED", monthlyRent: 3200, occupant: "Tanvir Hasan" },
      ],
    },
    {
      id: "r-201",
      roomNumber: "201",
      floor: 2,
      type: "SINGLE MASTER SUITE",
      capacity: 1,
      facilities: ["Attached Bathroom", "South-facing Balcony", "Air Cooler Outlet"],
      beds: [
        { id: "b-201a", bedNumber: "Master Bed", status: "OCCUPIED", monthlyRent: 6500, occupant: "Rahim Ahmed" },
      ],
    },
  ]);

  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<{ roomNumber: string; bed: Bed } | null>(null);
  const [newMemberName, setNewMemberName] = useState("");

  const handleOpenAllocate = (roomNumber: string, bed: Bed) => {
    setSelectedBed({ roomNumber, bed });
    setAllocateModalOpen(true);
  };

  const submitAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !selectedBed) return;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === selectedBed.roomNumber) {
          return {
            ...r,
            beds: r.beds.map((b) =>
              b.id === selectedBed.bed.id
                ? { ...b, status: "OCCUPIED", occupant: newMemberName }
                : b
            ),
          };
        }
        return r;
      })
    );

    showToast(`Allocated ${newMemberName} to ${selectedBed.roomNumber} - ${selectedBed.bed.bedNumber}!`, "success");
    setAllocateModalOpen(false);
    setNewMemberName("");
  };

  const vacateBed = (roomNumber: string, bedId: string, occupantName?: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          return {
            ...r,
            beds: r.beds.map((b) =>
              b.id === bedId ? { ...b, status: "AVAILABLE", occupant: undefined } : b
            ),
          };
        }
        return r;
      })
    );
    showToast(`Vacated bed. Seat is now available for new booking.`, "info");
  };

  // Calculations
  const allBeds = rooms.flatMap((r) => r.beds);
  const totalBeds = allBeds.length;
  const occupiedCount = allBeds.filter((b) => b.status === "OCCUPIED").length;
  const availableCount = allBeds.filter((b) => b.status === "AVAILABLE").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Building className="w-4 h-4" />
            <span>Accommodation & Capacity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.rooms.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual room layouts, seat allocation matrix, and real-time occupancy status.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Rooms</span>
          <div className="text-2xl font-black text-slate-900">{rooms.length} Units</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">2 Floors in Building</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Bed Capacity</span>
          <div className="text-2xl font-black text-slate-900">{totalBeds} Seats</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Max Member Density</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Occupied Seats</span>
          <div className="text-2xl font-black text-indigo-600">{occupiedCount} Seats</div>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
            {Math.round((occupiedCount / totalBeds) * 100)}% Occupancy
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Available for Rent</span>
          <div className="text-2xl font-black text-emerald-600">{availableCount} Vacant</div>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">Ready for Instant Move-in</span>
        </div>
      </div>

      {/* Interactive Visual Floor Plan */}
      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center border border-indigo-100">
                  {room.roomNumber}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Room {room.roomNumber} • {room.type}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Floor {room.floor} • Capacity: {room.capacity} Persons
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 self-start">
                {room.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Beds Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {room.beds.map((bed) => {
                const isOccupied = bed.status === "OCCUPIED";
                return (
                  <div
                    key={bed.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      isOccupied
                        ? "bg-slate-50 border-slate-200"
                        : "bg-emerald-50/70 border-emerald-200 shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <BedIcon className="w-4 h-4 text-indigo-600" />
                          <span>{bed.bedNumber}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOccupied
                              ? "bg-slate-200 text-slate-700"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {bed.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mb-1">
                        Monthly Rent: <span className="font-bold text-slate-900">৳ {bed.monthlyRent}</span>
                      </div>

                      {isOccupied ? (
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                          <span className="text-[10px] text-slate-400 block">Occupied by:</span>
                          <span className="font-bold text-slate-800">{bed.occupant}</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-white/80 border border-emerald-200 text-xs text-emerald-700 font-semibold">
                          Seat is currently vacant and open for rent
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      {isOccupied ? (
                        (role === "OWNER" || role === "SUPER_ADMIN") && (
                          <button
                            onClick={() => vacateBed(room.roomNumber, bed.id, bed.occupant)}
                            className="w-full py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                          >
                            Vacate Seat
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleOpenAllocate(room.roomNumber, bed)}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          Allocate Member
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Modal */}
      {allocateModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Allocate Seat: Room {selectedBed.roomNumber} ({selectedBed.bed.bedNumber})
              </h3>
              <button
                onClick={() => setAllocateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitAllocation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Monthly Seat Rent</label>
                <input
                  type="text"
                  disabled
                  value={`৳ ${selectedBed.bed.monthlyRent} / month`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">New Member Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdullah Al Mamun"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAllocateModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
