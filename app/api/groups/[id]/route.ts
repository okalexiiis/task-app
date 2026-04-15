// services/groups/get-group-by-id.ts
import { getGroupById } from "@/services/groups/get-group-by-id";
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
