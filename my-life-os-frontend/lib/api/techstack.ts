import { TechStackItem, CreateTechStackItemRequest, UpdateTechStackItemRequest } from "@/types";

// Get all tech stack items (optional categoryId filter)
export async function getTechStackItems(categoryId?: string): Promise<{ techStackItems: TechStackItem[] }> {
  const url = categoryId 
    ? `/api/tech-stack?categoryId=${categoryId}`
    : `/api/tech-stack`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tech stack items");
  }

  return response.json();
}

// Get single tech stack item
export async function getTechStackItem(id: string): Promise<{ techStackItem: TechStackItem }> {
  const response = await fetch(`/api/tech-stack/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tech stack item");
  }

  return response.json();
}

// Create tech stack item
export async function createTechStackItem(data: CreateTechStackItemRequest): Promise<{ message: string; techStackItem: TechStackItem }> {
  const response = await fetch("/api/tech-stack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create tech stack item");
  }

  return response.json();
}

// Update tech stack item
export async function updateTechStackItem(id: string, data: UpdateTechStackItemRequest): Promise<{ message: string; techStackItem: TechStackItem }> {
  const response = await fetch(`/api/tech-stack/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update tech stack item");
  }

  return response.json();
}

// Delete tech stack item
export async function deleteTechStackItem(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/tech-stack/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete tech stack item");
  }

  return response.json();
}