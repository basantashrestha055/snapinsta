import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const PUT = TryCatch(async (req: NextRequest) => {
  const { code, username } = await req.json()

  if (!code || !username) {
    throw new AppError("Missing Parameters", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const user = await User.findOne({ username })

  if (!user) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  if (code !== user.verifyCode) {
    throw new AppError("Invalid verification code", STATUS_CODES.BAD_REQUEST)
  }

  user.isVerified = true
  await user.save()

  return successResponse("Email verified successfully", user)
})
