// services/groups/get-group-by-id.ts
import { getGroupById } from "@/services/groups/get-group-by-id";
import { deleteGroup } from "@/services/groups/delete-group";
import { updateGroup } from "@/services/groups/update-group";
import { getMemberRole } from "@/services/groups/members/get-member-role";
import { GroupPermissions } from "@/shared/group-permissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const result = await getGroupById(groupId);
  
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const userId = req.headers.get("x-user-id");
  
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleResult = await getMemberRole(groupId, userId);
  if (!roleResult.success) {
    return NextResponse.json({ message: roleResult.error.message }, { status: roleResult.status });
  }

  if (!GroupPermissions.canDeleteGroup(roleResult.data)) {
    return NextResponse.json({ message: "No tienes permisos para eliminar el grupo" }, { status: 403 });
  }

  const result = await deleteGroup(groupId);
  
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ message: "Grupo eliminado" }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const userId = req.headers.get("x-user-id");
  
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleResult = await getMemberRole(groupId, userId);
  if (!roleResult.success) {
    return NextResponse.json({ message: roleResult.error.message }, { status: roleResult.status });
  }

  if (!GroupPermissions.canRenameGroup(roleResult.data)) {
    return NextResponse.json({ message: "No tienes permisos para renombrar el grupo" }, { status: 403 });
  }

  const { groupName } = await req.json();
  if (!groupName) {
    return NextResponse.json({ message: "groupName requerido" }, { status: 400 });
  }

  const result = await updateGroup(groupId, groupName);
  
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ message: "Grupo actualizado" }, { status: 200 });
}
