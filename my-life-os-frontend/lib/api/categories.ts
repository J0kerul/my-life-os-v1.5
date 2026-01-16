import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types";

// Get all categories
export async function getCategories(): Promise<{ categories: Category[] }> {
  const response = await fetch("/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }

  return response.json();
}

// Get single category
export async function getCategory(id: string): Promise<{ category: Category }> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch category");
  }

  return response.json();
}

// Create category
export async function createCategory(data: CreateCategoryRequest): Promise<{ message: string; category: Category }> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete category");
  }

  return response.json();
}