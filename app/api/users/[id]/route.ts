import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/services/users/update-user";
import { deleteUser } from "@/services/users/delete-user";
import { signToken, verifyToken } from "@/lib/jwt";

async function getAuthenticatedUserId(
  req: NextRequest,
): Promise<string | null> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authenticatedUserId = await getAuthenticatedUserId(req);

  if (authenticatedUserId !== id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { username, email, pfp } = await req.json();

  try {
    const updatedUser = await updateUser(id, { username, email, pfp });

    if (!updatedUser) {
      return NextResponse.json(
        { message: `User with ID ${id} not found` },
        { status: 404 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updatedUser;

    // 1. Firmar un nuevo token con la información actualizada
    const newToken = signToken({
      userId: safeUser.id,
      username: safeUser.username,
    });

    // 2. Crear la respuesta JSON
    const response = NextResponse.json({ user: safeUser });

    // 3. Establecer el nuevo token en una cookie
    response.cookies.set("auth-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authenticatedUserId = await getAuthenticatedUserId(req);
  if (authenticatedUserId !== id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    await deleteUser(id);
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
    response.cookies.set("auth-token", "", { maxAge: -1, path: "/" });
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 },
    );
  }
}
