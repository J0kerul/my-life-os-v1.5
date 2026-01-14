"use client";

import { useState } from "react";
import { useEventStore } from "@/lib/store/event-store";
import { Calendar, X, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import type { EditScope, DeleteScope } from "@/types";

export function EventDetailView() {
  const { selectedEvent, updateEvent, deleteEvent, selectEvent } =
    useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>("this");
  const [deleteScope, setDeleteScope] = useState<DeleteScope>("this");

  // Form state for editing
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endTime: "",
    allDay: false,
    domain: "",
    hideFromAgenda: false,
  });

  // Load event data into form when editing starts
  const handleEditStart = () => {
    if (!selectedEvent) return;

    const eventStart = new Date(selectedEvent.startDate);
    const startDate = format(eventStart, "yyyy-MM-dd");
    const startTime = format(eventStart, "HH:mm");

    let endTime = "";
    if (selectedEvent.endDate) {
      const eventEnd = new Date(selectedEvent.endDate);
      endTime = format(eventEnd, "HH:mm");
    }

    setFormData({
      title: selectedEvent.title,
      startDate: startDate,
      startTime: startTime,
      endTime: endTime,
      allDay: selectedEvent.allDay,
      domain: selectedEvent.domain,
      hideFromAgenda: selectedEvent.hideFromAgenda,
    });
    setIsEditing(true);
  };

  // Save edited event
  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      // Combine date and time
      const startDateTime = formData.allDay
        ? new Date(formData.startDate).toISOString()
        : new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

      const endDateTime = formData.allDay
        ? null
        : formData.endTime
        ? new Date(`${formData.startDate}T${formData.endTime}`).toISOString()
        : null;

      const updateData: any = {
        editScope,
        title: formData.title,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay: formData.allDay,
        domain: formData.domain,
        hideFromAgenda: formData.hideFromAgenda,
      };

      // If recurring event and scope is "this" or "following", need occurrenceDate
      if (
        selectedEvent.isRecurring &&
        (editScope === "this" || editScope === "following")
      ) {
        updateData.occurrenceDate = selectedEvent.startDate;
      }

      await updateEvent(selectedEvent.id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      const deleteData: any = {
        deleteScope,
      };

      // If recurring event and scope is "this" or "following", need occurrenceDate
      if (
        selectedEvent.isRecurring &&
        (deleteScope === "this" || deleteScope === "following")
      ) {
        deleteData.occurrenceDate = selectedEvent.startDate;
      }

      await deleteEvent(selectedEvent.id, deleteData);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // No event selected - placeholder
  if (!selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Calendar className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No Event Selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Select an event to view details
        </p>
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Event</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Scope (for recurring events) */}
        {selectedEvent.isRecurring && (
          <div>
            <label className="block text-sm font-medium mb-2">Edit scope</label>
            <select
              value={editScope}
              onChange={(e) => setEditScope(e.target.value as EditScope)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="this">Only this occurrence</option>
              <option value="following">This and following occurrences</option>
              <option value="all">All occurrences</option>
            </select>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <select
              value={formData.domain}
              onChange={(e) =>
                setFormData({ ...formData, domain: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Work">Work</option>
              <option value="University">University</option>
              <option value="Personal">Personal</option>
              <option value="Coding Time">Coding Time</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Social">Social</option>
              <option value="Holidays">Holidays</option>
              <option value="Travel">Travel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Family">Family</option>
            </select>
          </div>

          {/* Date & Time */}
          <div
            className={`grid ${
              formData.allDay ? "grid-cols-1" : "grid-cols-3"
            } gap-2`}
          >
            <div className={formData.allDay ? "" : "col-span-1"}>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
              />
            </div>
            {!formData.allDay && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, allDay: !formData.allDay })
                }
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  formData.allDay
                    ? "bg-primary border-primary"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {formData.allDay && (
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm font-medium">All Day Event</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    hideFromAgenda: !formData.hideFromAgenda,
                  })
                }
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  formData.hideFromAgenda
                    ? "bg-primary border-primary"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {formData.hideFromAgenda && (
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm font-medium">Hide from Agenda</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold">Event Details</h2>
        <button
          onClick={() => selectEvent(null)}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Title
          </label>
          <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
        </div>

        {/* Domain */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Domain
          </label>
          <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
            {selectedEvent.domain}
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Date & Time
          </label>
          <div className="text-sm">
            {format(new Date(selectedEvent.startDate), "PPP")}
            {!selectedEvent.allDay && (
              <>
                <br />
                {format(new Date(selectedEvent.startDate), "HH:mm")}
                {selectedEvent.endDate &&
                  ` - ${format(new Date(selectedEvent.endDate), "HH:mm")}`}
              </>
            )}
            {selectedEvent.allDay && (
              <span className="ml-2 text-xs text-muted-foreground">
                (All Day)
              </span>
            )}
          </div>
        </div>

        {/* Recurrence Info */}
        {selectedEvent.isRecurring && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Recurrence
            </label>
            <div className="text-sm capitalize">
              🔁 {selectedEvent.recurrenceType}
              {selectedEvent.recurrenceEnd && (
                <span className="text-muted-foreground">
                  {" "}
                  until {format(new Date(selectedEvent.recurrenceEnd), "PP")}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hide from Agenda */}
        {selectedEvent.hideFromAgenda && (
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-muted rounded text-sm text-muted-foreground">
              Hidden from Agenda
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>
              <div className="mt-0.5">
                {format(new Date(selectedEvent.createdAt), "PPp")}
              </div>
            </div>
            <div>
              <span className="font-medium">Updated:</span>
              <div className="mt-0.5">
                {format(new Date(selectedEvent.updatedAt), "PPp")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="pt-4 border-t border-border space-y-2">
        <button
          onClick={handleEditStart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Event
        </button>

        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-background border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Event
          </button>
        ) : (
          <div className="space-y-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            {selectedEvent.isRecurring && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Delete scope
                </label>
                <select
                  value={deleteScope}
                  onChange={(e) =>
                    setDeleteScope(e.target.value as DeleteScope)
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="this">Only this occurrence</option>
                  <option value="following">
                    This and following occurrences
                  </option>
                  <option value="all">All occurrences</option>
                </select>
              </div>
            )}
            <p className="text-sm text-red-500 font-medium">
              Are you sure you want to delete this event?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
