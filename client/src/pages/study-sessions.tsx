import { useState } from "react";
import { useStudyData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TimerCard } from "@/components/study/timer-card";

export default function StudySessions() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New session form state
  const [newSession, setNewSession] = useState({
    subjectId: null as number | null,
    duration: 1,
    date: format(new Date(), "yyyy-MM-dd"),
  });

  // Group sessions by date
  const sessionsByDate = data?.studySessions
    ? data.studySessions.reduce((acc, session) => {
        const date = new Date(session.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(session);
        return acc;
      }, {} as Record<string, typeof data.studySessions>)
    : {};

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleAddSession = () => {
    actions.addStudySession({
      date: new Date(newSession.date).toISOString(),
      duration: newSession.duration,
      subjectId: newSession.subjectId,
    });

    toast({
      title: "Study session added",
      description: "Your study session has been recorded.",
    });

    // Reset form
    setNewSession({
      subjectId: null,
      duration: 1,
      date: format(new Date(), "yyyy-MM-dd"),
    });

    setIsAddDialogOpen(false);
  };

  const handleTimerComplete = (duration: number, subjectId: number | null) => {
    actions.addStudySession({
      date: new Date().toISOString(),
      duration,
      subjectId,
    });

    toast({
      title: "Study session completed!",
      description: `You've studied for ${duration.toFixed(
        1
      )} hours. Great job!`,
    });
  };

  const getSubjectName = (subjectId: number | null) => {
    if (!subjectId) return "General";
    const subject = data?.subjects?.find((s) => s.id === subjectId);
    return subject ? subject.name : "Unknown";
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Study Sessions</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Track and manage your study time
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Study Session</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Study Session</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Select
                  value={newSession.subjectId?.toString() || "none"}
                  onValueChange={(value) =>
                    setNewSession({
                      ...newSession,
                      subjectId: value !== "none" ? parseInt(value) : null,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">General</SelectItem>
                    {data?.subjects?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration (hours)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={newSession.duration}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      duration: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSession}>Add Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="glass mb-6">
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <Clock className="h-10 w-10 mb-4" />
                  <p>Weekly study visualization will be shown here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <TimerCard
            subjects={data?.subjects || []}
            onComplete={handleTimerComplete}
          />
        </div>
      </div>

      {!data?.studySessions || data.studySessions.length === 0 ? (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <Clock className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              No study sessions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              You haven't recorded any study sessions yet. Use the timer or add
              a session manually.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              Add Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h3 className="font-medium text-lg mb-4">Study History</h3>

          {sortedDates.map((date) => (
            <div key={date} className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {date}
              </h4>
              <Card className="glass">
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sessionsByDate[date].map((session) => (
                      <li
                        key={session.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {getSubjectName(session.subjectId)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(session.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="font-medium">
                            {session.duration.toFixed(1)} hours
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
