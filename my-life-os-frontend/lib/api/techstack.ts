import { TechStackItem, CreateTechStackItemRequest, UpdateTechStackItemRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Get all tech stack items (optional categoryId filter)
export async function getTechStackItems(categoryId?: string): Promise<{ items: TechStackItem[] }> {
  const token = getAuthToken();
  
  const url = categoryId 
    ? `${API_URL}/tech-stack?categoryId=${categoryId}`
    : `${API_URL}/tech-stack`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tech stack items");
  }

  return response.json();
}

// Get single tech stack item
export async function getTechStackItem(id: string): Promise<{ item: TechStackItem }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/tech-stack/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tech stack item");
  }

  return response.json();
}

// Create tech stack item
export async function createTechStackItem(data: CreateTechStackItemRequest): Promise<{ message: string; item: TechStackItem }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/tech-stack`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create tech stack item");
  }

  return response.json();
}

// Update tech stack item
export async function updateTechStackItem(id: string, data: UpdateTechStackItemRequest): Promise<{ message: string; item: TechStackItem }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/tech-stack/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/tech-stack/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete tech stack item");
  }

  return response.json();
}