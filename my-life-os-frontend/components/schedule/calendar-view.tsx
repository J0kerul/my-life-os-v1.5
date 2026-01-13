"use client";

import { useEventStore } from "@/lib/store/event-store";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { AgendaView } from "./agenda-view";

export function CalendarView() {
  const { currentView } = useEventStore();

  switch (currentView) {
    case "month":
      return <MonthView />;
    case "week":
      return <WeekView />;
    case "day":
      return <DayView />;
    case "agenda":
      return <AgendaView />;
    default:
      return <MonthView />;
  }
}
