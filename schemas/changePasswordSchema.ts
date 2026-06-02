import * as z from "zod"

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password must be at most 20 characters long" })

export const changePasswordSchema = z.object({
  currentPassword: passwordValidation,
  newPassword: passwordValidation,
})
