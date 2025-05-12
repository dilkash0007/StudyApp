import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Plus } from "lucide-react";
import { Task } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TasksListProps {
  tasks: Task[];
  onToggleComplete: (id: number, completed: boolean) => void;
  onAddTask?: () => void;
}

export function TasksList({ tasks, onToggleComplete, onAddTask }: TasksListProps) {
  // Function to get badge color based on priority
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive';
      case 'Medium':
        return 'bg-primary-100 dark:bg-primary-900 text-primary dark:text-primary-300';
      case 'Low':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <Card className="glass rounded-2xl p-6 shadow-lg hover-scale transition-all mb-8">
      <CardHeader className="p-0 mb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="font-semibold text-lg">Upcoming Tasks</CardTitle>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAddTask}
              className="text-primary hover:text-primary-600 dark:hover:text-primary-300 mr-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary hover:text-primary-600 dark:hover:text-primary-300"
            >
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={(checked) => onToggleComplete(task.id, checked === true)}
                className="h-5 w-5 rounded-md mr-4"
              />
              <div className="flex-1">
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">{task.dueDate}</span>
                <span className={`px-2 py-1 text-xs rounded-md ${getPriorityBadgeClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            <Link href="/tasks">View All Tasks</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
