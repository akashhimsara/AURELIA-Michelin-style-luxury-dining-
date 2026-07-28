import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  nationality: z.string().min(2, "Nationality must be specified").or(z.string().length(0)).nullable(),
  emergencyContact: z.string().min(5, "Emergency contact details must be specified").or(z.string().length(0)).nullable(),
  pillowType: z.string().nullable(),
  dietaryNotes: z.string().nullable(),
  avatarUrl: z.string().url("Invalid avatar image URL").or(z.string().length(0)).nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
