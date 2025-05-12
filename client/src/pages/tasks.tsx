import { useState } from "react";
import { useStudyData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Tasks() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "completed" | "active">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "High" | "Medium" | "Low">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "Today",
    priority: "Medium" as "High" | "Medium" | "Low",
    subjectId: null as number | null,
  });

  // Filter tasks
  const filteredTasks = data.tasks.filter(task => {
    // Text search
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Completion status
    const matchesCompleted = filterCompleted === "all" || 
                             (filterCompleted === "completed" && task.completed) ||
                             (filterCompleted === "active" && !task.completed);
    
    // Priority
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    return matchesSearch && matchesCompleted && matchesPriority;
  });

  // Group tasks by due date
  const groupedTasks: Record<string, typeof filteredTasks> = {};
  filteredTasks.forEach(task => {
    if (!groupedTasks[task.dueDate]) {
      groupedTasks[task.dueDate] = [];
    }
    groupedTasks[task.dueDate].push(task);
  });

  // Sort due dates: Today, Tomorrow, then by future dates
  const sortedDueDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Tomorrow") return -1;
    if (b === "Tomorrow") return 1;
    return a.localeCompare(b);
  });

  const handleToggleComplete = (id: number, completed: boolean) => {
    actions.updateTask(id, { completed });
    toast({
      title: completed ? "Task completed" : "Task marked as incomplete",
      description: "Your task has been updated.",
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    actions.addTask({
      ...newTask,
      completed: false,
    });

    toast({
      title: "Task added",
      description: "Your new task has been created.",
    });

    // Reset form
    setNewTask({
      title: "",
      description: "",
      dueDate: "Today",
      priority: "Medium",
      subjectId: null,
    });

    setIsAddDialogOpen(false);
  };

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
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your assignments and deadlines</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                  <Select 
                    value={newTask.dueDate} 
                    onValueChange={(value) => setNewTask({ ...newTask, dueDate: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select due date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="Next Week">Next Week</SelectItem>
                      <SelectItem value="Later">Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: "High" | "Medium" | "Low") => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject (Optional)</label>
                <Select 
                  value={newTask.subjectId?.toString() || ""} 
                  onValueChange={(value) => setNewTask({ ...newTask, subjectId: value ? parseInt(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {data.subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters & Search */}
      <Card className="glass mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCompleted} onValueChange={(value: "all" | "completed" | "active") => setFilterCompleted(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={(value: "all" | "High" | "Medium" | "Low") => setFilterPriority(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {searchQuery 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "You don't have any tasks yet. Add a new task to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedDueDates.map((dueDate) => (
          <div key={dueDate} className="mb-6">
            <h3 className="font-medium text-lg mb-3">{dueDate}</h3>
            <Card className="glass">
              <CardContent className="p-2 divide-y divide-gray-200 dark:divide-gray-700">
                {groupedTasks[dueDate].map((task) => (
                  <div key={task.id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={(checked) => handleToggleComplete(task.id, checked === true)}
                      className="h-5 w-5 rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                    </div>
                    <div className="flex items-center">
                      {task.subjectId && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                          {data.subjects.find(s => s.id === task.subjectId)?.name}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-md ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
