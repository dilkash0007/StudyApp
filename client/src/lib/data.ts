import { useLocalStorage } from "@/hooks/use-local-storage";
import { getRandomColor, getInitials } from "@/lib/utils";

// Types
export interface Subject {
  id: number;
  name: string;
  progress: number;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  subjectId: number | null;
}

export interface StudySession {
  id: number;
  date: string;
  duration: number;
  subjectId: number | null;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  subjectId: number | null;
  date: string;
}

export interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface User {
  name: string;
  initials: string;
  role: string;
}

export interface AppData {
  subjects: Subject[];
  tasks: Task[];
  studySessions: StudySession[];
  notes: Note[];
  goals: Goal[];
  user: User;
}

// Initial data
export const initialData: AppData = {
  subjects: [
    { id: 1, name: "Mathematics", progress: 75, color: "#4A6FFF" },
    { id: 2, name: "Science", progress: 60, color: "#FF6B6B" },
    { id: 3, name: "History", progress: 40, color: "#8A4FFF" },
    { id: 4, name: "English", progress: 85, color: "#4ADE80" },
  ],
  tasks: [
    {
      id: 1,
      title: "Complete Mathematics Assignment",
      description: "Chapter 5 - Calculus Problems",
      dueDate: "Today",
      priority: "High",
      completed: false,
      subjectId: 1,
    },
    {
      id: 2,
      title: "Prepare Science Project",
      description: "Research on Renewable Energy",
      dueDate: "Tomorrow",
      priority: "Medium",
      completed: false,
      subjectId: 2,
    },
    {
      id: 3,
      title: "Review History Notes",
      description: "Chapter 7 - World War II",
      dueDate: "Sep 23",
      priority: "Low",
      completed: false,
      subjectId: 3,
    },
    {
      id: 4,
      title: "Prepare for English Presentation",
      description: "Literary Analysis Essay",
      dueDate: "Sep 25",
      priority: "High",
      completed: false,
      subjectId: 4,
    },
  ],
  studySessions: [
    {
      id: 1,
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 3.5,
      subjectId: 1,
    },
    {
      id: 2,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 2.2,
      subjectId: 2,
    },
    {
      id: 3,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 4.5,
      subjectId: 3,
    },
    {
      id: 4,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 3.0,
      subjectId: 4,
    },
    {
      id: 5,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 4.0,
      subjectId: 1,
    },
    {
      id: 6,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 1.5,
      subjectId: 2,
    },
    { id: 7, date: new Date().toISOString(), duration: 1.0, subjectId: 3 },
  ],
  notes: [
    {
      id: 1,
      title: "Integration Techniques",
      content:
        "Methods for solving various types of integrals including substitution, parts, partial fractions...",
      subjectId: 1,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: "Periodic Table Elements",
      content:
        "Key properties of transition metals and their compounds, including catalytic activity...",
      subjectId: 2,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      title: "World War II Timeline",
      content:
        "Major events chronologically ordered with key figures and turning points in the conflict...",
      subjectId: 3,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      title: "Literary Analysis Techniques",
      content:
        "Methods for analyzing themes, characters, and symbolism in literature with examples...",
      subjectId: 4,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  goals: [
    { id: 1, title: "Study Time", target: 4, current: 3, unit: "hours" },
    {
      id: 2,
      title: "Practice Problems",
      target: 20,
      current: 10,
      unit: "problems",
    },
    { id: 3, title: "Reading", target: 50, current: 15, unit: "pages" },
  ],
  user: {
    name: "Guest User",
    initials: "GU",
    role: "Student",
  },
};

// Hook for data
export function useStudyData() {
  const [data, setData] = useLocalStorage<AppData>(
    "studyTrackerData",
    initialData
  );

  // Subjects
  const addSubject = (name: string) => {
    if (!data.subjects) {
      const newSubject: Subject = {
        id: 1,
        name,
        progress: 0,
        color: getRandomColor(),
      };
      setData({ ...data, subjects: [newSubject] });
      return newSubject;
    }

    const newSubject: Subject = {
      id: Math.max(0, ...data.subjects.map((s) => s.id)) + 1,
      name,
      progress: 0,
      color: getRandomColor(),
    };
    setData({ ...data, subjects: [...data.subjects, newSubject] });
    return newSubject;
  };

  const updateSubject = (id: number, updates: Partial<Subject>) => {
    if (!data.subjects) return;

    setData({
      ...data,
      subjects: data.subjects.map((subject) =>
        subject.id === id ? { ...subject, ...updates } : subject
      ),
    });
  };

  const deleteSubject = (id: number) => {
    if (!data.subjects) return;

    setData({
      ...data,
      subjects: data.subjects.filter((subject) => subject.id !== id),
    });
  };

  // Tasks
  const addTask = (task: Omit<Task, "id">) => {
    if (!data.tasks) {
      const newTask: Task = {
        ...task,
        id: 1,
      };
      setData({ ...data, tasks: [newTask] });
      return newTask;
    }

    const newTask: Task = {
      ...task,
      id: Math.max(0, ...data.tasks.map((t) => t.id)) + 1,
    };
    setData({ ...data, tasks: [...data.tasks, newTask] });
    return newTask;
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    if (!data.tasks) return;

    setData({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    });
  };

  const deleteTask = (id: number) => {
    if (!data.tasks) return;

    setData({
      ...data,
      tasks: data.tasks.filter((task) => task.id !== id),
    });
  };

  // Study Sessions
  const addStudySession = (session: Omit<StudySession, "id">) => {
    // Handle the case where studySessions might be undefined
    if (!data.studySessions) {
      // If studySessions is undefined, initialize with the new session with id 1
      const newSession: StudySession = {
        ...session,
        id: 1,
      };
      setData({
        ...data,
        studySessions: [newSession],
      });
      return newSession;
    }

    // Normal case when studySessions exists
    const newSession: StudySession = {
      ...session,
      id: Math.max(0, ...data.studySessions.map((s) => s.id)) + 1,
    };
    setData({
      ...data,
      studySessions: [...data.studySessions, newSession],
    });
    return newSession;
  };

  const updateStudySession = (id: number, updates: Partial<StudySession>) => {
    if (!data.studySessions) return;

    setData({
      ...data,
      studySessions: data.studySessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      ),
    });
  };

  const deleteStudySession = (id: number) => {
    if (!data.studySessions) return;

    setData({
      ...data,
      studySessions: data.studySessions.filter((session) => session.id !== id),
    });
  };

  // Notes
  const addNote = (note: Omit<Note, "id">) => {
    if (!data.notes) {
      const newNote: Note = {
        ...note,
        id: 1,
      };
      setData({ ...data, notes: [newNote] });
      return newNote;
    }

    const newNote: Note = {
      ...note,
      id: Math.max(0, ...data.notes.map((n) => n.id)) + 1,
    };
    setData({ ...data, notes: [...data.notes, newNote] });
    return newNote;
  };

  const updateNote = (id: number, updates: Partial<Note>) => {
    if (!data.notes) return;

    setData({
      ...data,
      notes: data.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
    });
  };

  const deleteNote = (id: number) => {
    if (!data.notes) return;

    setData({
      ...data,
      notes: data.notes.filter((note) => note.id !== id),
    });
  };

  // Goals
  const addGoal = (goal: Omit<Goal, "id">) => {
    if (!data.goals) {
      const newGoal: Goal = {
        ...goal,
        id: 1,
      };
      setData({ ...data, goals: [newGoal] });
      return newGoal;
    }

    const newGoal: Goal = {
      ...goal,
      id: Math.max(0, ...data.goals.map((g) => g.id)) + 1,
    };
    setData({ ...data, goals: [...data.goals, newGoal] });
    return newGoal;
  };

  const updateGoal = (id: number, updates: Partial<Goal>) => {
    if (!data.goals) return;

    setData({
      ...data,
      goals: data.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    });
  };

  const deleteGoal = (id: number) => {
    if (!data.goals) return;

    setData({
      ...data,
      goals: data.goals.filter((goal) => goal.id !== id),
    });
  };

  // User
  const updateUser = (updates: Partial<User>) => {
    if (!data.user) {
      // Create a default user if none exists
      const defaultUser: User = {
        name: updates.name || "Guest User",
        initials: updates.name ? getInitials(updates.name) : "GU",
        role: updates.role || "Student",
      };
      setData({ ...data, user: { ...defaultUser, ...updates } });
      return;
    }

    const updatedUser = {
      ...data.user,
      ...updates,
      initials: updates.name ? getInitials(updates.name) : data.user.initials,
    };
    setData({ ...data, user: updatedUser });
  };

  return {
    data,
    subjects: data?.subjects || [],
    tasks: data?.tasks || [],
    studySessions: data?.studySessions || [],
    notes: data?.notes || [],
    goals: data?.goals || [],
    user: data?.user || {
      name: "Guest User",
      initials: "GU",
      role: "Student",
    },
    actions: {
      addSubject,
      updateSubject,
      deleteSubject,
      addTask,
      updateTask,
      deleteTask,
      addStudySession,
      updateStudySession,
      deleteStudySession,
      addNote,
      updateNote,
      deleteNote,
      addGoal,
      updateGoal,
      deleteGoal,
      updateUser,
    },
  };
}
