"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Folder, Code } from "lucide-react";
import { useCategoryStore } from "@/lib/store/category-store";
import { useTechStackStore } from "@/lib/store/techstack-store";
import type { Category, TechStackItem } from "@/types";

interface TechStackManagerDialogProps {
  onClose: () => void;
}

export default function TechStackManagerDialog({
  onClose,
}: TechStackManagerDialogProps) {
  const {
    categories,
    isLoading: categoriesLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const {
    items,
    isLoading: itemsLoading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setCategoryFilter,
    categoryFilter,
  } = useTechStackStore();

  // Local state for forms
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [editingItem, setEditingItem] = useState<TechStackItem | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemCategory, setEditItemCategory] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "item";
    id: string;
    name: string;
  } | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems]);

  // Group items by category for display
  const itemsByCategory = items.reduce((acc, item) => {
    const categoryName = item.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, TechStackItem[]>);

  // Handle Category Actions
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;
    try {
      await updateCategory(editingCategory.id, {
        name: editCategoryName.trim(),
      });
      setEditingCategory(null);
      setEditCategoryName("");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Cannot delete category with existing tech stack items");
    }
  };

  // Handle Tech Stack Item Actions
  const handleCreateItem = async () => {
    if (!newItemName.trim() || !newItemCategory) return;
    try {
      await createItem({
        name: newItemName.trim(),
        categoryId: newItemCategory,
      });
      setNewItemName("");
      setNewItemCategory("");
    } catch (error) {
      console.error("Failed to create tech stack item:", error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editItemName.trim() || !editItemCategory) return;
    try {
      await updateItem(editingItem.id, {
        name: editItemName.trim(),
        categoryId: editItemCategory,
      });
      setEditingItem(null);
      setEditItemName("");
      setEditItemCategory("");
    } catch (error) {
      console.error("Failed to update tech stack item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete tech stack item:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-card border border-border rounded-lg w-full max-w-5xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Manage Tech Stack
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Split View */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Side - Categories */}
            <div className="w-1/2 border-r border-border flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Folder className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Categories
                  </h3>
                </div>

                {/* Add New Category */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateCategory()
                    }
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim() || categoriesLoading}
                    className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {categoriesLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No categories yet. Create one to get started!
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                    >
                      {editingCategory?.id === category.id ? (
                        // Edit Mode
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) =>
                              setEditCategoryName(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateCategory();
                              if (e.key === "Escape") {
                                setEditingCategory(null);
                                setEditCategoryName("");
                              }
                            }}
                            className="flex-1 bg-card border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                          />
                          <button
                            onClick={handleUpdateCategory}
                            className="text-green-500 hover:text-green-600 transition-colors"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null);
                              setEditCategoryName("");
                            }}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-medium">
                            {category.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(category);
                                setEditCategoryName(category.name);
                              }}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "category",
                                  id: category.id,
                                  name: category.name,
                                })
                              }
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Side - Tech Stack Items */}
            <div className="w-1/2 flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Tech Stack Items
                  </h3>
                </div>

                {/* Add New Item */}
                <div className="space-y-2">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tech stack item name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateItem()}
                      disabled={!newItemCategory}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                    <button
                      onClick={handleCreateItem}
                      disabled={
                        !newItemName.trim() || !newItemCategory || itemsLoading
                      }
                      className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Tech Stack Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {itemsLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading tech stack items...
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No tech stack items yet. Create a category first, then add
                    items!
                  </div>
                ) : (
                  Object.entries(itemsByCategory).map(
                    ([categoryName, categoryItems]) => (
                      <div key={categoryName}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                          {categoryName} ({categoryItems.length})
                        </h4>
                        <div className="space-y-2">
                          {categoryItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                            >
                              {editingItem?.id === item.id ? (
                                // Edit Mode
                                <div className="space-y-2">
                                  <select
                                    value={editItemCategory}
                                    onChange={(e) =>
                                      setEditItemCategory(e.target.value)
                                    }
                                    className="w-full bg-card border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                  >
                                    {categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={editItemName}
                                      onChange={(e) =>
                                        setEditItemName(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          handleUpdateItem();
                                        if (e.key === "Escape") {
                                          setEditingItem(null);
                                          setEditItemName("");
                                          setEditItemCategory("");
                                        }
                                      }}
                                      className="flex-1 bg-card border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                      autoFocus
                                    />
                                    <button
                                      onClick={handleUpdateItem}
                                      className="text-green-500 hover:text-green-600 transition-colors"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingItem(null);
                                        setEditItemName("");
                                        setEditItemCategory("");
                                      }}
                                      className="text-red-500 hover:text-red-600 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <div className="flex items-center justify-between">
                                  <span className="text-foreground">
                                    {item.name}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingItem(item);
                                        setEditItemName(item.name);
                                        setEditItemCategory(item.categoryId);
                                      }}
                                      className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: "item",
                                          id: item.id,
                                          name: item.name,
                                        })
                                      }
                                      className="text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Confirm Deletion
              </h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {deleteConfirm.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === "category") {
                      handleDeleteCategory(deleteConfirm.id);
                    } else {
                      handleDeleteItem(deleteConfirm.id);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
