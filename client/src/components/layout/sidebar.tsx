import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  BarChart,
  BookOpen,
  Clock,
  Flag,
  Layers,
  StickyNote,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
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

export function Sidebar() {
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
    <aside className="hidden lg:flex flex-col w-64 h-full glass shadow-lg z-10 p-5 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-primary">StudyTracker</h1>
        <ThemeToggle />
      </div>

      <div className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl transition-colors",
              location === item.href
                ? "bg-primary-50 dark:bg-gray-800 text-primary dark:text-primary font-medium"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center p-3 space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary dark:text-primary-300">
            <span>{initials}</span>
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
