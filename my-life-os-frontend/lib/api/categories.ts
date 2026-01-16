import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Get all categories
export async function getCategories(): Promise<{ categories: Category[] }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }

  return response.json();
}

// Get single category
export async function getCategory(id: string): Promise<{ category: Category }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch category");
  }

  return response.json();
}

// Create category
export async function createCategory(data: CreateCategoryRequest): Promise<{ message: string; category: Category }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create category");
  }

  return response.json();
}

// Update category
export async function updateCategory(id: string, data: UpdateCategoryRequest): Promise<{ message: string; category: Category }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update category");
  }

  return response.json();
}

// Delete category
export async function deleteCategory(id: string): Promise<{ message: string }> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete category");
  }

  return response.json();
}