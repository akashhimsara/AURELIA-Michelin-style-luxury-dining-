import type { SerializedReservation } from "@/features/admin/actions/reservations";

export function exportToCSV(reservations: SerializedReservation[], filename = "aurelia-reservations") {
  const headers = [
    "Ref ID",
    "Guest Name",
    "Email",
    "Phone",
    "Type",
    "Arrangement",
    "Check-in",
    "Check-out",
    "Guests",
    "Amount (£)",
    "Payment Status",
    "Reservation Status",
    "Created At",
  ];

  const rows = reservations.map((r) => [
    `AUR-${r.id.slice(0, 8).toUpperCase()}`,
    r.name,
    r.email,
    r.phone ?? "",
    r.type,
    r.bookedRoomName ?? (r.type === "dining" ? "Fine Dining Table" : r.type),
    new Date(r.date).toLocaleDateString("en-GB"),
    r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString("en-GB") : "",
    String(r.guests),
    r.finalAmount ? r.finalAmount.toFixed(2) : "",
    r.paymentStatus,
    r.status,
    new Date(r.createdAt).toLocaleDateString("en-GB"),
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

export function exportToPDF() {
  // Inject a print stylesheet that shows only the table
  const style = document.createElement("style");
  style.id = "aurelia-print-style";
  style.textContent = `
    @media print {
      body > * { display: none !important; }
      #reservations-print-table { display: block !important; }
      #reservations-print-table { font-family: serif; font-size: 11px; color: #000; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
      th { background: #f5f5f5; font-weight: 700; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => {
    document.head.removeChild(style);
  }, 1000);
}
