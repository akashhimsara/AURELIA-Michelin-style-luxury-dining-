export type AdminRole =
  | "super_admin"
  | "hotel_manager"
  | "reception"
  | "restaurant_manager"
  | "spa_manager"
  | "wedding_manager"
  | "finance"
  | "housekeeping"
  | "marketing";

// Map modules to permitted roles
const PERMISSION_MAP: Record<string, AdminRole[]> = {
  dashboard: ["super_admin", "hotel_manager", "reception", "restaurant_manager", "spa_manager", "wedding_manager", "finance", "housekeeping", "marketing"],
  reservations: ["super_admin", "hotel_manager", "reception"],
  guests: ["super_admin", "hotel_manager", "reception"],
  rooms: ["super_admin", "hotel_manager", "reception", "housekeeping"],
  restaurant: ["super_admin", "hotel_manager", "restaurant_manager"],
  spa: ["super_admin", "hotel_manager", "spa_manager"],
  wedding: ["super_admin", "hotel_manager", "wedding_manager"],
  events: ["super_admin", "hotel_manager", "wedding_manager"],
  staff: ["super_admin", "hotel_manager"],
  housekeeping: ["super_admin", "hotel_manager", "housekeeping"],
  finance: ["super_admin", "hotel_manager", "finance"],
  marketing: ["super_admin", "hotel_manager", "marketing"],
  reports: ["super_admin", "hotel_manager", "finance", "marketing"],
  settings: ["super_admin", "hotel_manager"],
  "system-logs": ["super_admin"],
};

export function hasPermission(role: string, moduleName: string): boolean {
  const allowedRoles = PERMISSION_MAP[moduleName.toLowerCase()];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role as AdminRole);
}
