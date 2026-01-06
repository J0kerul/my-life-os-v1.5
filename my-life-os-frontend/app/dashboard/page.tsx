"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthGuard } from "@/components/auth-guard";
import { BurgerMenu } from "@/components/burger-menu";
import { Sidebar } from "@/components/sidebar";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Zeit-basierte Begrüßung
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) return { text: "Guten Morgen", punctuation: "" };
    if (hour >= 11 && hour < 18) return { text: "Guten Tag", punctuation: "" };
    if (hour >= 18 && hour < 22) return { text: "Guten Abend", punctuation: "" };
    return { text: "Noch wach", punctuation: "?" };
  };

  const greeting = getGreeting();

  // Formatiertes Datum: "Montag, der 5. Januar 2026"
  const getFormattedDate = () => {
    const date = new Date();
    const weekday = format(date, "EEEE", { locale: de });
    const rest = format(date, "d. MMMM yyyy", { locale: de });
    return `${weekday}, der ${rest}`;
  };

  return (
    <AuthGuard>
      {/* Burger Menu */}
      <BurgerMenu onClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen">
        {/* Header - Full Width */}
        <div className="pt-8 px-36 pr-8 mt-16 mb-12">
          <div className="flex items-end justify-between pb-4">
            {/* Left: Greeting with Clock Icon */}
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" strokeWidth={2} />
              <h1 className="text-4xl md:text-5xl font-bold leading-none">
                <span className="bg-gradient-to-r from-gray-200 via-primary to-purple-500 bg-clip-text text-transparent">
                  {greeting.text}, Alex{greeting.punctuation}
                </span>
              </h1>
            </div>

            {/* Right: Date */}
            <div>
              <p className="text-2xl md:text-3xl font-bold leading-none">
                <span className="bg-gradient-to-r from-gray-200 via-primary to-purple-500 bg-clip-text text-transparent">
                  Heute ist {getFormattedDate()}
                </span>
              </p>
            </div>
          </div>
          
          {/* Gradient Line */}
          <div className="h-[2px] md:h-[3px] w-full bg-gradient-to-r from-gray-200 via-primary to-purple-500"></div>
        </div>

        {/* Content Container */}
        <div className="px-8">
          <div className="max-w-7xl mx-auto">
            {/* Placeholder for Widgets */}
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl font-light">Widgets coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}