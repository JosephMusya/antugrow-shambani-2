import { format } from "timeago.js";

type TimeAgoUnit = "Minutes" | "Hours" | "Days" | "Weeks" | "Months" | "Years";

interface TimeAgoResult {
  value: number;
  type: TimeAgoUnit;
}

export function getTimeAgoObject(dateString: string): TimeAgoResult {
  const formatted = format(new Date(dateString)); // e.g., "3 days ago"
  const match = formatted.match(/(\d+)\s(\w+)/);   // e.g., ["3 days", "3", "days"]

  if (match) {
    const value = parseInt(match[1], 10);
    let unit = match[2].toLowerCase();

    // Normalize to plural and capitalize first letter
    if (!unit.endsWith("s")) unit += "s";
    const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);

    const allowedUnits: TimeAgoUnit[] = ["Minutes", "Hours", "Days", "Weeks", "Months", "Years"];

    if (allowedUnits.includes(capitalizedUnit as TimeAgoUnit)) {
      return {
        value,
        type: capitalizedUnit as TimeAgoUnit
      };
    }
  }

  // Default fallback if parsing fails
  return { value: 0, type: "Minutes" };
}

export function formatToReadableDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];

  return `${month} ${day}, ${year}`;
}
