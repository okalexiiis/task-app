"use client";
import { useState, useEffect, useCallback } from "react";
import { Group } from "@/entities/Group";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export function useGroups() {
  const { user, isAuthenticated } = useRequireAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await fetch("/api/groups", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(
    async (groupName: string): Promise<Group> => {
      if (!user) throw new Error("User not authenticated");
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({ groupName }),
      });
      const newGroup = await response.json();
      if (!response.ok)
        throw new Error(newGroup.message || "Error creating group");
      setGroups((prev) => [newGroup, ...prev]);
      return newGroup;
    },
    [user],
  );

  const renameGroup = useCallback(
    async (groupId: string, groupName: string): Promise<Group> => {
      if (!user) throw new Error("User not authenticated");
      const originalGroups = [...groups];
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, groupName } : g)),
      );
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-user-id": user.id },
          body: JSON.stringify({ groupName }),
        });
        const updatedGroup = await response.json();
        if (!response.ok) {
          setGroups(originalGroups);
          throw new Error(updatedGroup.message || "Error renaming group");
        }
        return { ...updatedGroup, groupName };
      } catch (error) {
        setGroups(originalGroups);
        throw error;
      }
    },
    [user, groups],
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      if (!user) throw new Error("User not authenticated");
      const originalGroups = [...groups];
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          method: "DELETE",
          headers: { "x-user-id": user.id },
        });
        if (!response.ok) {
          setGroups(originalGroups);
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting group");
        }
      } catch (error) {
        setGroups(originalGroups);
        throw error;
      }
    },
    [user, groups],
  );

  return {
    groups,
    fetchGroups,
    createGroup,
    renameGroup,
    deleteGroup,
  };
}
