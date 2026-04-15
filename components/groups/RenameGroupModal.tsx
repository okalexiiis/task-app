"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface RenameGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  currentName: string;
}

export default function RenameGroupModal({
  isOpen,
  onClose,
  onRename,
  currentName,
}: RenameGroupModalProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!name.trim() || name === currentName) return;
    setLoading(true);
    try {
      await onRename(name.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renombrar Grupo">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del grupo"
          className="w-full bg-transparent border-b border-muted p-2 font-serif text-lg focus:border-accent no-input-ring"
          autoFocus
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10"
          >
            Cancelar
          </button>
          <button
            onClick={handleRename}
            disabled={loading || !name.trim() || name === currentName}
            className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
