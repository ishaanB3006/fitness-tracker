"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  Trophy,
  ShoppingBag,
  BarChart3,
  Tag,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/admin/challenges", icon: Trophy, label: "Challenges" },
  { href: "/admin/placements", icon: ShoppingBag, label: "Placements" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 md:hidden border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to App</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 md:translate-x-0 md:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Brand Console</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your campaigns
              </p>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
              <nav className="px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            <Separator />

            {/* Footer */}
            <div className="p-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

