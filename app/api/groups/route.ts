// api/groups/route.ts
import { getGroupsByUser } from "@/services/groups/get-group-by-user";
import { newGroup } from "@/services/groups/new-group";
import { getUserById } from "@/services/users/get-user-by-id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const owner = req.headers.get("x-user-id");

  if (!owner) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // 🔍 Validar usuario
  const userResult = await getUserById(owner);

  if (!userResult.success) {
    return NextResponse.json(
      { message: userResult.error.message },
      { status: userResult.status },
    );
  }

  // ✅ Usuario existe
  const newGroupData = { ...body, owner };

  const groupResult = await newGroup(newGroupData);

  if (!groupResult.success) {
    return NextResponse.json(
      { message: groupResult.error.message },
      { status: groupResult.status },
    );
  }

  return NextResponse.json(groupResult.data, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userResult = await getUserById(userId);
  if (!userResult.success) {
    return NextResponse.json(
      { message: userResult.error.message },
      { status: userResult.status },
    );
  }

  const groupsResult = await getGroupsByUser(userId);
  if (!groupsResult.success) {
    return NextResponse.json(
      { message: groupsResult.error.message },
      { status: groupsResult.status },
    );
  }

  const groups = groupsResult.data.map((row) => row.group);
  return NextResponse.json(groups, { status: 200 });
}
