"use client";
import { Task, TaskStatusEnum } from "@/entities/Task";
import { useState, useMemo } from "react";
import NavBar from "@/components/layout/Navbar";
import TaskList from "@/components/tasks/TaskList";
import ProgressBar from "@/components/ui/ProgressBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import PaginationControls from "@/components/layout/PaginationControls";
import Toast from "@/components/Toast";
import { useTasks } from "@/hooks/useTasks";
import TaskTabs from "@/components/tasks/TaskTabs";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import DeleteConfirmationModal from "@/components/tasks/DeleteConfirmationModal";
import { statusTranslations } from "@/utils/translations";
import { CreateTaskData } from "@/components/tasks/CreateTaskForm";

type ToastType = "success" | "error" | "warning";

const PAGE_SIZE = 5;

export default function Home() {
  const { user, initialized, isAuthenticated } = useRequireAuth();
  const { tasks, createTask, deleteTask, toggleTaskStatus } = useTasks();

  const [activeTab, setActiveTab] = useState<TaskStatusEnum>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const handleTabChange = (tab: TaskStatusEnum) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const showToast = (message: string, type: ToastType) => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      setCreateModalOpen(false);
      showToast("¡Tarea creada con éxito!", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear la tarea";
      showToast(message, "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      showToast("¡Tarea eliminada!", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar la tarea";
      showToast(message, "error");
    }
  };

  const { paginatedTasks, totalPages, finishedPct } = useMemo(() => {
    const filtered = tasks.filter((t) => t.status === activeTab);
    const total = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );
    const finishedCount = tasks.filter(
      (t) => t.status === "DONE" || t.status === "CANCELED",
    ).length;
    const pct = Math.round((finishedCount / Math.max(tasks.length, 1)) * 100);
    return {
      paginatedTasks: paginated,
      totalPages: total,
      finishedPct: pct,
    };
  }, [tasks, activeTab, currentPage]);

  if (!initialized) {
    return <div className="text-center p-10">Cargando...</div>;
  }
  if (!isAuthenticated) return null;

  return (
    <>
      <div className="bg-background min-h-screen text-primary font-dmono">
        <div className="max-w-[760px] mx-auto px-4 md:px-9">
          <NavBar user={user}>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-accent text-white font-serif italic py-2 px-5 rounded-full text-sm hover:brightness-110 transition-all cursor-pointer"
            >
              + Nueva Tarea
            </button>
          </NavBar>
          <TaskTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <TaskList
            tasks={paginatedTasks}
            label={`${statusTranslations[activeTab]} (${
              paginatedTasks.length
            })`}
            finished={activeTab === "DONE" || activeTab === "CANCELED"}
            onToggle={toggleTaskStatus}
            onDelete={(id) =>
              setTaskToDelete(tasks.find((t) => t.id === id) || null)
            }
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <ProgressBar pct={finishedPct} />
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <DeleteConfirmationModal
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
