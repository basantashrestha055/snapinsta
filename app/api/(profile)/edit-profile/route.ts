import { errorResponse, successResponse } from "@/lib/apiResponse"
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

  const { name, username, bio, profilepic } = await req.json()

  await dbConnect()

  if (username) {
    if (username !== user?.username) {
      const usernameExists = await User.findOne({ username }).select(
        "-password"
      )

      if (usernameExists) {
        throw new AppError(
          "Username already exists",
          STATUS_CODES.BAD_REQUEST,
          ERROR_CODES.USER.ALREADY_EXISTS
        )
      }
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user?.id,
    },
    {
      ...(name && { name }),
      ...(username && { username }),
      ...(bio && { bio }),
      ...(profilepic && { profilepic }),
    },
    {
      returnDocument: "after",
    }
  )

  return successResponse("Profile updated", updatedUser)
})
