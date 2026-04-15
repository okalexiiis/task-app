import { useState, useMemo } from "react";
import { Task, TaskStatusEnum } from "@/entities/Task";
import { useTasks } from "@/hooks/useTasks";
import { useGroup } from "@/hooks/useGroup";
import { CreateTaskData } from "@/components/tasks/CreateTaskForm";
import { useViewStore } from "@/store/view.store";
import { useGroups } from "./useGroups";

const PAGE_SIZE = 5;

export function useHomeLogic() {
  const {
    tasks,
    personalTasks,
    getGroupTasks,
    createTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();
  const { currentView, activeGroupId, setView, resetToHome } = useViewStore();
  const { groups, createGroup, renameGroup, deleteGroup } = useGroups();
  const { triggerGroupTasksRefresh } = useViewStore();
  const { userRole: groupUserRole } = useGroup(activeGroupId);
  const [activeTab, setActiveTab] = useState<TaskStatusEnum>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };

  // Lógica para decidir qué hace el botón principal
  const primaryAction = () => {
    if (currentView === "PERSONAL_TASKS") setCreateModalOpen(true); // Crear Tarea
    if (currentView === "GROUPS_LIST") setIsCreateGroupModalOpen(true); // Crear Grupo
    if (currentView === "GROUP_DETAIL") setCreateModalOpen(true); // Crear Tarea en Grupo (se verifica en page)
  };

  const toggleView = () => {
    if (currentView === "PERSONAL_TASKS") setView("GROUPS_LIST", null);
    else resetToHome();
  };

  const { paginatedTasks, totalPages, finishedPct } = useMemo(() => {
    const currentTasks =
      currentView === "GROUP_DETAIL" && activeGroupId
        ? getGroupTasks(activeGroupId)
        : personalTasks;

    console.log("currentTasks useHomeLogic", currentTasks);

    const filtered = currentTasks.filter((t) => t.status === activeTab);
    const finished = currentTasks.filter((t) =>
      ["DONE", "CANCELED"].includes(t.status),
    ).length;
    return {
      paginatedTasks: filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
      totalPages: Math.ceil(filtered.length / PAGE_SIZE),
      finishedPct: Math.round(
        (finished / Math.max(currentTasks.length, 1)) * 100,
      ),
    };
  }, [
    personalTasks,
    activeGroupId,
    currentView,
    activeTab,
    currentPage,
    getGroupTasks,
  ]);

  const handleCreateTask = async (data: CreateTaskData) => {
    console.log("[useHomeLogic] handleCreateTask called with:", data);
    try {
      await createTask(data);
      if (activeGroupId) {
        triggerGroupTasksRefresh();
      }
      setCreateModalOpen(false);
      setCurrentPage(1);
      showToast("¡Tarea creada!", "success");
    } catch (e) {
      console.error("[useHomeLogic] Error creating task:", e);
      showToast("Error al crear", "error");
    }
  };

  const handleCreateGroup = async (groupName: string) => {
    try {
      await createGroup(groupName);
      setIsCreateGroupModalOpen(false);
      showToast("¡Grupo creado!", "success");
    } catch (e) {
      showToast("Error al crear", "error");
    }
  };

  return {
    state: {
      activeTab,
      currentPage,
      taskToDelete,
      isCreateModalOpen,
      isCreateGroupModalOpen,
      currentView,
      activeGroupId,
      isGroupsView:
        currentView === "GROUPS_LIST" || currentView === "GROUP_DETAIL",
      toast,
      paginatedTasks,
      totalPages,
      finishedPct,
      groups,
      canCreateGroupTask:
        groupUserRole === "OWNER" || groupUserRole === "ADMIN",
    },
    actions: {
      setActiveTab,
      setCurrentPage,
      setTaskToDelete,
      primaryAction,
      toggleView,
      setCreateModalOpen,
      setIsCreateGroupModalOpen,
      setToast,
      handleCreateTask,
      handleCreateGroup,
      deleteTask,
      toggleTaskStatus,
      createGroup,
      renameGroup,
      deleteGroup,
      setView,
    },
  };
}
