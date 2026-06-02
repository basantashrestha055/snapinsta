import * as z from "zod"
import { usernameValidation } from "./signupSchema"

export const editProfileSchema = z.object({
  profilepic: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    })
    .optional(),
  username: usernameValidation.optional(),
  bio: z
    .string()
    .max(100, { message: "Bio must be at most 100 characters long" })
    .optional(),
})
