import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { insertUserSchema } from "@shared/schema";
// import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/hooks/use-theme";

// Extended schema with validation
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = insertUserSchema
  .extend({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [userData, setUserData] = useLocalStorage<{
    user: null | {
      name: string;
      initials: string;
      role: string;
      age?: string;
      educationLevel?: string;
      institute?: string;
      studyGoal?: string;
    };
  }>("studyTrackerData", {
    user: null,
  });

  // Check if user is already logged in using useEffect instead of during render
  useEffect(() => {
    if (userData.user) {
      navigate("/");
    }
  }, [userData.user, navigate]);

  // If user is already logged in, render nothing until the navigate happens
  if (userData.user) {
    return null;
  }

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      // Login directly with user-entered credentials and proceed to user info page
      navigate(`/user-info?username=${encodeURIComponent(values.username)}`);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      // Navigate to user info page with the registered username
      navigate(
        `/user-info?username=${encodeURIComponent(
          values.username
        )}&name=${encodeURIComponent(values.name)}&isNewUser=true`
      );
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute top-1/3 -right-20 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container flex flex-col lg:flex-row gap-10 items-center justify-between px-4 py-8 max-w-7xl">
        {/* Auth Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                StudyTracker
              </CardTitle>
              <CardDescription className="text-center">
                Your personal study companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="login"
                onValueChange={(v) => setAuthMode(v as any)}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={registerForm.control}
                        name="name"
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
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Hero Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Study Smarter, Not Harder
          </h1>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Track your study sessions, manage tasks, take notes, and reach your
            academic goals with our comprehensive study tracking app.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
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
                  className="text-blue-600 dark:text-blue-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Track Study Time
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Log your study sessions
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md mr-3">
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
                  className="text-green-600 dark:text-green-400"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Manage Tasks
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stay on top of assignments
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md mr-3">
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
                  className="text-purple-600 dark:text-purple-400"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Take Notes
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organize study materials
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-md mr-3">
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
                  className="text-amber-600 dark:text-amber-400"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Set Goals
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track progress & achievements
                </p>
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl shadow-lg">
            <p className="italic text-gray-600 dark:text-gray-300">
              "StudyTracker has helped me improve my productivity and stay
              organized with my coursework. The visual progress tracking is a
              game-changer!"
            </p>
            <div className="mt-3 flex items-center justify-center lg:justify-start">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary">
                <span>JS</span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Computer Science Student
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
