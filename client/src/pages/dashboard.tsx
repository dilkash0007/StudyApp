import { useState } from "react";
import { StudyChart } from "@/components/dashboard/study-chart";
import { SubjectProgress } from "@/components/dashboard/subject-progress";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { TasksList } from "@/components/dashboard/tasks-list";
import { NotesGrid } from "@/components/dashboard/notes-grid";
import { TimerCard } from "@/components/study/timer-card";
import { useStudyData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [duration, setDuration] = useState("1.0");

  // Filter tasks to show only incomplete ones with null check
  const incompleteTasks = data?.tasks
    ? data.tasks.filter((task) => !task.completed).slice(0, 4)
    : [];

  // Sort notes by date (newest first) and take the first 4 with null check
  const recentNotes = data?.notes
    ? [...data.notes]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4)
    : [];

  const handleToggleTaskComplete = (id: number, completed: boolean) => {
    actions.updateTask(id, { completed });
    toast({
      title: completed ? "Task completed" : "Task marked as incomplete",
      description: "Your task has been updated.",
    });
  };

  const handleAddStudySession = (
    duration: number,
    subjectId: number | null
  ) => {
    const today = new Date().toISOString();
    actions.addStudySession({
      date: today,
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

  const handleNewSessionSubmit = () => {
    const subjectId =
      selectedSubject && selectedSubject !== "none"
        ? parseInt(selectedSubject)
        : null;
    const durationValue = parseFloat(duration);

    if (isNaN(durationValue) || durationValue <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a valid duration greater than 0",
        variant: "destructive",
      });
      return;
    }

    handleAddStudySession(durationValue, subjectId);
    setIsDialogOpen(false);
    setSelectedSubject(null);
    setDuration("1.0");
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, your study progress overview
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Study Session</DialogTitle>
              <DialogDescription>
                Record your study session by entering the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select
                  value={selectedSubject || "none"}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.subjects?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="none">No specific subject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleNewSessionSubmit}>
                Add Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Study Overview */}
      <StudyChart sessions={data?.studySessions || []} />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <TimerCard
          subjects={data?.subjects || []}
          onComplete={handleAddStudySession}
        />
        <SubjectProgress subjects={data?.subjects || []} />
        <GoalsCard goals={data?.goals || []} />
      </div>

      {/* Tasks List */}
      <TasksList
        tasks={incompleteTasks}
        onToggleComplete={handleToggleTaskComplete}
      />

      {/* Notes Grid */}
      <NotesGrid notes={recentNotes} subjects={data?.subjects || []} />
    </div>
  );
}
