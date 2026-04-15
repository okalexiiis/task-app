import { searchUsersByUsername } from "@/services/users/search-users-by-username";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const result = await searchUsersByUsername(query.trim());
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
