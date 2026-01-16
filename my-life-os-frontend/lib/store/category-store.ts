import { create } from "zustand";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types";
import {
  getCategories as apiGetCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "@/lib/api/categories";

interface CategoryState {
  // State
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  selectCategory: (category: Category | null) => void;
  createCategory: (categoryData: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (categoryId: string, categoryData: UpdateCategoryRequest) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { categories } = await apiGetCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  // Select a category for detail view
  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  // Create new category
  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { category: newCategory } = await apiCreateCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, newCategory],
        selectedCategory: newCategory,
        isLoading: false,
      }));
      return newCategory;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { category: updatedCategory } = await apiUpdateCategory(categoryId, categoryData);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId ? updatedCategory : c
        ),
        selectedCategory:
          state.selectedCategory?.id === categoryId
            ? updatedCategory
            : state.selectedCategory,
        isLoading: false,
      }));
      return updatedCategory;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update category",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        selectedCategory:
          state.selectedCategory?.id === categoryId ? null : state.selectedCategory,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete category",
        isLoading: false,
      });
      throw error;
    }
  },
}));