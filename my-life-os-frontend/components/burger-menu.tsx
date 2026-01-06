"use client";

import { Menu } from "lucide-react";

interface BurgerMenuProps {
  onClick: () => void;
}

export function BurgerMenu({ onClick }: BurgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-8 left-8 z-50 p-3 md:p-4 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-7 h-7 md:w-8 md:h-8 text-foreground" />
    </button>
  );
}