import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useSearch, useRoute } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// User info schema
const userInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  educationLevel: z.string().min(1, { message: "Please select your education level" }),
  institute: z.string().min(2, { message: "Institute name must be at least 2 characters" }),
  studyGoal: z.string().min(2, { message: "Study goal must be at least 2 characters" }),
});

type UserInfoFormValues = z.infer<typeof userInfoSchema>;

export default function UserInfoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const searchParams = useSearch();
  const [userData, setUserData] = useLocalStorage<{
    user: null | { 
      name: string; 
      initials: string; 
      role: string;
      age?: string;
      educationLevel?: string;
      institute?: string;
      studyGoal?: string;
    }
  }>("studyTrackerData", { 
    user: null
  });
  
  // Extract query parameters
  const params = new URLSearchParams(searchParams);
  const username = params.get("username") || "";
  const name = params.get("name") || "";
  const isNewUser = params.get("isNewUser") === "true";

  // Redirect if already logged in
  if (userData.user) {
    navigate("/");
    return null;
  }
  
  // Initialize form with default values
  const form = useForm<UserInfoFormValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: name || "",
      age: "",
      educationLevel: "",
      institute: "",
      studyGoal: "",
    },
  });

  async function onSubmit(values: UserInfoFormValues) {
    setIsLoading(true);
    try {
      // Create user data to store in localStorage
      const newUserData = {
        user: {
          name: values.fullName,
          initials: values.fullName.split(" ").map(n => n[0]).join("").toUpperCase(),
          role: "Student",
          age: values.age,
          educationLevel: values.educationLevel,
          institute: values.institute,
          studyGoal: values.studyGoal,
        },
      };
      
      // Store data in localStorage
      setUserData(newUserData);
      
      toast({
        title: isNewUser ? "Account created successfully!" : "Welcome back!",
        description: "You have been logged in to StudyTracker",
      });
      
      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <Card className="w-full max-w-lg glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            {isNewUser 
              ? "Please provide some information to get started with StudyTracker" 
              : "Please provide your information to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="21" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute/School</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="studyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="Complete my degree with good grades" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}