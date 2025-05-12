import { useState } from "react";
import { useStudyData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime } from "@/lib/utils";

export default function Notes() {
  const { data, actions } = useStudyData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  
  // New note form state
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    subjectId: null as number | null,
  });

  // Filter notes
  const filteredNotes = data.notes.filter(note => {
    // Text search
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Subject filter
    const matchesSubject = filterSubject === "all" || 
                           (filterSubject === "none" && note.subjectId === null) ||
                           note.subjectId?.toString() === filterSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Sort notes by date (newest first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive",
      });
      return;
    }

    if (!newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Note content is required",
        variant: "destructive",
      });
      return;
    }

    actions.addNote({
      ...newNote,
      date: new Date().toISOString(),
    });

    toast({
      title: "Note added",
      description: "Your new note has been created.",
    });

    // Reset form
    setNewNote({
      title: "",
      content: "",
      subjectId: null,
    });

    setIsAddDialogOpen(false);
  };

  const handleEditNote = () => {
    if (!selectedNote) return;
    
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive",
      });
      return;
    }

    if (!newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Note content is required",
        variant: "destructive",
      });
      return;
    }

    const existingNote = data.notes.find(note => note.id === selectedNote);
    if (!existingNote) return;

    actions.updateNote(selectedNote, {
      ...newNote,
      date: existingNote.date, // Keep original date
    });

    toast({
      title: "Note updated",
      description: "Your note has been updated.",
    });

    // Reset form
    setNewNote({
      title: "",
      content: "",
      subjectId: null,
    });
    
    setSelectedNote(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteNote = (id: number) => {
    actions.deleteNote(id);
    
    toast({
      title: "Note deleted",
      description: "The note has been removed.",
    });
  };

  const openEditDialog = (note: typeof data.notes[0]) => {
    setSelectedNote(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      subjectId: note.subjectId,
    });
    setIsEditDialogOpen(true);
  };

  // Function to get subject name and color
  const getSubjectInfo = (subjectId: number | null) => {
    if (!subjectId) return { name: "General", color: "#6B7280" };
    const subject = data.subjects.find(s => s.id === subjectId);
    return subject 
      ? { name: subject.name, color: subject.color } 
      : { name: "Unknown", color: "#6B7280" };
  };

  // Function to get background color based on subject
  const getNoteBgClass = (subjectId: number | null) => {
    const subjectInfo = getSubjectInfo(subjectId);
    if (subjectInfo.name === "Mathematics") return "bg-primary-50 dark:bg-gray-800";
    if (subjectInfo.name === "Science") return "bg-secondary-50 dark:bg-gray-800";
    if (subjectInfo.name === "History") return "bg-gray-50 dark:bg-gray-800";
    if (subjectInfo.name === "English") return "bg-accent-50 dark:bg-gray-800";
    return "bg-gray-50 dark:bg-gray-800";
  };
  
  // Function to get badge color based on subject
  const getNoteBadgeClass = (subjectId: number | null) => {
    const subjectInfo = getSubjectInfo(subjectId);
    if (subjectInfo.name === "Mathematics") return "bg-primary-100 dark:bg-primary-900 text-primary dark:text-primary-300";
    if (subjectInfo.name === "Science") return "bg-secondary-100 dark:bg-secondary-900 text-secondary dark:text-secondary-300";
    if (subjectInfo.name === "History") return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    if (subjectInfo.name === "English") return "bg-accent-100 dark:bg-accent-900 text-accent";
    return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Notes</h2>
          <p className="text-gray-500 dark:text-gray-400">Organize your study notes and key concepts</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Note</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  placeholder="Enter note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="content"
                  placeholder="Enter note content"
                  rows={5}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject (Optional)</label>
                <Select 
                  value={newNote.subjectId?.toString() || ""} 
                  onValueChange={(value) => setNewNote({ ...newNote, subjectId: value ? parseInt(value) : null })}
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
              <Button onClick={handleAddNote}>Add Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
                <Input
                  id="edit-title"
                  placeholder="Enter note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-content" className="text-sm font-medium">Content</label>
                <Textarea
                  id="edit-content"
                  placeholder="Enter note content"
                  rows={5}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-subject" className="text-sm font-medium">Subject (Optional)</label>
                <Select 
                  value={newNote.subjectId?.toString() || ""} 
                  onValueChange={(value) => setNewNote({ ...newNote, subjectId: value ? parseInt(value) : null })}
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditNote}>Update Note</Button>
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
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="none">General</SelectItem>
                  {data.subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No notes found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {searchQuery || filterSubject !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't created any notes yet. Add a note to get started."}
            </p>
            {!searchQuery && filterSubject === "all" && (
              <Button 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Create Your First Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => {
            const subjectInfo = getSubjectInfo(note.subjectId);
            return (
              <Card key={note.id} className={`glass hover-scale transition-all`}>
                <CardContent className={`p-5 ${getNoteBgClass(note.subjectId)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getNoteBadgeClass(note.subjectId)}`}>
                      {subjectInfo.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(note.date)}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {note.content}
                  </p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(note)}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-500 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
