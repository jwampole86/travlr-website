import { addDays, differenceInCalendarDays, getDay, getMonth, isValid, parseISO, startOfDay } from "date-fns";

// Desert vacation-rental seasonal multipliers.
// Peak: Coachella / spring break (Mar–Apr) & holidays (Nov–Dec).
// Off-season summer (Jun–Sep) is discounted; weekends carry a premium otherwise.
function nightMultiplier(date) {
  const month = getMonth(date) + 1; // 1-12
  const dow = getDay(date); // 0=Sun … 6=Sat

  if ([3, 4].includes(month)) return { multiplier: 1.5, label: "Peak Season" };
  if ([11, 12].includes(month)) return { multiplier: 1.6, label: "Holiday Season" };
  if (month === 2) return { multiplier: 1.3, label: "Presidents' Week" };

  if ([6, 7, 8, 9].includes(month)) {
    if (dow === 5 || dow === 6) return { multiplier: 1.0, label: "Off-Season Weekend" };
    return { multiplier: 0.85, label: "Off-Season" };
  }

  if (dow === 5 || dow === 6) return { multiplier: 1.2, label: "Weekend" };
  return { multiplier: 1, label: "Standard" };
}

/**
 * Date-based stay pricing.
 * Each night is priced according to its season / day-of-week multiplier,
 * mirroring how the live TRAVLR search results vary rates by date.
 *
 * @returns { nights, total, rackTotal, avgRate } or null when dates are missing.
 */
export function calculateStayPricing(pricePerNight, rackRatePerNight, arrival, departure) {
  if (!arrival || !departure || !pricePerNight) return null;
  const toLocalDay = (value) => {
    if (value instanceof Date) return startOfDay(value);
    if (typeof value === "string") return startOfDay(parseISO(value));
    return startOfDay(new Date(value));
  };
  const arrivalDay = toLocalDay(arrival);
  const departureDay = toLocalDay(departure);
  if (!isValid(arrivalDay) || !isValid(departureDay)) return null;

  const nights = differenceInCalendarDays(departureDay, arrivalDay);
  if (nights <= 0) return null;

  let total = 0;
  let rackTotal = 0;
  for (let i = 0; i < nights; i++) {
    const d = addDays(arrivalDay, i);
    const { multiplier } = nightMultiplier(d);
    total += Math.round(pricePerNight * multiplier);
    rackTotal += Math.round((rackRatePerNight || pricePerNight) * multiplier);
  }

  return { nights, total, rackTotal, avgRate: Math.round(total / nights) };
}