import { z } from "zod";

export const privateDiningSalons = {
  "oak-table": { name: "The Chef's Oak Table", maxCapacity: 12, pricePerGuest: 150 },
  "glasshouse": { name: "The Botanical Glasshouse Room", maxCapacity: 30, pricePerGuest: 120 },
  "wine-crypt": { name: "The Vintage Wine Crypt", maxCapacity: 8, pricePerGuest: 200 },
};

export const privateDiningSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  roomSelection: z.enum(["oak-table", "glasshouse", "wine-crypt"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date selected",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:MM)",
  }),
  guests: z.number().min(1, "Minimum of 1 guest"),
  sommelierService: z.boolean(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  const salon = privateDiningSalons[data.roomSelection];
  if (salon) {
    if (data.guests > salon.maxCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${salon.name} allows a maximum of ${salon.maxCapacity} guests.`,
        path: ["guests"],
      });
    }
  }
});

export type PrivateDiningInput = z.infer<typeof privateDiningSchema>;
