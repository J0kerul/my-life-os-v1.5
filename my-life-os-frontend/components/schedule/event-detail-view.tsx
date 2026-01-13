"use client";

import { useState } from "react";
import { useEventStore } from "@/lib/store/event-store";
import { Calendar, X, Trash2, Edit } from "lucide-react";
import type {
  UpdateEventRequest,
  DeleteEventRequest,
  EditScope,
  DeleteScope,
} from "@/types";

export function EventDetailView() {
  const { selectedEvent, selectEvent, updateEvent, deleteEvent } =
    useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>("all");
  const [deleteScope, setDeleteScope] = useState<DeleteScope>("all");

  // Form state for editing
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    allDay: false,
    domain: "",
    hideFromAgenda: false,
  });

  // Load event data into form when editing starts
  const handleEditStart = () => {
    if (!selectedEvent) return;
    setFormData({
      title: selectedEvent.title,
      startDate: selectedEvent.startDate,
      endDate: selectedEvent.endDate || "",
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
      const updateData: UpdateEventRequest = {
        editScope,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        allDay: formData.allDay,
        domain: formData.domain as any,
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

  // Delete event
  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      const deleteData: DeleteEventRequest = {
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
      selectEvent(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Placeholder when no event selected
  if (!selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <Calendar className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Event Selected</h3>
        <p className="text-sm">
          Click on an event in the calendar to view its details
        </p>
      </div>
    );
  }

  // Delete confirmation dialog
  if (showDeleteConfirm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Delete Event</h2>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this event?
        </p>

        {selectedEvent.isRecurring && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Delete options:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteScope"
                  value="this"
                  checked={deleteScope === "this"}
                  onChange={(e) =>
                    setDeleteScope(e.target.value as DeleteScope)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Only this occurrence</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteScope"
                  value="following"
                  checked={deleteScope === "following"}
                  onChange={(e) =>
                    setDeleteScope(e.target.value as DeleteScope)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">This and following occurrences</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deleteScope"
                  value="all"
                  checked={deleteScope === "all"}
                  onChange={(e) =>
                    setDeleteScope(e.target.value as DeleteScope)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">All occurrences</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // View mode
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
          <button
            onClick={() => selectEvent(null)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Domain & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Domain</label>
            <p className="font-medium">{selectedEvent.domain}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Type</label>
            <p className="font-medium">
              {selectedEvent.allDay
                ? "All Day"
                : formatTime(selectedEvent.startDate)}
            </p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm text-muted-foreground">Date</label>
          <p className="font-medium">{formatDate(selectedEvent.startDate)}</p>
          {!selectedEvent.allDay && selectedEvent.endDate && (
            <p className="text-sm text-muted-foreground">
              {formatTime(selectedEvent.startDate)} -{" "}
              {formatTime(selectedEvent.endDate)}
            </p>
          )}
        </div>

        {/* Recurrence Info */}
        {selectedEvent.isRecurring && (
          <div>
            <label className="text-sm text-muted-foreground">Recurrence</label>
            <p className="font-medium capitalize">
              {selectedEvent.recurrenceType}
            </p>
            {selectedEvent.recurrenceEnd && (
              <p className="text-sm text-muted-foreground">
                Until {formatDate(selectedEvent.recurrenceEnd)}
              </p>
            )}
          </div>
        )}

        {/* Options */}
        {selectedEvent.hideFromAgenda && (
          <div className="text-sm text-muted-foreground">
            Hidden from Agenda view
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
          <div>
            <label className="block mb-1">Created</label>
            <p>{formatDate(selectedEvent.createdAt)}</p>
          </div>
          <div>
            <label className="block mb-1">Updated</label>
            <p>{formatDate(selectedEvent.updatedAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleEditStart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Event
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Edit mode
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Edit options:</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="editScope"
                value="this"
                checked={editScope === "this"}
                onChange={(e) => setEditScope(e.target.value as EditScope)}
                className="w-4 h-4"
              />
              <span className="text-sm">Only this occurrence</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="editScope"
                value="following"
                checked={editScope === "following"}
                onChange={(e) => setEditScope(e.target.value as EditScope)}
                className="w-4 h-4"
              />
              <span className="text-sm">This and following occurrences</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="editScope"
                value="all"
                checked={editScope === "all"}
                onChange={(e) => setEditScope(e.target.value as EditScope)}
                className="w-4 h-4"
              />
              <span className="text-sm">All occurrences</span>
            </label>
          </div>
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
