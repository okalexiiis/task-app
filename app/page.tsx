"use client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useHomeLogic } from "@/hooks/useHomeLogic";
import { statusTranslations } from "@/utils/translations";
import ProgressBar from "@/components/ui/ProgressBar";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import DeleteConfirmationModal from "@/components/tasks/DeleteConfirmationModal";
import Toast from "@/components/Toast";
import PaginationControls from "@/components/layout/PaginationControls";
import TaskList from "@/components/tasks/TaskList";
import TaskTabs from "@/components/tasks/TaskTabs";
import NavBar from "@/components/layout/Navbar";
import GroupDetailView from "@/components/groups/GroupDetailView";
import GroupsList from "@/components/groups/GroupList";
import CreateGroupModal from "@/components/groups/CreateGroupModal";

export default function Home() {
  const { initialized, isAuthenticated, user } = useRequireAuth();
  const { state, actions } = useHomeLogic();

  if (!initialized) return <div className="text-center p-10">Cargando...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="bg-background min-h-screen text-primary font-dmono">
      <div className="max-w-[1200px] w-auto mx-auto px-4 md:px-9">
        <NavBar user={user}>
          <button
            onClick={actions.primaryAction}
            className="bg-accent px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={state.currentView === "GROUP_DETAIL" && !state.canCreateGroupTask}
          >
            {state.currentView === "GROUPS_LIST"
              ? "+ Nuevo Grupo"
              : "+ Nueva Tarea"}
          </button>

          <button
            onClick={actions.toggleView}
            className="border border-accent px-4 py-2 rounded-full"
          >
            {state.isGroupsView ? "Ver mis Tareas" : "Ver Grupos"}
          </button>
        </NavBar>

        {state.currentView === "PERSONAL_TASKS" && (
          <>
            <TaskTabs
              activeTab={state.activeTab}
              onTabChange={(tab) => {
                actions.setActiveTab(tab);
                actions.setCurrentPage(1);
              }}
            />

            <TaskList
              tasks={state.paginatedTasks}
              label={`${statusTranslations[state.activeTab]} (${state.paginatedTasks.length})`}
              finished={["DONE", "CANCELED"].includes(state.activeTab)}
              canDelete={true}
              onToggle={actions.toggleTaskStatus}
              onDelete={(id) =>
                actions.setTaskToDelete(
                  state.paginatedTasks.find((t) => t.id === id) || null,
                )
              }
            />
          </>
        )}

        {state.currentView === "GROUPS_LIST" && (
          <GroupsList
            groups={state.groups}
            onSelectGroup={(id) => actions.setView("GROUP_DETAIL", id)}
          />
        )}

        {state.currentView === "GROUP_DETAIL" && (
          <GroupDetailView groupId={state.activeGroupId} />
        )}

        <PaginationControls
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          onPageChange={actions.setCurrentPage}
        />
        <ProgressBar pct={state.finishedPct} />
      </div>

      <CreateTaskModal
        isOpen={state.isCreateModalOpen}
        onClose={() => actions.setCreateModalOpen(false)}
        onSubmit={actions.handleCreateTask}
        groupId={state.currentView === "GROUP_DETAIL" ? state.activeGroupId : null}
      />
      <DeleteConfirmationModal
        task={state.taskToDelete}
        onClose={() => actions.setTaskToDelete(null)}
        onConfirm={async () => {
          await actions.deleteTask(state.taskToDelete!.id);
          actions.setTaskToDelete(null);
        }}
      />
      {state.toast && (
        <Toast {...state.toast} onClose={() => actions.setToast(null)} />
      )}
      <CreateGroupModal
        isOpen={state.isCreateGroupModalOpen}
        onClose={() => actions.setIsCreateGroupModalOpen(false)}
        onSubmit={actions.handleCreateGroup}
      />
    </div>
  );
}
