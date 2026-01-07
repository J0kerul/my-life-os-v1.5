"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  X,
  Home,
  LayoutDashboard,
  GraduationCap,
  CheckSquare,
  Calendar,
  FolderKanban,
  School,
  BookOpen,
  Notebook,
  Edit3,
  Briefcase,
  Dumbbell,
  Heart,
  Shirt,
  CookingPot,
  DollarSign,
  Wallet,
  Gift,
  Plane,
  Film,
  Library,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // State für collapsible sections
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 via-primary to-purple-500 bg-clip-text text-transparent">
                MyLifeOS
              </h1>
              <button
                onClick={onClose}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your Digital Life, Organized
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Home Section */}
            <div>
              <button
                onClick={() => toggleSection("home")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-medium">Home</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("home") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("home") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span>Dashboard</span>
                  </button>
                </div>
              )}
            </div>

            {/* Productivity & Uni Section */}
            <div>
              <button
                onClick={() => toggleSection("productivity")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="font-medium">Productivity & Uni</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("productivity") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("productivity") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button
                    onClick={() => handleNavigation("/tasks")}
                    className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <span>Task Manager</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Schedule</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <FolderKanban className="w-4 h-4 text-primary" />
                    <span>Project Manager</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <School className="w-4 h-4 text-primary" />
                    <span>University Hub</span>
                  </button>
                </div>
              )}
            </div>

            {/* Knowledge & Growth Section */}
            <div>
              <button
                onClick={() => toggleSection("knowledge")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">Knowledge & Growth</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("knowledge") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("knowledge") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Notebook className="w-4 h-4 text-primary" />
                    <span>Notebook</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span>Daily Reflections</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Portfolio</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lifestyle & Health Section */}
            <div>
              <button
                onClick={() => toggleSection("lifestyle")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-medium">Lifestyle & Health</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("lifestyle") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("lifestyle") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    <span>Workout Planner</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Shirt className="w-4 h-4 text-primary" />
                    <span>Digital Closet</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <CookingPot className="w-4 h-4 text-primary" />
                    <span>Recipe Storage</span>
                  </button>
                </div>
              )}
            </div>

            {/* Finances & Goals Section */}
            <div>
              <button
                onClick={() => toggleSection("finances")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-medium">Finances & Goals</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("finances") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("finances") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span>Strategic Finance</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Gift className="w-4 h-4 text-primary" />
                    <span>Wish-List</span>
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Plane className="w-4 h-4 text-primary" />
                    <span>Travel Planner</span>
                  </button>
                </div>
              )}
            </div>

            {/* Entertainment Section */}
            <div>
              <button
                onClick={() => toggleSection("entertainment")}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-primary" />
                  <span className="font-medium">Entertainment</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("entertainment") ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.includes("entertainment") && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2 text-sm hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Library className="w-4 h-4 text-primary" />
                    <span>Media Library</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <button className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5 text-primary" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5 text-destructive" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}