"use client";

import React, { useState, useTransition, useEffect } from "react";
import { X, Plus, Save, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { createRoom, updateRoom } from "@/features/admin/actions/rooms";
import type { SerializedRoom } from "@/features/admin/actions/rooms";
import { useRouter } from "next/navigation";

interface FacilityOption {
  id: string;
  name: string;
}

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: SerializedRoom | null;
  facilities: FacilityOption[];
}

const PRESET_IMAGES = [
  { label: "Ocean Villa", url: "/room-ocean.png" },
  { label: "Penthouse Suite", url: "/room-penthouse.png" },
  { label: "Heritage Chamber", url: "/room-heritage.png" },
];

export function RoomFormModal({
  isOpen,
  onClose,
  roomToEdit,
  facilities,
}: RoomFormModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [pricePerNight, setPricePerNight] = useState<number>(500);
  const [capacity, setCapacity] = useState<number>(2);
  const [imageUrl, setImageUrl] = useState("/room-ocean.png");
  const [description, setDescription] = useState("");
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (roomToEdit) {
      setName(roomToEdit.name);
      setPricePerNight(roomToEdit.pricePerNight);
      setCapacity(roomToEdit.capacity);
      setImageUrl(roomToEdit.imageUrl);
      setDescription(roomToEdit.description);
      setSelectedFacilityIds(roomToEdit.facilities.map((f) => f.id));
    } else {
      setName("");
      setPricePerNight(650);
      setCapacity(2);
      setImageUrl("/room-ocean.png");
      setDescription("");
      setSelectedFacilityIds([]);
    }
    setFeedback(null);
  }, [roomToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleFacility = (id: string) => {
    setSelectedFacilityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || pricePerNight <= 0) return;

    setFeedback(null);
    startTransition(async () => {
      let res;
      if (roomToEdit) {
        res = await updateRoom(roomToEdit.id, {
          name,
          description,
          pricePerNight,
          capacity,
          imageUrl,
          facilityIds: selectedFacilityIds,
        });
      } else {
        res = await createRoom({
          name,
          description,
          pricePerNight,
          capacity,
          imageUrl,
          facilityIds: selectedFacilityIds,
        });
      }

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setFeedback(res.message || "Failed to save room.");
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="admin-card border rounded-sm w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              {roomToEdit ? "Edit Suite Configurations" : "New Luxury Suite"}
            </h2>
            <button onClick={onClose} className="p-1 opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[12px]">
            {feedback && (
              <div className="p-2.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400">
                {feedback}
              </div>
            )}

            {/* Suite Name */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Suite Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Monarch Villa"
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
              />
            </div>

            {/* Price & Capacity Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Base Rate (£ / Night)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Max Guest Capacity
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono"
                />
              </div>
            </div>

            {/* Image Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium flex items-center gap-1">
                <ImageIcon size={12} /> Image URL / Presets
              </label>
              <div className="flex gap-2 mb-1">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`text-[10px] px-2 py-1 rounded-sm border transition-colors ${
                      imageUrl === preset.url
                        ? "bg-amber-500/20 text-amber-500 border-amber-500/40 font-medium"
                        : "border-current/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/room-ocean.png"
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono text-[11px]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Description & Architectural Features
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the layout, panoramic sightlines, and luxury inclusions..."
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 resize-none"
              />
            </div>

            {/* Facilities / Amenities Checkboxes */}
            {facilities.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-current/5">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Amenities & Bespoke Facilities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {facilities.map((fac) => {
                    const isChecked = selectedFacilityIds.includes(fac.id);
                    return (
                      <button
                        type="button"
                        key={fac.id}
                        onClick={() => toggleFacility(fac.id)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-[11px] text-left transition-colors ${
                          isChecked
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 font-medium"
                            : "border-current/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center text-[9px] ${
                          isChecked ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold" : "border-current/30"
                        }`}>
                          {isChecked ? "✓" : ""}
                        </span>
                        <span className="truncate">{fac.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-sm border border-current/10 text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2 rounded-sm bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {roomToEdit ? "Update Suite" : "Create Suite"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
