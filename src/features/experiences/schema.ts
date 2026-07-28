import { z } from "zod";

export const experiencesCatalog = {
  "art-tour": { name: "Royal Mayfair Art Tour", pricePerGuest: 250 },
  "helicopter": { name: "Helicopter Cotswolds Flight", pricePerGuest: 1200 },
  "cigar-masterclass": { name: "Vintage Cognac & Cigar Masterclass", pricePerGuest: 180 },
};

export const experienceBookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  experience: z.enum(["art-tour", "helicopter", "cigar-masterclass"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date selected",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:MM)",
  }),
  guests: z.number().min(1, "Minimum of 1 guest").max(8, "Maximum of 8 guests per reservation"),
  notes: z.string().optional().nullable(),
});

export type ExperienceBookingInput = z.infer<typeof experienceBookingSchema>;
