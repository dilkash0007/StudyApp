import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Plus } from "lucide-react";
import { Note, Subject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface NotesGridProps {
  notes: Note[];
  subjects: Subject[];
  onAddNote?: () => void;
}

export function NotesGrid({ notes, subjects, onAddNote }: NotesGridProps) {
  // Function to get subject name and color
  const getSubjectInfo = (subjectId: number | null) => {
    if (!subjectId) return { name: "General", color: "#6B7280" };
    const subject = subjects.find(s => s.id === subjectId);
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
    <Card className="glass rounded-2xl p-6 shadow-lg hover-scale transition-all">
      <CardHeader className="p-0 mb-6">
        <div className="flex justify-between items-center">
          <CardTitle className="font-semibold text-lg">Recent Notes</CardTitle>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAddNote}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => {
            const subjectInfo = getSubjectInfo(note.subjectId);
            return (
              <div key={note.id} className={`p-4 rounded-xl ${getNoteBgClass(note.subjectId)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getNoteBadgeClass(note.subjectId)}`}>
                    {subjectInfo.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(note.date)}
                  </span>
                </div>
                <h4 className="font-medium mb-2">{note.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {note.content}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium">
            <Link href="/notes">View All Notes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
