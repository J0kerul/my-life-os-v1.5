"use client";

import { Calendar } from "lucide-react";

export function AgendaView() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Agenda View</h3>
        <p className="text-sm">Coming soon...</p>
      </div>
    </div>
  );
}
