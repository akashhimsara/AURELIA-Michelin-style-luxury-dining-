import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  time: z.string().optional().nullable(),
  guests: z.number().min(1, "Minimum of 1 guest").max(10, "Maximum of 10 guests"),
  roomId: z.string().optional().nullable(),
  restaurantId: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
});

export type ReservationFormInput = z.infer<typeof reservationSchema>;
