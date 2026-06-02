import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const PUT = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      accountType: user.accountType === "public" ? "private" : "public",
    },
    {
      returnDocument: "after",
    }
  )

  if (!updatedUser) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  return successResponse("Profile updated successfully", updatedUser)
})
