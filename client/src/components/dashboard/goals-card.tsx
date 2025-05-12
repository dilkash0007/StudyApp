import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { Goal } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { getCircleProgress } from "@/lib/utils";

interface GoalsCardProps {
  goals: Goal[];
  onAddGoal?: () => void;
}

export function GoalsCard({ goals, onAddGoal }: GoalsCardProps) {
  return (
    <Card className="glass rounded-2xl p-6 shadow-lg hover-scale transition-all h-full">
      <CardHeader className="p-0 mb-6">
        <div className="flex justify-between items-start">
          <CardTitle className="font-semibold text-lg">Daily Goals</CardTitle>
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary-600 dark:hover:text-primary-300">
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {goals.map((goal) => (
          <div key={goal.id} className="mb-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative w-14 h-14 mr-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" className="dark:stroke-gray-700"></circle>
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={goal.title === "Study Time" ? "#4ADE80" : goal.title === "Reading" ? "#8A4FFF" : "#FF6B6B"}
                      strokeWidth="10" 
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={getCircleProgress((goal.current / goal.target) * 100, 45)}
                      className="transform -rotate-90 origin-center"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.current}/{goal.target} {goal.unit} completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline"
          onClick={onAddGoal}
          className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-colors"
        >
          Add New Goal
        </Button>
      </CardContent>
    </Card>
  );
}
