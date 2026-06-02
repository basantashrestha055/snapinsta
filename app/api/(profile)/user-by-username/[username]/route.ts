import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    username: string
  }>
}

export const GET = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { username } = await params

  if (!username) {
    throw new AppError("Username is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const userExists = await User.findOne({ username }).select("-password")

  if (!userExists) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  return successResponse("User fetched successfully", userExists)
})
