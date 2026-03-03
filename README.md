# Nidito - Aplicación de Tareas

Esta es una aplicación de gestión de tareas construida con Next.js y TypeScript.

## Tareas Pendientes y Solucionadas

Aquí se listan los bugs encontrados y las mejoras planificadas.

- [x] **BUG: La creación de tareas fallaba si no se seleccionaba una fecha límite.**
  - **Causa:** El input de fecha enviaba un string vacío (`""`) que no era manejado correctamente.
  - **Solución:** Se transformó el valor a `null` en el componente del formulario antes de enviarlo.

- [x] **BUG: La actualización de estado de las tareas no era persistente.**
  - **Causa:** La función `toggle` solo actualizaba el estado en el frontend (actualización optimista) sin llamar a la API.
  - **Solución:** Se implementó la llamada a `PUT /api/tasks/[id]` para guardar el cambio en la base de datos.

- [x] **BUG: La eliminación de tareas no era persistente.**
  - **Causa:** La función `handleConfirmDelete` solo eliminaba la tarea del estado del frontend.
  - **Solución:** Se conectó la función para que llame a `DELETE /api/tasks/[id]` y guarde el cambio.

- [x] **MEJORA: Las tareas no tenían un orden lógico.**
  - **Causa:** Las tareas se mostraban en el orden en que llegaban de la API.
  - **Solución:** Se implementó una ordenación en el frontend que prioriza por `Prioridad` y luego por `Fecha de Creación`.

- [ ] **TODO:** Implementar la edición de tareas existentes.
- [ ] **TODO:** Añadir feedback visual (toasts/notificaciones) para las acciones del usuario (crear, eliminar, actualizar).
- [ ] **TODO:** Mejorar el rollback en caso de fallo de la API para que sea más robusto.
