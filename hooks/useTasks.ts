"use client";
import { useState, useEffect, useCallback } from "react";
import { Task } from "@/entities/Task";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cycleStatus } from "@/utils/cycleStatus";
import { CreateTaskData } from "@/components/tasks/CreateTaskForm";

export function useTasks() {
  const { user, isAuthenticated } = useRequireAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await fetch("/api/tasks", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (data: CreateTaskData): Promise<Task> => {
      if (!user) throw new Error("User not authenticated");
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(data),
      });
      const newTask = await response.json();
      if (!response.ok)
        throw new Error(newTask.message || "Error creating task");
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    [user],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) throw new Error("User not authenticated");
      const originalTasks = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: { "x-user-id": user.id },
        });
        if (!response.ok) {
          setTasks(originalTasks);
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting task");
        }
      } catch (error) {
        setTasks(originalTasks);
        throw error;
      }
    },
    [user, tasks],
  );

  const toggleTaskStatus = useCallback(
    async (taskId: string) => {
      if (!user) throw new Error("User not authenticated");
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const newStatus = cycleStatus(task.status);
      const originalTasks = [...tasks];
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-user-id": user.id },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
          setTasks(originalTasks);
        }
      } catch (error) {
        setTasks(originalTasks);
        console.error("Error updating task:", error);
      }
    },
    [user, tasks],
  );

  return {
    tasks,
    fetchTasks,
    createTask,
    deleteTask,
    toggleTaskStatus,
  };
}
