import { prisma } from "db";

export abstract class AuthService {
  // Create a user. Passwords are hashed with bun's built-in hasher,
  // never stored in plain text.
  static async signup(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string }> {
    const user = await prisma.user.create({
      data: {
        email,
        password: await Bun.password.hash(password),
      },
    });
    return { id: user.id.toString(), email: user.email };
  }

  // Returns the user id when email + password match, nothing otherwise.
  // (Same response for "unknown email" and "wrong password" so attackers
  // can't probe which emails exist.)
  static async signin(
    email: string,
    password: string,
  ): Promise<{ correctCredentials: boolean; userId?: string }> {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return { correctCredentials: false };
    if (!(await Bun.password.verify(password, user.password))) {
      return { correctCredentials: false };
    }
    return { correctCredentials: true, userId: user.id.toString() };
  }

  // What the frontend shows: who I am + my credit balance.
  static async getUserDetails(id: number) {
    return prisma.user.findFirst({
      where: { id },
      select: { email: true, credits: true },
    });
  }
}
