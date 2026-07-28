import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid check-in date",
  }),
  checkOutDate: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  guests: z.number().min(1, "Minimum of 1 guest").max(10, "Maximum of 10 guests"),
  children: z.number().min(0, "Minimum of 0 children").max(6, "Maximum of 6 children").optional().default(0),
  roomId: z.string().optional().nullable(),
  restaurantId: z.string().optional().nullable(),
  promoCode: z.string().optional().nullable(),
}).refine((data) => {
  if (data.roomId) {
    if (!data.checkOutDate) return false;
    const checkIn = new Date(data.date).getTime();
    const checkOut = new Date(data.checkOutDate).getTime();
    return checkOut > checkIn;
  }
  return true;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

export type ReservationFormInput = z.infer<typeof reservationSchema>;
