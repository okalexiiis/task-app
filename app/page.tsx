"use client";
import { Users } from "@/data/users";
import { Task } from "@/entities/Task";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/components/layout/Navbar";
import TaskList from "@/components/tasks/TaskList";
import ProgressBar from "@/components/ui/ProgressBar";
import { cycleStatus } from "@/utils/cycleStatus";

export default function Home() {
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { login, isAuthenticated, initialized, user } = useAuthStore();

  useEffect(() => {
    // Simulate login for "strawsara"
    login("strawsara", "12345678");
  }, [login]);

  useEffect(() => {
    login("strawsara", "12345678");
  }, [login]);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [initialized, isAuthenticated, router]);

  useEffect(() => {
    const getTasks = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/tasks", {
          headers: {
            "x-user-id": user.userId, // mandamos el userId
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setCurrentTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [user]);

  const currentUser = user || Users[0];

  const active = currentTasks.filter(
    (t) => t.status !== "DONE" && t.status !== "CANCELED",
  );
  const finished = currentTasks.filter(
    (t) => t.status === "DONE" || t.status === "CANCELED",
  );
  const pct = Math.round(
    (finished.length / Math.max(currentTasks.length, 1)) * 100,
  );

  function toggle(id: string) {
    setCurrentTasks((prev) =>
      prev.map((t) =>
        t._id === id
          ? {
              ...t,
              status: cycleStatus(t.status),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }

  return (
    <div className="bg-background min-h-screen text-primary font-dmono">
      <div className="max-w-[760px] mx-auto px-9">
        <NavBar user={currentUser} />
        <TaskList tasks={active} label="pendientes" onToggle={toggle} />
        <TaskList
          tasks={finished}
          label="completadas"
          finished
          onToggle={toggle}
        />
        <ProgressBar pct={pct} />
      </div>
    </div>
  );
}
