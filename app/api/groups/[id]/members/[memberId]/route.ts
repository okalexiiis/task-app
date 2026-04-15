import { getMemberRole } from "@/services/groups/members/get-member-role";
import { updateMemberRole } from "@/services/groups/members/update-member-role";
import { removeMember } from "@/services/groups/members/remove-member";
import { GroupPermissions } from "@/shared/group-permissions";
import { Group, GroupRole } from "@/entities/Group";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  const { id: groupId, memberId } = await params;
  const requesterId = req.headers.get("x-user-id");
  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();

  // Validar que el rol sea válido
  if (!role || !GroupRole.includes(role)) {
    return NextResponse.json({ message: "Rol inválido" }, { status: 400 });
  }

  // No se puede asignar OWNER por esta vía
  if (role === "OWNER") {
    return NextResponse.json(
      { message: "No se puede asignar el rol OWNER" },
      { status: 403 },
    );
  }

  const requesterRoleResult = await getMemberRole(groupId, requesterId);
  if (!requesterRoleResult.success) {
    return NextResponse.json(
      { message: requesterRoleResult.error.message },
      { status: requesterRoleResult.status },
    );
  }

  if (!GroupPermissions.canPromoteToAdmin(requesterRoleResult.data)) {
    return NextResponse.json(
      { message: "Sin permisos para cambiar roles" },
      { status: 403 },
    );
  }

  // Obtener rol del target para proteger al owner
  const targetRoleResult = await getMemberRole(groupId, memberId);
  if (!targetRoleResult.success) {
    return NextResponse.json(
      { message: targetRoleResult.error.message },
      { status: targetRoleResult.status },
    );
  }

  if (targetRoleResult.data === "OWNER") {
    return NextResponse.json(
      { message: "No se puede cambiar el rol del owner" },
      { status: 403 },
    );
  }

  const result = await updateMemberRole(groupId, memberId, role);
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  const { id: groupId, memberId } = await params;
  const requesterId = req.headers.get("x-user-id");
  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const requesterRoleResult = await getMemberRole(groupId, requesterId);
  if (!requesterRoleResult.success) {
    return NextResponse.json(
      { message: requesterRoleResult.error.message },
      { status: requesterRoleResult.status },
    );
  }

  const targetRoleResult = await getMemberRole(groupId, memberId);
  if (!targetRoleResult.success) {
    return NextResponse.json(
      { message: targetRoleResult.error.message },
      { status: targetRoleResult.status },
    );
  }

  if (
    !GroupPermissions.canRemoveMember(
      requesterRoleResult.data,
      targetRoleResult.data,
    )
  ) {
    return NextResponse.json(
      { message: "Sin permisos para eliminar este miembro" },
      { status: 403 },
    );
  }

  const result = await removeMember(groupId, memberId);
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
