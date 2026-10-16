import { t } from "elysia";

export namespace AuthModel {
  // ---- shared ----
  export const credentialsSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  // ---- POST /auth/sign-up ----
  export const signupResponseSchema = t.Object({
    id: t.String(),
    email: t.String(),
  });

  export const signupFailedResponseSchema = t.Object({
    message: t.Literal("Error while signing up"),
  });

  // ---- POST /auth/sign-in ----
  export const signinResponseSchema = t.Object({
    message: t.Literal("Signed in successfully"),
    email: t.String(),
  });

  export const signinFailureSchema = t.Object({
    message: t.Literal("Incorrect credentials"),
  });

  // ---- POST /auth/sign-out ----
  export const signoutResponseSchema = t.Object({
    message: t.Literal("Signed out"),
  });

  // ---- GET /auth/profile ----
  export const profileResponseSchema = t.Object({
    email: t.String(),
    credits: t.Number(),
  });

  export const profileResponseErrorSchema = t.Object({
    message: t.Literal("Error while fetching user details"),
  });
}
