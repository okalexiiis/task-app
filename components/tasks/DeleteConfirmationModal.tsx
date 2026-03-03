"use client";
import Modal from "@/components/ui/Modal";
import { Task } from "@/entities/Task";

interface DeleteConfirmationModalProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  task,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      title="Confirmar Eliminación"
    >
      <div>
        <p className="text-secondary mb-6">
          ¿Estás seguro de que deseas eliminar la tarea{" "}
          <strong className="text-primary font-serif italic">
            {task?.name}
          </strong>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-secondary text-secondary rounded-full text-sm font-mono hover:bg-secondary/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110 transition-all"
          >
            Eliminar Tarea
          </button>
        </div>
      </div>
    </Modal>
  );
}
