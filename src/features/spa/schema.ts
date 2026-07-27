import { z } from "zod";

export const spaBookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  treatment: z.string().min(1, "Please select a valid spa treatment"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date selected",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:MM)",
  }),
  guests: z.number().min(1, "Minimum of 1 guest").max(4, "Maximum of 4 guests per session"),
  notes: z.string().optional(),
});

export type SpaBookingInput = z.infer<typeof spaBookingSchema>;
