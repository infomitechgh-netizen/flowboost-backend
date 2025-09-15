// src/components/layout/Sidebar.tsx
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Users,
  Settings,
  HeadphonesIcon,
  BarChart3,
  CreditCard,
  Notebook,
  ShoppingBasketIcon,
  TicketIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  role: string | null;
}

export const AppSidebar = ({ role }: AppSidebarProps) => {
  const userRole = role || localStorage.getItem("role");

  const navigationItems = [
    {
      title: "Dashboard",
      url: userRole === "admin" ? "/admin-dashboard" : "/dashboard",
      icon: LayoutDashboard,
    },
    { title: "Services", url: "/services", icon: Package },
    { title: "New Order", url: "/placeorder", icon: ShoppingBasketIcon },
    { title: "Orders", url: "/orders", icon: ShoppingCart },
    { title: "Wallet", url: "/wallet", icon: Wallet },
  ];

  const adminItems = [
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "Payments", url: "/admin/payments", icon: CreditCard },
    { title: "Support Ticket", url: "/support/tickets", icon: TicketIcon },
  ];

  const supportItems = [
    { title: "Support", url: "/support/usersupport", icon: HeadphonesIcon },
    {
      title: "Settings",
      url: userRole === "admin" ? "/admin/settings" : "/settings",
      icon: Settings,
    },
    { title: "Documentation", url: "/support/documentation", icon: Notebook },
  ];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
      {navigationItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/20"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}

      {userRole === "admin" && (
        <>
          <h4 className="mt-6 mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Administration
          </h4>
          {adminItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/20"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </>
      )}

  
      {supportItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/20"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};
