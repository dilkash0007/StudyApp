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

export default function Dashboard() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  
  // Filter tasks to show only incomplete ones
  const incompleteTasks = data.tasks.filter(task => !task.completed).slice(0, 4);
  
  // Sort notes by date (newest first) and take the first 4
  const recentNotes = [...data.notes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const handleToggleTaskComplete = (id: number, completed: boolean) => {
    actions.updateTask(id, { completed });
    toast({
      title: completed ? "Task completed" : "Task marked as incomplete",
      description: "Your task has been updated.",
    });
  };

  const handleAddStudySession = (duration: number, subjectId: number | null) => {
    const today = new Date().toISOString();
    actions.addStudySession({
      date: today,
      duration,
      subjectId,
    });
    
    toast({
      title: "Study session completed!",
      description: `You've studied for ${duration.toFixed(1)} hours. Great job!`,
    });
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, your study progress overview</p>
        </div>
        <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </Button>
      </div>

      {/* Weekly Study Overview */}
      <StudyChart sessions={data.studySessions} />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <TimerCard subjects={data.subjects} onComplete={handleAddStudySession} />
        <SubjectProgress subjects={data.subjects} />
        <GoalsCard goals={data.goals} />
      </div>

      {/* Tasks List */}
      <TasksList tasks={incompleteTasks} onToggleComplete={handleToggleTaskComplete} />

      {/* Notes Grid */}
      <NotesGrid notes={recentNotes} subjects={data.subjects} />
    </div>
  );
}
