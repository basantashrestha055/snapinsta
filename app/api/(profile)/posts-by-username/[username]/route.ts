import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    username: string
  }>
}

export const GET = TryCatch(async (req: NextRequest, { params }: Props) => {
  await isAuthenticated()

  const { username } = await params

  if (!username) {
    throw new AppError("Username is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const user = await User.findOne({ username }).select("-password")

  if (!user) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 })

  if (!posts) {
    return successResponse("No posts found")
  }

  return successResponse("Posts fetched successfully", posts)
})
