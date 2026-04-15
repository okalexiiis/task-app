"use client";
import { useState } from "react";
import { GroupRole, GroupRoleEnum } from "@/entities/Group";
import { GroupPermissions } from "@/shared/group-permissions";
import { useGroup } from "@/hooks/useGroup";
import { useGroups } from "@/hooks/useGroups";
import GroupOptionsDropdown from "./GroupOptionsDropdown";
import AddMemberModal from "./AddMemberModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/Toast";
import TaskTabs from "@/components/tasks/TaskTabs";
import TaskList from "@/components/tasks/TaskList";
import { TaskStatusEnum } from "@/entities/Task";

const PAGE_SIZE = 5;

export default function GroupDetailView({
  groupId,
}: {
  groupId: string | null;
}) {
  const [activeSubTab, setActiveSubTab] = useState<"TASKS" | "MEMBERS">(
    "TASKS",
  );
  const [activeTab, setActiveTab] = useState<TaskStatusEnum>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const {
    group,
    members,
    userRole,
    removeMember,
    updateMemberRole,
    groupTasks,
    toggleGroupTaskStatus,
    deleteGroupTask,
  } = useGroup(groupId);
  const { renameGroup, deleteGroup } = useGroups();

  const canToggleTask =
    userRole === "OWNER" || userRole === "ADMIN" || userRole === "MEMBER";
  const canAddOrDeleteTask = userRole === "OWNER" || userRole === "ADMIN";

  const filteredTasks = groupTasks.filter((t) => t.status === activeTab);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleRename = () => {
    const newName = prompt("Nuevo nombre:", group?.groupName);
    if (newName && groupId) {
      renameGroup(groupId, newName);
    }
  };

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Grupo",
      message:
        "¿Estás seguro de eliminar el grupo? Esta acción no se puede deshacer.",
      onConfirm: () => groupId && deleteGroup(groupId),
    });
  };

  const handleLeave = () => {
    console.log("Leave group");
  };

  const handleRemoveMember = (memberId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Miembro",
      message: "¿Estás seguro de eliminar este miembro del grupo?",
      onConfirm: () => removeMember(memberId),
    });
  };

  const handleChangeRole = async (memberId: string, currentRole: string) => {
    const newRole =
      currentRole === "ADMIN"
        ? "MEMBER"
        : currentRole === "MEMBER"
          ? "ADMIN"
          : "MEMBER";
    setConfirmModal({
      isOpen: true,
      title: "Cambiar Rol",
      message: `¿Estás seguro de cambiar el rol a ${newRole}?`,
      onConfirm: () => updateMemberRole(memberId, newRole as GroupRoleEnum),
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Tarea",
      message: "¿Estás seguro de eliminar esta tarea?",
      onConfirm: async () => {
        try {
          await deleteGroupTask(taskId);
          setToast({ message: "¡Tarea eliminada!", type: "success" });
        } catch {
          setToast({ message: "Error al eliminar tarea", type: "error" });
        }
      },
    });
  };

  if (!groupId) return null;

  const canManageMembers = userRole === "OWNER" || userRole === "ADMIN";

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold italic font-serif">
          {group?.groupName || "Cargando..."}
        </h2>
        {userRole && (
          <GroupOptionsDropdown
            role={userRole as GroupRoleEnum}
            onRename={handleRename}
            onDelete={handleDelete}
            onLeave={handleLeave}
          />
        )}
      </div>

      <div className="flex gap-6 border-b border-muted mb-4">
        <button
          onClick={() => setActiveSubTab("TASKS")}
          className={`pb-2 text-sm font-mono ${
            activeSubTab === "TASKS"
              ? "border-b-2 border-accent text-accent"
              : "text-secondary"
          }`}
        >
          TAREAS
        </button>
        <button
          onClick={() => setActiveSubTab("MEMBERS")}
          className={`pb-2 text-sm font-mono ${
            activeSubTab === "MEMBERS"
              ? "border-b-2 border-accent text-accent"
              : "text-secondary"
          }`}
        >
          USUARIOS
        </button>
      </div>

      {activeSubTab === "TASKS" ? (
        <div>
          <TaskTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />
          <TaskList
            tasks={paginatedTasks}
            label={`Tareas del grupo (${filteredTasks.length})`}
            finished={["DONE", "CANCELED"].includes(activeTab)}
            canDelete={canAddOrDeleteTask}
            onToggle={(id) => {
              if (canToggleTask) toggleGroupTaskStatus(id);
            }}
            onDelete={canAddOrDeleteTask ? handleDeleteTask : undefined}
          />
          {filteredTasks.length > PAGE_SIZE && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-muted rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                {currentPage} / {Math.ceil(filteredTasks.length / PAGE_SIZE)}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={
                  currentPage >= Math.ceil(filteredTasks.length / PAGE_SIZE)
                }
                className="px-3 py-1 border border-muted rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.length === 0 ? (
            <p className="text-sm text-muted">No hay miembros</p>
          ) : (
            members.map((member) => (
              <div
                key={member.member_id}
                className="p-3 border border-muted rounded flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {member.userName || member.member_id}
                  </span>
                  <span className="text-xs text-secondary">
                    {member.userEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded uppercase">
                    {member.role}
                  </span>
                  {canManageMembers && member.role !== "OWNER" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleChangeRole(member.member_id, member.role)
                        }
                        className="text-sm text-accent hover:underline cursor-pointer px-2"
                        title={
                          member.role === "ADMIN" ? " degradar" : "promover"
                        }
                      >
                        {member.role === "ADMIN" ? "↓" : "↑"}
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.member_id)}
                        className="text-sm text-accent hover:underline cursor-pointer px-2"
                        title="Eliminar miembro"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {canManageMembers && (
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="p-3 border border-dashed border-muted rounded text-center text-sm text-muted hover:border-accent hover:text-accent transition-colors"
            >
              + Agregar miembro
            </button>
          )}
        </div>
      )}

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        groupId={groupId}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
