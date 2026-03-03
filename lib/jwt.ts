// lib/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
// Forzamos el tipo o usamos un valor por defecto seguro
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido");
}

export interface JWTPayload {
  userId: string;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  // Definimos las opciones explícitamente para evitar ambigüedad en las sobrecargas
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload & {
      iat: number;
      exp: number;
    };
    return {
      userId: decoded.userId,
      username: decoded.username,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Es buena práctica manejar el error aquí o relanzarlo con un mensaje claro
    throw new Error("Token inválido o expirado");
  }
}
