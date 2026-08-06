import type { SerializedTransaction, MonthlyReportRow } from "@/features/admin/actions/finance";

export function exportTransactionsToCSV(
  transactions: SerializedTransaction[],
  filename = "aurelia-financial-ledger"
) {
  const headers = [
    "Transaction Ref",
    "Invoice Ref",
    "Guest Name",
    "Guest Email",
    "Category",
    "Description",
    "Date",
    "Payment Method",
    "Stripe Session ID",
    "Gross Amount (£)",
    "Net Amount (£)",
    "VAT 20% (£)",
    "Payment Status",
  ];

  const rows = transactions.map((t) => [
    t.transactionRef,
    t.invoiceRef,
    t.guestName,
    t.guestEmail,
    t.type,
    t.description,
    new Date(t.date).toLocaleDateString("en-GB"),
    t.paymentMethod,
    t.stripeSessionId ?? "N/A",
    t.grossAmount.toFixed(2),
    t.netAmount.toFixed(2),
    t.vatAmount.toFixed(2),
    t.paymentStatus,
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

export function exportMonthlyReportToCSV(
  reports: MonthlyReportRow[],
  filename = "aurelia-monthly-financial-report"
) {
  const headers = [
    "Month",
    "Gross Revenue (£)",
    "Net Revenue (£)",
    "20% UK VAT (£)",
    "Operating Expenses (£)",
    "Net Operating Profit (£)",
    "Profit Margin (%)",
  ];

  const rows = reports.map((r) => [
    r.month,
    r.grossRevenue.toFixed(2),
    r.netRevenue.toFixed(2),
    r.vatCollected.toFixed(2),
    r.expenses.toFixed(2),
    r.netProfit.toFixed(2),
    `${r.marginPct}%`,
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

export function triggerPrintPDF() {
  window.print();
}
