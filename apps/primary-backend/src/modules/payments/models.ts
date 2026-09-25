import { t } from "elysia";

export namespace PaymentsModel {
  export const orrampResponseSchema = t.Object({
    message: t.Literal("Onramp successful"),
    credits: t.Number(),
  });

  export type orrampResponseSchema = typeof orrampResponseSchema.static;

  export const onrampFailedResponseSchema = t.Object({
    message: t.Literal("Onramp failed"),
  });

  export type onrampFailedResponseSchema =
    typeof onrampFailedResponseSchema.static;
}
