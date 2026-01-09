import type {
  ScheduleEvent,
  CreateScheduleEventRequest,
  UpdateScheduleEventRequest,
  ScheduleEventsResponse,
  ScheduleEventResponse,
  DeleteType,
} from "@/types";

const API_BASE = "/api";

// Helper: Refresh token if needed
async function refreshTokenIfNeeded(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    // Refresh failed - user needs to login again
    window.location.href = "/login";
    throw error;
  }
}

// Helper: Fetch with auto-retry on 401
async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // If 401 (Unauthorized), try refreshing token and retry once
  if (response.status === 401) {
    await refreshTokenIfNeeded();
    
    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return response;
}

// Helper to parse recurrence days from backend string to array
function parseRecurrenceDays(event: any): ScheduleEvent {
  if (event.recurrenceDays && typeof event.recurrenceDays === 'string') {
    try {
      event.recurrenceDays = JSON.parse(event.recurrenceDays);
    } catch {
      event.recurrenceDays = undefined;
    }
  }
  return event;
}

// Get events in date range
export async function getEvents(
  startDate: string, // ISO 8601 format
  endDate: string    // ISO 8601 format
): Promise<ScheduleEvent[]> {
  const params = new URLSearchParams();
  params.append("start", startDate);
  params.append("end", endDate);

  const url = `${API_BASE}/schedule?${params.toString()}`;

  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch events");
  }

  const data: ScheduleEventsResponse = await response.json();
  return (data.events || []).map(parseRecurrenceDays);
}

// Get single event
export async function getEvent(eventId: string): Promise<ScheduleEvent> {
  const response = await fetchWithAuth(`${API_BASE}/schedule/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch event");
  }

  const data: ScheduleEventResponse = await response.json();
  return parseRecurrenceDays(data.event);
}

// Create new event
export async function createEvent(
  eventData: CreateScheduleEventRequest
): Promise<{ event: ScheduleEvent; conflicts: ScheduleEvent[] }> {
  // Holidays domain is always all-day
  const finalEventData = {
    ...eventData,
    isAllDay: eventData.domain === "Holidays" ? true : eventData.isAllDay,
    recurrenceDays: eventData.recurrenceDays
      ? JSON.stringify(eventData.recurrenceDays)
      : undefined,
  };

  const response = await fetchWithAuth(`${API_BASE}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalEventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create event");
  }

  const data: ScheduleEventResponse = await response.json();
  return {
    event: parseRecurrenceDays(data.event),
    conflicts: (data.conflicts || []).map(parseRecurrenceDays),
  };
}

// Update event
export async function updateEvent(
  eventId: string,
  eventData: UpdateScheduleEventRequest,
  updateType?: DeleteType
): Promise<ScheduleEvent> {
  // Holidays domain is always all-day
  const finalEventData = {
    ...eventData,
    isAllDay: eventData.domain === "Holidays" ? true : eventData.isAllDay,
    updateType: updateType || "single", // Add updateType to request
    recurrenceDays: eventData.recurrenceDays
      ? JSON.stringify(eventData.recurrenceDays)
      : undefined,
  };

  const response = await fetchWithAuth(`${API_BASE}/schedule/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalEventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update event");
  }

  const data: ScheduleEventResponse = await response.json();
  return parseRecurrenceDays(data.event);
}

// Delete event
export async function deleteEvent(
  eventId: string,
  deleteType: DeleteType = "single",
  instanceDate?: string // ISO 8601 format - the date of the clicked instance
): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/schedule/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deleteType, instanceDate }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete event");
  }
}
