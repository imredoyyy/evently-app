import { and, gte, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { event } from "@/lib/db/schema";
import type { TimeFilterType } from "@/types";

/**
 * Returns an SQL expression that calculates the start of the week in days
 * from the current date. The start of the week is Sunday.
 *
 * @returns {SQL} SQL expression
 */
const getStartOfWeek = (): SQL =>
  sql`CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER`;

/**
 * Returns an SQL expression that filters events based on a given time filter.
 *
 * @param {TimeFilterType} timeFilter  The time filter to apply
 * @returns {SQL|undefined} An SQL expression or undefined if the time filter is invalid
 */
const getTimeCondition = (timeFilter: TimeFilterType): SQL | undefined => {
  switch (timeFilter) {
    case "today":
      return sql`DATE(${event.startDate}) = CURRENT_DATE`;

    case "tomorrow":
      return sql`DATE(${event.startDate}) = CURRENT_DATE + INTERVAL '1 day'`;

    case "this_week":
      return and(
        gte(sql`DATE(${event.startDate})`, getStartOfWeek()),
        lte(
          sql`DATE(${event.startDate})`,
          sql`${getStartOfWeek()} + INTERVAL '6 day'`
        )
      );

    case "next_week":
      return and(
        gte(
          sql`DATE(${event.startDate})`,
          sql`${getStartOfWeek()} + INTERVAL '7 day'`
        ),
        lte(
          sql`DATE(${event.startDate})`,
          sql`${getStartOfWeek()} + INTERVAL '13 day'`
        )
      );

    case "upcoming":
      return gte(event.startDate, sql`CURRENT_TIMESTAMP`);

    default:
      return undefined;
  }
};

export { getTimeCondition, getStartOfWeek };
