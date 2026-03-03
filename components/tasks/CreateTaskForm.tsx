"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Priority, TaskStatus } from "@/entities/Task";

const createTaskSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  priority: z.enum(Priority),
  status: z.enum(TaskStatus).default("PENDING"),
  dueDate: z.string().optional().nullable(), // Acepta null
});

type CreateTaskData = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onSubmit: (data: CreateTaskData) => void;
  onClose: () => void;
}

export default function CreateTaskForm({
  onSubmit,
  onClose,
}: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "COULD",
      status: "PENDING",
    },
  });

  // Wrapper para transformar los datos antes de enviar
  const handleFormSubmit = (data: CreateTaskData) => {
    // Si la fecha está vacía, conviértela a null
    if (data.dueDate === "") {
      data.dueDate = null;
    }
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      {/* Campo Nombre */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          ¿Qué tienes que hacer?
        </label>
        <input
          {...register("name")}
          placeholder="Ej: Conquistar el mundo..."
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent"
        />
        {errors.name && (
          <p className="text-accent text-[10px]">{errors.name.message}</p>
        )}
      </div>

      {/* Campo Descripción */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Descripción (opcional)
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent"
        />
      </div>

      {/* Campo Prioridad */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Prioridad
        </label>
        <select
          {...register("priority")}
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent"
        >
          {Priority.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Campo Fecha de Entrega */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-widest text-secondary ml-1">
          Fecha Límite (opcional)
        </label>
        <input
          {...register("dueDate")}
          type="date"
          className="bg-transparent border-b border-muted p-2 font-mono text-sm no-input-ring focus:border-accent"
        />
      </div>

      {/* Acciones */}
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
          disabled={isSubmitting}
          className="px-4 py-2 bg-accent border border-accent text-white rounded-full text-sm font-mono hover:brightness-110"
        >
          Crear Tarea
        </button>
      </div>
    </form>
  );
}
