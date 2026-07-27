"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReservationRow } from "./reservation-row";
import { ReservationModal } from "./reservation-modal";

interface RoomItem {
  id: string;
  name: string;
}

interface ReservationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string | null;
  guests: number;
  status: string;
  roomId: string | null;
}

interface ReservationsDashboardProps {
  reservations: ReservationItem[];
  rooms: RoomItem[];
}

export function ReservationsDashboard({ reservations, rooms }: ReservationsDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<ReservationItem | null>(null);

  const handleCreateOpen = () => {
    setActiveReservation(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (reservation: ReservationItem) => {
    setActiveReservation(reservation);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveReservation(null);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top bar */}
      <div className="flex justify-between items-center bg-black/40 border border-gold/10 p-4 rounded-sm luxury-glass">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gold font-sans block">
            System Operations
          </span>
          <span className="text-xs text-zinc-400 font-sans font-light">
            Active Bookings Count: {reservations.length} items logged
          </span>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleCreateOpen}
          className="flex items-center gap-1.5 text-xs py-2 px-4"
        >
          <Plus size={12} /> New Reservation
        </Button>
      </div>

      {/* Database bookings table */}
      <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
        {reservations.length === 0 ? (
          <div className="text-center py-20 font-sans">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              No reservations found
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 font-light">
              Table bookings will display here once customers confirm reservations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  <th className="p-4">Guest</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time / Suite</th>
                  <th className="p-4 text-center">Party</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <ReservationRow
                    key={res.id}
                    reservation={res}
                    onEdit={handleEditOpen}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation / Editing Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        rooms={rooms}
        reservation={activeReservation}
      />
    </div>
  );
}
