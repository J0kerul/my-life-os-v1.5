import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  DeleteEventRequest,
  EventsResponse,
  EventResponse,
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

// Get events in date range (returns expanded occurrences)
export async function getEvents(
  start: string,  // ISO 8601 format
  end: string     // ISO 8601 format
): Promise<Event[]> {
  const params = new URLSearchParams();
  params.append("start", start);
  params.append("end", end);

  const url = `${API_BASE}/events?${params.toString()}`;

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

  const data: EventsResponse = await response.json();
  return data.events || [];
}

// Get single event (base event, not occurrence)
export async function getEvent(eventId: string): Promise<Event> {
  const response = await fetchWithAuth(`${API_BASE}/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch event");
  }

  const data: EventResponse = await response.json();
  return data.event;
}

// Create new event
export async function createEvent(
  eventData: CreateEventRequest
): Promise<Event> {
  const response = await fetchWithAuth(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create event");
  }

  const data: EventResponse = await response.json();
  return data.event;
}

// Update event
export async function updateEvent(
  eventId: string,
  eventData: UpdateEventRequest
): Promise<Event> {
  const response = await fetchWithAuth(`${API_BASE}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update event");
  }

  const data: EventResponse = await response.json();
  return data.event;
}

// Delete event
export async function deleteEvent(
  eventId: string,
  deleteData: DeleteEventRequest
): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deleteData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete event");
  }
}