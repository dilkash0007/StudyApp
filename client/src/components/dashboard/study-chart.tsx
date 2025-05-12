import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudySession } from "@/lib/data";
import { formatTime } from "@/lib/utils";

interface StudyChartProps {
  sessions: StudySession[];
}

export function StudyChart({ sessions }: StudyChartProps) {
  const [weeklyData, setWeeklyData] = useState<{ day: string; hours: number; label: string }[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Initialize weekly data with all days of the current week
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - today.getDay() + i);
      return {
        day: days[i],
        date: d,
        hours: 0,
        label: d.getDate().toString(),
      };
    });
    
    // Current week sessions
    const currentWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const diff = today.getTime() - sessionDate.getTime();
      const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
      return daysDiff < 7 && sessionDate.getDay() <= today.getDay();
    });
    
    // Previous week sessions
    const prevWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const diff = today.getTime() - sessionDate.getTime();
      const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
      return daysDiff >= 7 && daysDiff < 14;
    });
    
    // Sum hours by day for current week
    currentWeekSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = sessionDate.getDay();
      weekData[dayIndex].hours += session.duration;
    });
    
    // Calculate totals
    const currentWeekTotal = currentWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const prevWeekTotal = prevWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    // Calculate percent change
    let change = 0;
    if (prevWeekTotal > 0) {
      change = ((currentWeekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    }
    
    setWeeklyData(weekData);
    setTotalHours(currentWeekTotal);
    setPercentChange(change);
  }, [sessions]);

  return (
    <Card className="glass rounded-2xl p-6 mb-8 shadow-lg hover-scale transition-all">
      <CardHeader className="p-0 mb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg">Weekly Study Overview</CardTitle>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">This Week</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{day.day}</div>
              <div className="h-24 md:h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg relative">
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-lg ${
                    index === new Date().getDay()
                      ? "bg-secondary dark:bg-secondary"
                      : "bg-primary dark:bg-primary"
                  }`}
                  style={{ height: `${Math.min((day.hours / 5) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm font-medium mt-2">{day.hours.toFixed(1)}h</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total this week</p>
            <p className="text-xl font-semibold">{totalHours.toFixed(1)} hours</p>
          </div>
          <div className={`flex items-center ${percentChange >= 0 ? "text-success" : "text-destructive"}`}>
            {percentChange >= 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
            <span>{Math.abs(percentChange).toFixed(0)}% from last week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
