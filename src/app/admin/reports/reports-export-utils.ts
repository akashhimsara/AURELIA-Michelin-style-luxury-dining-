import type { RevenueTrendPoint, TopGuestRow, TopDishRow } from "@/features/admin/actions/reports";

export function exportReportToCSV(
  data: RevenueTrendPoint[],
  filename = "aurelia-revenue-analytics-report"
) {
  const headers = ["Date", "Rooms & Suites (£)", "Fine Dining (£)", "Spa & Wellness (£)", "Weddings & Events (£)", "Total Revenue (£)"];

  const rows = data.map((d) => [
    d.date,
    d.rooms.toFixed(2),
    d.dining.toFixed(2),
    d.spa.toFixed(2),
    d.weddings.toFixed(2),
    d.total.toFixed(2),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportTopGuestsToCSV(
  guests: TopGuestRow[],
  filename = "aurelia-top-guests-report"
) {
  const headers = ["Guest Name", "Email", "Total Spend (£)", "Total Bookings", "VIP Tier"];

  const rows = guests.map((g) => [
    g.name,
    g.email,
    g.totalSpent.toFixed(2),
    String(g.totalBookings),
    g.vipTier,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function triggerPrintPDFReport() {
  window.print();
}
