"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onSubmit(groupName.trim());
      setGroupName("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Grupo">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
            Nombre del Grupo
          </label>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ej: Equipo de Proyecto"
            className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!groupName.trim()}
            className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110 disabled:opacity-50"
          >
            Crear Grupo
          </button>
        </div>
      </form>
    </Modal>
  );
}
