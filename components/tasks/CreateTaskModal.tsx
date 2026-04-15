"use client";
import Modal from "@/components/ui/Modal";
import CreateTaskForm, { CreateTaskData } from "./CreateTaskForm";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  groupId?: string | null;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  groupId,
}: CreateTaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Tarea">
      <CreateTaskForm onSubmit={onSubmit} onClose={onClose} groupId={groupId} />
    </Modal>
  );
}
