// How login works in this project (one place to learn it):
//
//  1. POST /auth/sign-up or /auth/sign-in verifies the user and stores a
//     signed JWT in the `auth` cookie (httpOnly, 7 days).
//  2. Every private route calls `readUserId()` below to turn that cookie
//     back into a user id. No cookie / bad token -> null -> route 401s.
//
// The frontend never touches this cookie directly (httpOnly). It just sends
// `credentials: "include"` and asks GET /auth/profile "who am I?".

interface JwtLike {
  verify: (token: string) => Promise<unknown>;
}

interface CookieLike {
  value?: unknown;
}

export async function readUserId(
  auth: CookieLike | undefined,
  jwt: JwtLike,
): Promise<string | null> {
  if (!auth || typeof auth.value !== "string" || !auth.value) return null;

  const decoded = await jwt.verify(auth.value);
  if (!decoded || typeof decoded !== "object") return null;

  const userId = (decoded as { userId?: unknown }).userId;
  return typeof userId === "string" ? userId : null;
}

// Same cookie options everywhere so sign-in / sign-up / sign-out agree.
export const AUTH_COOKIE = {
  httpOnly: true,
  maxAge: 7 * 86400,
} as const;
