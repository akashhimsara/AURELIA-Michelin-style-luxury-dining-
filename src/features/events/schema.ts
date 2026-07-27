import { z } from "zod";

export const eventLimits = {
  wedding: { min: 50, max: 300, label: "Imperial Pavilion" },
  corporate: { min: 20, max: 500, label: "Grand Ballroom" },
  private: { min: 10, max: 100, label: "Glasshouse Canopy" },
};

export const eventInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  eventType: z.enum(["wedding", "corporate", "private"]),
  guests: z.number().min(1, "Minimum of 1 guest"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  message: z.string().min(10, "Please describe your event requirements (min 10 chars)"),
}).superRefine((data, ctx) => {
  const limit = eventLimits[data.eventType];
  if (limit) {
    if (data.guests < limit.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${limit.label} capacity requires at least ${limit.min} guests.`,
        path: ["guests"],
      });
    }
    if (data.guests > limit.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${limit.label} capacity cannot exceed ${limit.max} guests.`,
        path: ["guests"],
      });
    }
  }
});

export type EventInquiryInput = z.infer<typeof eventInquirySchema>;
