"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/Toast";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useGroup } from "@/hooks/useGroup";
import { User } from "@/entities/User";
import Image from "next/image";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  onSuccess?: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}: AddMemberModalProps) {
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { results, loading, search, clearResults } = useSearchUsers();
  const { addMember } = useGroup(groupId);

  const handleAddMember = async (user: User) => {
    if (!groupId) return;
    setAddingId(user.id);
    try {
      await addMember(user.id);
      clearResults();
      setQuery("");
      onClose();
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al agregar miembro";
      setToast({ message, type: "error" });
    } finally {
      setAddingId(null);
    }
  };

  const handleClose = () => {
    clearResults();
    setQuery("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Miembro">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              search(e.target.value);
            }}
            placeholder="Buscar usuario por username..."
            className="w-full bg-transparent border-b border-muted p-2 font-mono text-sm focus:border-accent no-input-ring"
            autoFocus
          />

          {loading && <p className="text-sm text-muted">Buscando...</p>}

          {results.length > 0 && (
            <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {results.map((user) => (
                <li
                  key={user.id}
                  className="p-2 border border-muted rounded flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.pfp}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                      <span className="text-xs text-muted">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user)}
                    disabled={addingId === user.id}
                    className="px-3 py-1 text-xs bg-accent text-white rounded-full hover:brightness-110 disabled:opacity-50"
                  >
                    {addingId === user.id ? "Agregando..." : "Agregar"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <p className="text-sm text-muted">No se encontraron usuarios</p>
          )}

          {query.length < 2 && !loading && (
            <p className="text-sm text-muted">
              Escribe al menos 2 caracteres para buscar
            </p>
          )}
        </div>
      </Modal>
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
