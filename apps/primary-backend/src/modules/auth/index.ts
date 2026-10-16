// Auth routes: sign-up, sign-in, sign-out (public) + profile (private).
// Login state lives in the httpOnly `auth` cookie, see ../lib/auth-cookie.
import { Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import { AUTH_COOKIE, readUserId } from "../../lib/auth-cookie";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))

  // ---- public ----
  .post(
    "/sign-up",
    async ({ jwt, body, status, cookie: { auth } }) => {
      try {
        const user = await AuthService.signup(body.email, body.password);
        // Log the new user straight in so the frontend needs no extra call.
        auth?.set({ ...AUTH_COOKIE, value: await jwt.sign({ userId: user.id }) });
        return { id: user.id, email: user.email };
      } catch (e) {
        console.log(e);
        return status(400, { message: "Error while signing up" });
      }
    },
    {
      body: AuthModel.credentialsSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponseSchema,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { correctCredentials, userId } = await AuthService.signin(
        body.email,
        body.password,
      );
      if (!correctCredentials || !userId) {
        return status(403, { message: "Incorrect credentials" });
      }
      auth?.set({ ...AUTH_COOKIE, value: await jwt.sign({ userId }) });
      return { message: "Signed in successfully" as const, email: body.email };
    },
    {
      body: AuthModel.credentialsSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        403: AuthModel.signinFailureSchema,
      },
    },
  )
  .post("/sign-out", ({ cookie: { auth } }) => {
    auth?.remove();
    return { message: "Signed out" as const };
  }, {
    response: { 200: AuthModel.signoutResponseSchema },
  })

  // ---- private (everything below needs the login cookie) ----
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    const userId = await readUserId(auth, jwt);
    if (!userId) return status(401);
    return { userId };
  })
  .get("/profile", async ({ userId, status }) => {
    const userData = await AuthService.getUserDetails(Number(userId));
    if (!userData) {
      return status(400, { message: "Error while fetching user details" });
    }
    return userData;
  }, {
    response: {
      200: AuthModel.profileResponseSchema,
      400: AuthModel.profileResponseErrorSchema,
    },
  });
