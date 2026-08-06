"use server";

import { db } from "@/lib/db";

export interface DashboardData {
  // KPI metrics
  todayRevenue: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  restaurantRevenue: number;
  spaRevenue: number;
  weddingRevenue: number;
  totalGuests: number;
  pendingCount: number;
  confirmedCount: number;

  // Lists
  upcomingArrivals: Array<{
    id: string;
    name: string;
    email: string;
    bookedRoomName: string | null;
    date: string;
    checkOutDate: string | null;
    guests: number;
  }>;
  upcomingDepartures: Array<{
    id: string;
    name: string;
    email: string;
    bookedRoomName: string | null;
    date: string;
    checkOutDate: string | null;
    guests: number;
  }>;
  recentReservations: Array<{
    id: string;
    name: string;
    email: string;
    bookedRoomName: string | null;
    date: string;
    finalAmount: number | null;
    status: string;
    roomId: string | null;
    createdAt: string;
  }>;
  latestPayments: Array<{
    id: string;
    name: string;
    email: string;
    finalAmount: number;
    paymentStatus: string;
    bookedRoomName: string | null;
    createdAt: string;
  }>;
  pendingTasks: Array<{
    id: string;
    name: string;
    email: string;
    bookedRoomName: string | null;
    date: string;
    status: string;
    roomId: string | null;
    createdAt: string;
  }>;
  notifications: Array<{
    id: string;
    type: "message" | "reservation";
    title: string;
    body: string;
    time: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: "reservation" | "message";
    title: string;
    detail: string;
    status: string;
    time: string;
  }>;

  // Chart data
  revenueChart: Array<{ date: string; revenue: number }>;
  occupancyChart: Array<{ date: string; occupancy: number }>;
  topRooms: Array<{ name: string; bookings: number; revenue: number }>;
}

