"use client";
import Modal from "@/components/ui/Modal";
import CreateTaskForm, { CreateTaskData } from "./CreateTaskForm";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Tarea">
      <CreateTaskForm onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  );
}
