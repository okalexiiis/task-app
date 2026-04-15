//store/view.store.ts
import { create } from "zustand";

type View = "PERSONAL_TASKS" | "GROUPS_LIST" | "GROUP_DETAIL";

interface ViewState {
  currentView: View;
  activeGroupId: string | null;
  refreshGroupTasksTrigger: number;
  setView: (view: View, groupId: string | null) => void;
  resetToHome: () => void;
  triggerGroupTasksRefresh: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: "PERSONAL_TASKS",
  activeGroupId: null,
  refreshGroupTasksTrigger: 0,
  setView: (view, groupId = null) =>
    set({ currentView: view, activeGroupId: groupId }),
  resetToHome: () =>
    set({ currentView: "PERSONAL_TASKS", activeGroupId: null }),
  triggerGroupTasksRefresh: () =>
    set((state) => ({ refreshGroupTasksTrigger: state.refreshGroupTasksTrigger + 1 })),
}));
