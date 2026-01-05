"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthGuard } from "@/components/auth-guard";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function DashboardPage() {
  const router = useRouter();

  // Zeit-basierte Begrüßung
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) return { text: "Guten Morgen", punctuation: "" };
    if (hour >= 11 && hour < 18) return { text: "Guten Tag", punctuation: "" };
    if (hour >= 18 && hour < 22) return { text: "Guten Abend", punctuation: "" };
    return { text: "Noch wach", punctuation: "?" };
  };

  const greeting = getGreeting();

  // Formatiertes Datum: "Montag, 5. Januar 2026"
  const getFormattedDate = () => {
    return format(new Date(), "EEEE, d. MMMM yyyy", { locale: de });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            {/* Left: Greeting with Clock Icon */}
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" strokeWidth={2} />
              <h1 className="text-[2.5rem] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {greeting.text}, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Alex</span>{greeting.punctuation}
              </h1>
            </div>

            {/* Right: Date */}
            <div>
              <p className="text-lg font-light text-muted-foreground">
                Heute ist der {getFormattedDate()}
              </p>
            </div>
          </div>

          {/* Placeholder for Widgets */}
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl font-light">Widgets coming soon...</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}