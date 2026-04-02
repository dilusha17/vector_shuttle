import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Toaster } from "sonner";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  LogOut,
  Menu,
  User,
  Shield,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types/admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "admin.dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "admin.bookings.index", icon: CalendarCheck },
  { label: "Users", href: "admin.users.index", icon: Users, adminOnly: true },
];

interface SidebarContentProps {
  onClose?: () => void;
}

const SidebarContent = ({ onClose }: SidebarContentProps) => {
  const { auth } = usePage<PageProps>().props;
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    router.post(route("admin.logout"));
  };

  const filtered = navItems.filter(
    (item) => !item.adminOnly || auth.user?.role === "admin",
  );

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-foreground">
              Vector Shuttle
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filtered.map((item) => {
          const isActive =
            currentPath === route(item.href) ||
            (item.href === "admin.bookings.index" &&
              currentPath.startsWith("/admin/bookings"));
          return (
            <Link
              key={item.label}
              href={route(item.href)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="space-y-2 border-t border-border p-3">
        <Link
          href={route("admin.profile")}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            currentPath.includes("/admin/profile")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <User className="h-4 w-4 shrink-0" />
          Profile
        </Link>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-semibold text-primary">
              {auth.user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {auth.user?.name}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {auth.user?.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { flash } = usePage<PageProps>().props;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Toaster richColors position="top-right" />

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-64 flex-col border-r border-border">
            <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex shrink-0 items-center gap-4 border-b border-border bg-card px-4 py-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