export async function getAdminDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const next7Days = new Date(now);
  next7Days.setDate(next7Days.getDate() + 7);

  const first30DaysAgo = new Date(now);
  first30DaysAgo.setDate(first30DaysAgo.getDate() - 29);
  first30DaysAgo.setHours(0, 0, 0, 0);

  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Run all queries in parallel
  const [
    todayRevenueAgg,
    totalRooms,
    todayRoomOccupied,
    todayCheckInsRaw,
    todayCheckOutsRaw,
    restaurantRevenueAgg,
    totalGuests,
    pendingCount,
    confirmedCount,
    upcomingArrivalsRaw,
    upcomingDeparturesRaw,
    recentReservationsRaw,
    latestPaymentsRaw,
    pendingTasksRaw,
    unreadMessages,
    pendingReservationsForNotif,
    recentReservationsActivity,
    recentMessages,
    last30DaysReservations,
    topRoomsRaw,
  ] = await Promise.all([
    // Today's Revenue
    db.reservation.aggregate({
      _sum: { finalAmount: true },
      where: {
        status: "confirmed",
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),
    // Total rooms for occupancy calculation
    db.room.count(),
    // Rooms occupied today
    db.reservation.count({
      where: {
        roomId: { not: null },
        status: "confirmed",
        date: { lte: now },
        checkOutDate: { gte: now },
      },
    }),
    // Today's check-ins
    db.reservation.findMany({
      where: {
        roomId: { not: null },
        status: "confirmed",
        date: { gte: startOfToday, lte: endOfToday },
      },
      select: { id: true },
    }),
    // Today's check-outs
    db.reservation.findMany({
      where: {
        roomId: { not: null },
        status: "confirmed",
        checkOutDate: { gte: startOfToday, lte: endOfToday },
      },
      select: { id: true },
    }),
    // Restaurant revenue this month (no roomId = dining)
    db.reservation.aggregate({
      _sum: { finalAmount: true },
      where: {
        roomId: null,
        status: "confirmed",
        date: { gte: firstOfMonth },
      },
    }),
    // Total guests
    db.user.count(),
    // Pending reservations
    db.reservation.count({ where: { status: "pending" } }),
    // Confirmed reservations
    db.reservation.count({ where: { status: "confirmed" } }),
    // Upcoming arrivals (next 7 days, confirmed rooms)
    db.reservation.findMany({
      where: {
        roomId: { not: null },
        status: "confirmed",
        date: { gte: startOfToday, lte: next7Days },
      },
      orderBy: { date: "asc" },
      take: 8,
    }),
    // Upcoming departures (next 7 days)
    db.reservation.findMany({
      where: {
        roomId: { not: null },
        status: "confirmed",
        checkOutDate: { gte: startOfToday, lte: next7Days },
      },
      orderBy: { checkOutDate: "asc" },
      take: 8,
    }),
    // Recent reservations
    db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    // Latest payments (confirmed with amount)
    db.reservation.findMany({
      where: { finalAmount: { not: null }, status: "confirmed" },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    // Pending tasks (pending reservations)
    db.reservation.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      take: 10,
    }),
    // Unread messages
    db.message.findMany({
      where: { status: "unread" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Pending reservations for notifications
    db.reservation.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, createdAt: true, bookedRoomName: true },
    }),
    // Recent reservation activity
    db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    // Recent messages for activity
    db.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // Last 30 days of reservations for charts
    db.reservation.findMany({
      where: {
        status: "confirmed",
        date: { gte: first30DaysAgo },
      },
      select: { date: true, finalAmount: true, roomId: true, checkOutDate: true },
    }),
    // Top rooms by booking count
    db.reservation.groupBy({
      by: ["bookedRoomName"],
      where: { roomId: { not: null }, status: "confirmed", bookedRoomName: { not: null } },
      _count: { id: true },
      _sum: { finalAmount: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  // Process occupancy rate
  const totalRoomsCount = totalRooms || 48;
  const occupancyRate = totalRoomsCount > 0
    ? Math.round((todayRoomOccupied / totalRoomsCount) * 100)
    : 0;

  // Build revenue chart (last 30 days, daily)
  const revenueByDay: Record<string, number> = {};
  const occupancyByDay: Record<string, number> = {};

  // Initialize all 30 days
  for (let i = 0; i < 30; i++) {
    const d = new Date(first30DaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    revenueByDay[key] = 0;
    occupancyByDay[key] = 0;
  }

  // Aggregate daily revenue
  for (const r of last30DaysReservations) {
    const key = r.date.toISOString().split("T")[0];
    if (key in revenueByDay) {
      revenueByDay[key] += Number(r.finalAmount || 0);
    }
    // Count occupancy for room reservations
    if (r.roomId && r.checkOutDate) {
      const start = r.date;
      const end = r.checkOutDate;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dk = d.toISOString().split("T")[0];
        if (dk in occupancyByDay) {
          occupancyByDay[dk] = Math.min(100, (occupancyByDay[dk] || 0) + Math.round(100 / totalRoomsCount));
        }
      }
    }
  }

  const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    revenue: Math.round(revenue),
  }));

  const occupancyChart = Object.entries(occupancyByDay).map(([date, occupancy]) => ({
    date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    occupancy,
  }));

  // Top rooms
  const topRooms = topRoomsRaw.map((r) => ({
    name: r.bookedRoomName || "Unknown Suite",
    bookings: r._count.id,
    revenue: Number(r._sum.finalAmount || 0),
  }));

  // Notifications
  const notifications = [
    ...unreadMessages.map((m) => ({
      id: m.id,
      type: "message" as const,
      title: `New message from ${m.name}`,
      body: m.subject,
      time: m.createdAt.toISOString(),
    })),
    ...pendingReservationsForNotif.map((r) => ({
      id: r.id,
      type: "reservation" as const,
      title: `Pending approval: ${r.name}`,
      body: r.bookedRoomName || "Dining reservation",
      time: r.createdAt.toISOString(),
    })),
  ].slice(0, 8);

  // Recent activity combined
  const activityItems = [
    ...recentReservationsActivity.map((r) => ({
      id: r.id,
      type: "reservation" as const,
      title: r.name,
      detail: r.bookedRoomName || "Dining Table",
      status: r.status,
      time: r.createdAt.toISOString(),
    })),
    ...recentMessages.map((m) => ({
      id: m.id,
      type: "message" as const,
      title: m.name,
      detail: m.subject,
      status: m.status,
      time: m.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  return {
    todayRevenue: Number(todayRevenueAgg._sum.finalAmount || 0),
    occupancyRate,
    todayCheckIns: todayCheckInsRaw.length,
    todayCheckOuts: todayCheckOutsRaw.length,
    restaurantRevenue: Number(restaurantRevenueAgg._sum.finalAmount || 0),
    spaRevenue: 0,
    weddingRevenue: 0,
    totalGuests,
    pendingCount,
    confirmedCount,

    upcomingArrivals: upcomingArrivalsRaw.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      bookedRoomName: r.bookedRoomName,
      date: r.date.toISOString(),
      checkOutDate: r.checkOutDate?.toISOString() || null,
      guests: r.guests,
    })),
    upcomingDepartures: upcomingDeparturesRaw.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      bookedRoomName: r.bookedRoomName,
      date: r.date.toISOString(),
      checkOutDate: r.checkOutDate?.toISOString() || null,
      guests: r.guests,
    })),
    recentReservations: recentReservationsRaw.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      bookedRoomName: r.bookedRoomName,
      date: r.date.toISOString(),
      finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
      status: r.status,
      roomId: r.roomId,
      createdAt: r.createdAt.toISOString(),
    })),
    latestPayments: latestPaymentsRaw
      .filter((r) => r.finalAmount !== null)
      .map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        finalAmount: Number(r.finalAmount!),
        paymentStatus: r.paymentStatus,
        bookedRoomName: r.bookedRoomName,
        createdAt: r.createdAt.toISOString(),
      })),
    pendingTasks: pendingTasksRaw.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      bookedRoomName: r.bookedRoomName,
      date: r.date.toISOString(),
      status: r.status,
      roomId: r.roomId,
      createdAt: r.createdAt.toISOString(),
    })),
    notifications,
    recentActivity: activityItems,
    revenueChart,
    occupancyChart,
    topRooms,
  };
}
