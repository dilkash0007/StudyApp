import { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  X,
  BarChart,
  BookOpen,
  Clock,
  Flag,
  Layers,
  StickyNote
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";

// Bottom navigation items
const bottomNavItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    href: "/sessions",
    label: "Timer",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    href: "/notes",
    label: "Notes",
    icon: <StickyNote className="h-5 w-5" />,
  },
];

// Mobile menu items
const mobileMenuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    href: "/sessions",
    label: "Study Sessions",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    href: "/notes",
    label: "Notes",
    icon: <StickyNote className="h-5 w-5" />,
  },
  {
    href: "/goals",
    label: "Goals",
    icon: <Flag className="h-5 w-5" />,
  },
];

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [userData] = useLocalStorage("studyTrackerData", {
    user: {
      name: "Student",
      initials: "ST",
      role: "Student",
    },
  });

  const { name, initials, role } = userData.user || {};

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden glass z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-primary">StudyTracker</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 glass px-6 py-8 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-primary">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          {mobileMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl transition-colors",
                location === item.href
                  ? "bg-primary-50 dark:bg-gray-800 text-primary dark:text-primary font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center p-4 space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary dark:text-primary-300">
              <span>{initials}</span>
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden glass shadow-lg flex items-center justify-around py-3 px-6 z-20">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center",
              location === item.href
                ? "text-primary dark:text-primary"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
