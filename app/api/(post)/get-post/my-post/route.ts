import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const posts = await Post.find({ postedBy: user.id })

  if (!posts) {
    throw new AppError(
      "No posts found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.POST.NOT_FOUND
    )
  }

  return successResponse("Posts fetched successfully", posts)
})
