import * as z from "zod"

export const verifycodeSchema = z.object({
  code: z.string().length(6, { message: "Invalid verification code" }),
})
