import { getGroupMembers } from "@/services/groups/members/get-group-members";
import { getMemberRole } from "@/services/groups/members/get-member-role";
import { newMember } from "@/services/groups/members/new-member";
import { getUserById } from "@/services/users/get-user-by-id";
import { GroupPermissions } from "@/shared/group-permissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const requesterId = req.headers.get("x-user-id");
  
  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleResult = await getMemberRole(groupId, requesterId);
  if (!roleResult.success) {
    return NextResponse.json(
      { message: roleResult.error.message },
      { status: roleResult.status },
    );
  }

  const result = await getGroupMembers(groupId);
  
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const requesterId = req.headers.get("x-user-id");
  
  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleResult = await getMemberRole(groupId, requesterId);
  if (!roleResult.success) {
    return NextResponse.json(
      { message: roleResult.error.message },
      { status: roleResult.status },
    );
  }

  if (!GroupPermissions.canAddMember(roleResult.data)) {
    return NextResponse.json(
      { message: "Sin permisos para agregar miembros" },
      { status: 403 },
    );
  }

  const { memberId } = await req.json();
  if (!memberId) {
    return NextResponse.json(
      { message: "memberId requerido" },
      { status: 400 },
    );
  }

  const userResult = await getUserById(memberId);
  if (!userResult.success) {
    return NextResponse.json(
      { message: userResult.error.message },
      { status: userResult.status },
    );
  }

  const result = await newMember({ group_id: groupId, member_id: memberId });
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}
