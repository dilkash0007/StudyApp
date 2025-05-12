import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart, Clock, Layers, StickyNote } from "lucide-react";

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

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 glass shadow-lg flex items-center justify-around py-3 px-6 z-20">
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
  );
}