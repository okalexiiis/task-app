import { NextResponse } from "next/server";
import { Result } from "../result";

export function handleResult<T>(result: Result<T>) {
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return null;
}
