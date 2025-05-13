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
import { Plus, Edit, Trash2, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateProgress, getCircleProgress } from "@/lib/utils";

export default function Goals() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: 1,
    current: 0,
    unit: "hours",
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }

    if (newGoal.target <= 0) {
      toast({
        title: "Error",
        description: "Target must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    actions.addGoal({
      ...newGoal,
      current: Math.min(newGoal.current, newGoal.target), // Ensure current doesn't exceed target
    });

    toast({
      title: "Goal added",
      description: "Your new goal has been created.",
    });

    // Reset form
    setNewGoal({
      title: "",
      target: 1,
      current: 0,
      unit: "hours",
    });

    setIsAddDialogOpen(false);
  };

  const handleEditGoal = () => {
    if (!selectedGoal) return;

    if (!newGoal.title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }

    if (newGoal.target <= 0) {
      toast({
        title: "Error",
        description: "Target must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    actions.updateGoal(selectedGoal, {
      ...newGoal,
      current: Math.min(newGoal.current, newGoal.target), // Ensure current doesn't exceed target
    });

    toast({
      title: "Goal updated",
      description: "Your goal has been updated.",
    });

    // Reset form
    setNewGoal({
      title: "",
      target: 1,
      current: 0,
      unit: "hours",
    });

    setSelectedGoal(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteGoal = (id: number) => {
    actions.deleteGoal(id);

    toast({
      title: "Goal deleted",
      description: "The goal has been removed.",
    });
  };

  const openEditDialog = (goal: any) => {
    if (!goal) return;

    setSelectedGoal(goal.id);
    setNewGoal({
      title: goal.title,
      target: goal.target,
      current: goal.current,
      unit: goal.unit,
    });
    setIsEditDialogOpen(true);
  };

  const handleIncrementProgress = (
    id: number,
    current: number,
    target: number,
    title: string,
    unit: string
  ) => {
    const newCurrent = Math.min(current + 1, target);
    actions.updateGoal(id, { current: newCurrent });

    // If the goal unit is hours, create a study session for 1 hour
    if (unit === "hours") {
      actions.addStudySession({
        date: new Date().toISOString(),
        duration: 1, // 1 hour increment
        subjectId: null, // No specific subject
      });
    }

    if (newCurrent === target) {
      toast({
        title: "Goal completed!",
        description: "Congratulations on reaching your goal!",
      });
    } else {
      toast({
        title: "Progress updated",
        description: "Your goal progress has been updated.",
      });
    }
  };

  const handleDecrementProgress = (id: number, current: number) => {
    if (current <= 0) return;

    actions.updateGoal(id, { current: current - 1 });
    toast({
      title: "Progress updated",
      description: "Your goal progress has been updated.",
    });
  };

  // Function to get color based on goal type/title
  const getGoalColor = (title: string) => {
    if (title === "Study Time") return "#4ADE80"; // success
    if (title === "Reading") return "#8A4FFF"; // accent
    return "#FF6B6B"; // secondary
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Goals</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Set and track your study targets
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Goal Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter goal title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="target" className="text-sm font-medium">
                    Target
                  </label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    placeholder="Enter target"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        target: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Select
                    value={newGoal.unit}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="pages">Pages</SelectItem>
                      <SelectItem value="problems">Problems</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                      <SelectItem value="sessions">Sessions</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="current" className="text-sm font-medium">
                  Current Progress
                </label>
                <Input
                  id="current"
                  type="number"
                  min="0"
                  placeholder="Enter current progress"
                  value={newGoal.current}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      current: parseInt(e.target.value) || 0,
                    })
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
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Goal Title
                </label>
                <Input
                  id="edit-title"
                  placeholder="Enter goal title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-target" className="text-sm font-medium">
                    Target
                  </label>
                  <Input
                    id="edit-target"
                    type="number"
                    min="1"
                    placeholder="Enter target"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        target: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Select
                    value={newGoal.unit}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="pages">Pages</SelectItem>
                      <SelectItem value="problems">Problems</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                      <SelectItem value="sessions">Sessions</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-current" className="text-sm font-medium">
                  Current Progress
                </label>
                <Input
                  id="edit-current"
                  type="number"
                  min="0"
                  placeholder="Enter current progress"
                  value={newGoal.current}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      current: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditGoal}>Update Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!data?.goals || data.goals.length === 0 ? (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <Target className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No goals found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              You haven't created any goals yet. Add a goal to start tracking
              your progress.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.goals?.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);
            const strokeDashoffset = getCircleProgress(progress, 45);
            const goalColor = getGoalColor(goal.title);

            return (
              <Card key={goal.id} className="glass hover-scale transition-all">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-semibold text-lg">
                      {goal.title}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(goal)}
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-500 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="relative w-14 h-14 mr-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="10"
                            className="dark:stroke-gray-700"
                          ></circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={goalColor}
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={strokeDashoffset}
                            className="transform -rotate-90 origin-center"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {progress}%
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Progress
                        </p>
                        <p className="font-medium">
                          {goal.current}/{goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDecrementProgress(goal.id, goal.current)
                      }
                      disabled={goal.current <= 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleIncrementProgress(
                          goal.id,
                          goal.current,
                          goal.target,
                          goal.title,
                          goal.unit
                        )
                      }
                      disabled={goal.current >= goal.target}
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">
          Tips for Setting Effective Goals
        </h3>
        <Card className="glass">
          <CardContent className="p-6">
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <span className="font-medium">Be specific:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  Set clear, measurable goals like "Read 30 pages" instead of
                  "Read more".
                </span>
              </li>
              <li>
                <span className="font-medium">Break it down:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  Divide larger goals into smaller, manageable tasks.
                </span>
              </li>
              <li>
                <span className="font-medium">Track regularly:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  Update your progress daily to stay motivated.
                </span>
              </li>
              <li>
                <span className="font-medium">Reward yourself:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  Celebrate when you reach milestones.
                </span>
              </li>
              <li>
                <span className="font-medium">Review and adjust:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  Periodically evaluate your goals and modify them if needed.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
