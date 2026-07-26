import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  guests: z.number().min(1, "Minimum of 1 guest").max(10, "Maximum of 10 guests"),
});

export type ReservationFormInput = z.infer<typeof reservationSchema>;
