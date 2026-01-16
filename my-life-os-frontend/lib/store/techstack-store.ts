import { create } from "zustand";
import type {
  TechStackItem,
  CreateTechStackItemRequest,
  UpdateTechStackItemRequest,
} from "@/types";
import {
  getTechStackItems as apiGetTechStackItems,
  createTechStackItem as apiCreateTechStackItem,
  updateTechStackItem as apiUpdateTechStackItem,
  deleteTechStackItem as apiDeleteTechStackItem,
} from "@/lib/api/techstack";

interface TechStackState {
  // State
  items: TechStackItem[];
  selectedItem: TechStackItem | null;
  isLoading: boolean;
  error: string | null;

  // Filters
  categoryFilter: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  fetchItemsWithFilter: (categoryId?: string) => Promise<void>;
  selectItem: (item: TechStackItem | null) => void;
  createItem: (itemData: CreateTechStackItemRequest) => Promise<TechStackItem>;
  updateItem: (itemId: string, itemData: UpdateTechStackItemRequest) => Promise<TechStackItem>;
  deleteItem: (itemId: string) => Promise<void>;
  setCategoryFilter: (categoryId: string | null) => void;
  clearFilters: () => void;
}

export const useTechStackStore = create<TechStackState>((set, get) => ({
  // Initial state
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  categoryFilter: null,

  // Fetch all tech stack items (no filter)
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { items } = await apiGetTechStackItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tech stack items",
        isLoading: false,
      });
    }
  },

  // Fetch tech stack items with category filter
  fetchItemsWithFilter: async (categoryId?) => {
    set({ isLoading: true, error: null });
    try {
      const { items } = await apiGetTechStackItems(categoryId);
      set({ items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tech stack items",
        isLoading: false,
      });
    }
  },

  // Select an item for detail view
  selectItem: (item) => {
    set({ selectedItem: item });
  },

  // Create new tech stack item
  createItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      const { item: newItem } = await apiCreateTechStackItem(itemData);
      set((state) => ({
        items: [...state.items, newItem],
        selectedItem: newItem,
        isLoading: false,
      }));
      return newItem;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create tech stack item",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update tech stack item
  updateItem: async (itemId, itemData) => {
    set({ isLoading: true, error: null });
    try {
      const { item: updatedItem } = await apiUpdateTechStackItem(itemId, itemData);
      set((state) => ({
        items: state.items.map((i) => (i.id === itemId ? updatedItem : i)),
        selectedItem:
          state.selectedItem?.id === itemId ? updatedItem : state.selectedItem,
        isLoading: false,
      }));
      return updatedItem;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update tech stack item",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete tech stack item
  deleteItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTechStackItem(itemId);
      set((state) => ({
        items: state.items.filter((i) => i.id !== itemId),
        selectedItem:
          state.selectedItem?.id === itemId ? null : state.selectedItem,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete tech stack item",
        isLoading: false,
      });
      throw error;
    }
  },

  // Set category filter
  setCategoryFilter: (categoryId) => {
    set({ categoryFilter: categoryId });
    get().fetchItemsWithFilter(categoryId || undefined);
  },

  // Clear filters
  clearFilters: () => {
    set({ categoryFilter: null });
    get().fetchItemsWithFilter(undefined);
  },
}));