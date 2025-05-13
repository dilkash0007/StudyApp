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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRandomColor } from "@/lib/utils";

export default function Subjects() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  // New subject form state
  const [newSubject, setNewSubject] = useState({
    name: "",
    progress: 0,
  });

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    actions.addSubject(newSubject.name);

    toast({
      title: "Subject added",
      description: "Your new subject has been created.",
    });

    // Reset form
    setNewSubject({
      name: "",
      progress: 0,
    });

    setIsAddDialogOpen(false);
  };

  const handleEditSubject = () => {
    if (!selectedSubject) return;

    if (!newSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    actions.updateSubject(selectedSubject, {
      name: newSubject.name,
      progress: newSubject.progress,
    });

    toast({
      title: "Subject updated",
      description: "Your subject has been updated.",
    });

    // Reset form
    setNewSubject({
      name: "",
      progress: 0,
    });

    setSelectedSubject(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubject = (id: number) => {
    actions.deleteSubject(id);

    toast({
      title: "Subject deleted",
      description: "The subject has been removed.",
    });
  };

  const openEditDialog = (subject: (typeof data.subjects)[0]) => {
    if (!subject) return;

    setSelectedSubject(subject.id);
    setNewSubject({
      name: subject.name,
      progress: subject.progress,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Subjects</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your study subjects and track progress
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Subject</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Subject Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter subject name"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
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
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Subject Name
                </label>
                <Input
                  id="edit-name"
                  placeholder="Enter subject name"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-progress" className="text-sm font-medium">
                  Progress ({newSubject.progress}%)
                </label>
                <Input
                  id="edit-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={newSubject.progress}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      progress: parseInt(e.target.value),
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
              <Button onClick={handleEditSubject}>Update Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!data?.subjects || data.subjects.length === 0 ? (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500 dark:text-gray-400"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No subjects found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              You haven't added any subjects yet. Add a subject to start
              tracking your progress.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.subjects?.map((subject) => (
            <Card key={subject.id} className="glass hover-scale">
              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-semibold text-lg">
                    {subject.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(subject)}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-gray-500 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="mb-4 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-medium">
                      {subject.progress}%
                    </span>
                  </div>
                  <Progress
                    value={subject.progress}
                    className="h-2 bg-gray-100 dark:bg-gray-700"
                    indicatorColor={subject.color}
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Study sessions
                      </p>
                      <p className="font-medium">
                        {
                          data.studySessions.filter(
                            (session) => session.subjectId === subject.id
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total hours
                      </p>
                      <p className="font-medium">
                        {data.studySessions
                          .filter((session) => session.subjectId === subject.id)
                          .reduce(
                            (total, session) => total + session.duration,
                            0
                          )
                          .toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
