import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentsModel } from "./models";
import { PaymentsService } from "./service";
import { readUserId } from "../../lib/auth-cookie";

export const app = new Elysia({ prefix: "payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  // Private router: every route below needs the login cookie.
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    const userId = await readUserId(auth, jwt);
    if (!userId) return status(401);
    return { userId };
  })
  .post(
    "/onramp",
    async ({ userId, status }) => {
      try {
        const credits = await PaymentsService.onramp(Number(userId));
        return {
          message: "Onramp successful" as const,
          credits,
        };
      } catch (error) {
        return status(411, {
          message: "Onramp failed" as const,
        });
      }
    },
    {
      response: {
        200: PaymentsModel.orrampResponseSchema,
        411: PaymentsModel.onrampFailedResponseSchema,
      },
    },
  );
