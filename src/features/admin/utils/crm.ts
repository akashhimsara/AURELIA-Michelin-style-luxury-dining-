interface ReservationItemInput {
  finalAmount: number | null;
  guests: number;
}

export function calculateLTV(reservations: ReservationItemInput[]): number {
  return reservations.reduce((total, res) => {
    const estimatedSpend = res.finalAmount !== null ? Number(res.finalAmount) : (res.guests * 75);
    return total + estimatedSpend;
  }, 0);
}

export interface LoyaltyTierInfo {
  label: string;
  classes: string;
}

export function getLoyaltyTier(ltv: number): LoyaltyTierInfo {
  if (ltv >= 2000) {
    return {
      label: "Elite Royal",
      classes: "bg-amber-950/40 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    };
  }
  if (ltv >= 1000) {
    return {
      label: "Gold Partner",
      classes: "bg-gold/10 text-gold border border-gold/30",
    };
  }
  if (ltv >= 500) {
    return {
      label: "Silver Patron",
      classes: "bg-zinc-800/50 text-zinc-300 border border-zinc-500/30",
    };
  }
  return {
    label: "Standard Guest",
    classes: "bg-zinc-950/50 text-zinc-500 border border-zinc-800",
  };
}
