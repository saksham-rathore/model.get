import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const app = new Elysia({ prefix: "api-keys" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .resolve(async ({cookie: { auth }, status, jwt}) => {
   if (!auth) {
      return status(401)
   }

   const decoded = await jwt.verify(auth.value as string);

   if (!decoded || !decoded.userId) {
      return status(401)
   }

   return {
      userId: decoded.userId as string
   }

  })
  .post("/", async ({userId, body}) => {
   
  })
  .get("/", () => {

  })
  .post("/disable", () => {}
)
  .delete("/", () => {

  });