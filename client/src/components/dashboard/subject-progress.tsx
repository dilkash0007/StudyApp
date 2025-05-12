import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { Subject } from "@/lib/data";
import { Button } from "@/components/ui/button";

interface SubjectProgressProps {
  subjects: Subject[];
}

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  return (
    <Card className="glass rounded-2xl p-6 shadow-lg hover-scale transition-all h-full">
      <CardHeader className="p-0 mb-6">
        <div className="flex justify-between items-start">
          <CardTitle className="font-semibold text-lg">Subject Progress</CardTitle>
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary-600 dark:hover:text-primary-300">
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {subjects.map((subject) => (
          <div key={subject.id} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{subject.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{subject.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
              ></div>
            </div>
          </div>
        ))}

        <Button
          variant="link"
          asChild
          className="w-full mt-4 text-center text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium"
        >
          <Link href="/subjects">View All Subjects</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
