"use client";
import { Task, TaskStatusEnum, TaskStatus } from "@/entities/Task";
import { useEffect, useState } from "react";
import NavBar from "@/components/layout/Navbar";
import TaskList from "@/components/tasks/TaskList";
import ProgressBar from "@/components/ui/ProgressBar";
import { cycleStatus } from "@/utils/cycleStatus";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import clsx from "clsx";
import PaginationControls from "@/components/layout/PaginationControls";
import Modal from "@/components/ui/Modal";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";

const TABS: TaskStatusEnum[] = [...TaskStatus];
const PAGE_SIZE = 5;

export default function Home() {
  const { user, initialized, isAuthenticated } = useRequireAuth();
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskStatusEnum>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Vuelve el estado local

  const fetchTasks = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await fetch("/api/tasks", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCurrentTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleCreateTask = async (data: any) => {
    if (!user) return;
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify(data),
      });
      const newTask = await response.json();
      if (response.ok) {
        setCurrentTasks((prev) => [newTask, ...prev]);
        setCreateModalOpen(false); // Usa el estado local
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !taskToDelete) return;
    const originalTasks = [...currentTasks];
    setCurrentTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);

    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      });
      if (!response.ok) {
        setCurrentTasks(originalTasks);
      }
    } catch (error) {
      setCurrentTasks(originalTasks);
      console.error("Error deleting task:", error);
    }
  };

  const toggle = async (id: string) => {
    if (!user) return;
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = cycleStatus(task.status);
    const originalTasks = [...currentTasks];

    setCurrentTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        setCurrentTasks(originalTasks);
      }
    } catch (error) {
      setCurrentTasks(originalTasks);
      console.error("Error updating task:", error);
    }
  };

  if (!initialized) {
    return <div className="text-center p-10">Cargando...</div>;
  }
  if (!isAuthenticated) return null;

  const filteredTasks = currentTasks.filter((t) => t.status === activeTab);
  const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const finishedCount = currentTasks.filter(
    (t) => t.status === "DONE" || t.status === "CANCELED",
  ).length;
  const pct = Math.round(
    (finishedCount / Math.max(currentTasks.length, 1)) * 100,
  );

  return (
    <>
      <div className="bg-background min-h-screen text-primary font-dmono">
        <div className="max-w-[760px] mx-auto px-9">
          <NavBar user={user}>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-accent text-white font-serif italic py-2 px-5 rounded-full text-sm hover:brightness-110 transition-all"
            >
              + Nueva Tarea
            </button>
          </NavBar>
          <div className="flex border-b border-muted/50 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "py-2 px-4 font-mono text-sm transition-colors",
                  {
                    "text-accent border-b-2 border-accent": activeTab === tab,
                    "text-secondary hover:text-primary": activeTab !== tab,
                  },
                )}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
          <TaskList
            tasks={paginatedTasks}
            label={`${activeTab.replace("_", " ")} (${filteredTasks.length})`}
            finished={activeTab === "DONE" || activeTab === "CANCELED"}
            onToggle={toggle}
            onDelete={(id) =>
              setTaskToDelete(currentTasks.find((t) => t.id === id) || null)
            }
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <ProgressBar pct={pct} />
        </div>
      </div>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Crear Nueva Tarea"
      >
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onClose={() => setCreateModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Confirmar Eliminación"
      >
        <div>
          <p className="text-secondary mb-6">
            ¿Estás seguro de que deseas eliminar la tarea{" "}
            <strong className="text-primary font-serif italic">
              {taskToDelete?.name}
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setTaskToDelete(null)}
              className="px-4 py-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110 transition-all"
            >
              Eliminar Tarea
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
