"use client";
import { useState, useEffect, useCallback } from "react";
import { Group, GroupMember, GroupRoleEnum } from "@/entities/Group";
import { Task, TaskStatusEnum } from "@/entities/Task";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useViewStore } from "@/store/view.store";

export function useGroup(groupId: string | null) {
  const { user, isAuthenticated } = useRequireAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [groupTasks, setGroupTasks] = useState<Task[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchGroup = useCallback(async () => {
    if (!groupId || !user) return;
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (response.ok) {
        setGroup(data);
      }
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  }, [groupId, user]);

  const fetchMembers = useCallback(async () => {
    if (!groupId || !user) return;
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (response.ok) {
        setMembers(data);
        const currentMember = data.find(
          (m: GroupMember) => m.member_id === user.id,
        );
        setUserRole(currentMember?.role || null);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, [groupId, user]);

  const fetchGroupTasks = useCallback(async () => {
    if (!groupId || !user) return;
    try {
      const response = await fetch(`/api/groups/${groupId}/tasks`, {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (response.ok) {
        setGroupTasks(data);
      }
    } catch (error) {
      console.error("Error fetching group tasks:", error);
    }
  }, [groupId, user]);

  const { refreshGroupTasksTrigger } = useViewStore();

  useEffect(() => {
    if (refreshGroupTasksTrigger > 0) {
      fetchGroupTasks();
    }
  }, [refreshGroupTasksTrigger, fetchGroupTasks]);

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!user || !groupId) throw new Error("User not authenticated");
      const originalMembers = [...members];
      setMembers((prev) => prev.filter((m) => m.member_id !== memberId));
      try {
        const response = await fetch(
          `/api/groups/${groupId}/members/${memberId}`,
          {
            method: "DELETE",
            headers: { "x-user-id": user.id },
          },
        );
        if (!response.ok) {
          setMembers(originalMembers);
          const errorData = await response.json();
          throw new Error(errorData.message || "Error removing member");
        }
      } catch (error) {
        setMembers(originalMembers);
        throw error;
      }
    },
    [user, groupId, members],
  );

  const updateMemberRole = useCallback(
    async (memberId: string, role: GroupRoleEnum) => {
      if (!user || !groupId) throw new Error("User not authenticated");
      const originalMembers = [...members];
      setMembers((prev) =>
        prev.map((m) => (m.member_id === memberId ? { ...m, role } : m)),
      );
      try {
        const response = await fetch(
          `/api/groups/${groupId}/members/${memberId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user.id,
            },
            body: JSON.stringify({ role }),
          },
        );
        if (!response.ok) {
          setMembers(originalMembers);
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating role");
        }
      } catch (error) {
        setMembers(originalMembers);
        throw error;
      }
    },
    [user, groupId, members],
  );

  const addMember = useCallback(
    async (memberId: string) => {
      if (!user || !groupId) throw new Error("User not authenticated");
      try {
        const response = await fetch(`/api/groups/${groupId}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({ memberId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error adding member");
        }
        await fetchMembers();
      } catch (error) {
        throw error;
      }
    },
    [user, groupId, fetchMembers],
  );

  const toggleGroupTaskStatus = useCallback(
    async (taskId: string) => {
      console.log("toggleGroupTaskStatus called:", taskId, "role:", userRole);
      if (!user) throw new Error("User not authenticated");
      const task = groupTasks.find((t) => t.id === taskId);
      if (!task) {
        console.log("Task not found in groupTasks");
        return;
      }

      let newStatus: TaskStatusEnum | undefined;

      if (task.status === "DONE") {
        if (userRole === "MEMBER" && task.groupId) {
          console.log("Blocked: MEMBER cannot toggle from DONE");
          return;
        }
        if (task.groupId) {
          newStatus = "CANCELED";
        }
      } else {
        const nextStatus: Record<"PENDING" | "IN_PROGRESS" | "CANCELED", "IN_PROGRESS" | "DONE" | "PENDING"> = {
          PENDING: "IN_PROGRESS",
          IN_PROGRESS: "DONE",
          CANCELED: "PENDING",
        };
        newStatus = nextStatus[task.status as "PENDING" | "IN_PROGRESS" | "CANCELED"];
      }

      if (!newStatus) {
        console.log("No newStatus for:", task.status);
        return;
      }

      const originalTasks = [...groupTasks];
      setGroupTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );

      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          const data = await res.json();
          console.error("Error:", data.message);
          setGroupTasks(originalTasks);
        }
      } catch (e) {
        console.error("Error:", e);
        setGroupTasks(originalTasks);
      }
    },
    [user, groupTasks, userRole],
  );

  const deleteGroupTask = useCallback(
    async (taskId: string) => {
      if (!user) throw new Error("User not authenticated");
      const originalTasks = [...groupTasks];
      setGroupTasks((prev) => prev.filter((t) => t.id !== taskId));
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: { "x-user-id": user.id },
        });
        if (!response.ok) {
          setGroupTasks(originalTasks);
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting task");
        }
      } catch (error) {
        setGroupTasks(originalTasks);
        throw error;
      }
    },
    [user, groupTasks],
  );

  useEffect(() => {
    fetchGroup();
    fetchMembers();
    fetchGroupTasks();
  }, [fetchGroup, fetchMembers, fetchGroupTasks]);

  return {
    group,
    members,
    groupTasks,
    userRole,
    fetchGroup,
    fetchMembers,
    fetchGroupTasks,
    removeMember,
    updateMemberRole,
    addMember,
    toggleGroupTaskStatus,
    deleteGroupTask,
  };
}
