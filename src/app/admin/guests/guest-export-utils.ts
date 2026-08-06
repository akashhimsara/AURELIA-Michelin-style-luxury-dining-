import type { SerializedGuest } from "@/features/admin/actions/guests";

export function exportGuestsToCSV(guests: SerializedGuest[], filename = "aurelia-guests") {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Status",
    "VIP Tier",
    "Total Reservations",
    "Room Stays",
    "Dining Visits",
    "Lifetime Value (£)",
    "Avg Spend (£)",
    "Favorite Room",
    "Loyalty Points",
    "Last Stay",
    "Joined",
    "Email Verified",
  ];

  const rows = guests.map((g) => [
    g.name,
    g.email,
    g.phone ?? "",
    g.status,
    g.vipTier,
    String(g.totalReservations),
    String(g.roomStays),
    String(g.diningVisits),
    g.lifetimeValue.toFixed(2),
    g.avgSpend.toFixed(2),
    g.favoriteRoom ?? "",
    String(g.loyaltyPoints),
    g.lastStay ? new Date(g.lastStay).toLocaleDateString("en-GB") : "",
    new Date(g.createdAt).toLocaleDateString("en-GB"),
    g.emailVerified ? "Yes" : "No",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
