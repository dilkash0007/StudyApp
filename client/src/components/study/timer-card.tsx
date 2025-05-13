import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTime, getCircleProgress } from "@/lib/utils";
import { Subject } from "@/lib/data";

interface TimerCardProps {
  subjects: Subject[];
  onComplete: (duration: number, subjectId: number | null) => void;
}

export function TimerCard({ subjects, onComplete }: TimerCardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [timerMode, setTimerMode] = useState<"pomodoro" | "short" | "long">(
    "pomodoro"
  );
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Set timer durations
  const timerDurations = {
    pomodoro: 25 * 60, // 25 minutes
    short: 5 * 60, // 5 minutes
    long: 15 * 60, // 15 minutes
  };

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(timerDurations[timerMode]);
    setIsActive(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  }, [timerMode]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timeLeft;
      }

      timerRef.current = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);

            // Calculate duration in hours
            const duration = (startTimeRef.current! - 0) / 3600;
            const subjectId =
              selectedSubject && selectedSubject !== "none"
                ? parseInt(selectedSubject)
                : null;
            onComplete(duration, subjectId);

            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused, onComplete, selectedSubject]);

  // Start timer
  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      startTimeRef.current = timeLeft;
    } else if (isPaused) {
      setIsPaused(false);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    if (isActive && !isPaused) {
      setIsPaused(true);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setTimeLeft(timerDurations[timerMode]);
    setIsActive(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  };

  // Calculate progress percentage and stroke offset
  const totalTime = timerDurations[timerMode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = getCircleProgress(progress, 45);

  return (
    <Card className="glass rounded-2xl p-6 shadow-lg hover-scale transition-all h-full">
      <CardHeader className="p-0 mb-6">
        <div className="flex justify-between items-start">
          <CardTitle className="font-semibold text-lg">
            Start Studying
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary-600 dark:hover:text-primary-300"
          >
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="5"
                className="dark:stroke-gray-700"
              ></circle>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="timer-circle text-primary dark:text-primary-400"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                minutes left
              </span>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <Button
              variant={timerMode === "pomodoro" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimerMode("pomodoro")}
            >
              Pomodoro
            </Button>
            <Button
              variant={timerMode === "short" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimerMode("short")}
            >
              Short Break
            </Button>
            <Button
              variant={timerMode === "long" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimerMode("long")}
            >
              Long Break
            </Button>
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="mb-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full">
              <SelectValue placeholder="Select subject..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No subject</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-3 w-full">
            {!isActive || isPaused ? (
              <Button
                className="flex-1 bg-primary hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors"
                onClick={startTimer}
              >
                {isPaused ? "Resume" : "Start"}
              </Button>
            ) : (
              <Button
                className="flex-1 bg-secondary hover:bg-secondary-600 text-white font-medium py-3 rounded-lg transition-colors"
                onClick={pauseTimer}
              >
                Pause
              </Button>
            )}
            <Button
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-lg transition-colors"
              onClick={resetTimer}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
