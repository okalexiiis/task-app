"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/entities/User";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export function useSearchUsers() {
  const { user } = useRequireAuth();
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok) {
        setResults(data.filter((u: User) => u.id !== user?.id));
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => search(query), 300);
  }, [search]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    results,
    loading,
    search: debouncedSearch,
    clearResults,
  };
}
