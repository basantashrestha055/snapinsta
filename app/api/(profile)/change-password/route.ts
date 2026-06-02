import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import User, { IUser } from "@/models/User.model"
import { NextRequest } from "next/server"

export const PUT = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    throw new AppError("Password is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const userExists = await User.findOne({ _id: user.id })

  if (!userExists) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  const isCurrentPasswordValid =
    await userExists.comparePassword(currentPassword)

  if (!isCurrentPasswordValid) {
    throw new AppError("Invalid current password", STATUS_CODES.BAD_REQUEST)
  }

  const isSamePassword = await userExists.comparePassword(newPassword)

  if (isSamePassword) {
    throw new AppError(
      "New password cannot be same as current password",
      STATUS_CODES.BAD_REQUEST
    )
  }

  userExists.password = newPassword
  await userExists.save()

  return successResponse("Password changed successfully, please log in again")
})
