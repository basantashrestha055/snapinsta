import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    postid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { postid } = await params

  if (!postid) {
    throw new AppError("Missing Post ID", STATUS_CODES.BAD_REQUEST)
  }

  const { caption } = await req.json()

  if (!caption) {
    throw new AppError("Caption is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const post = await Post.findById(postid)

  if (!post) {
    throw new AppError(
      "Post not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.POST.NOT_FOUND
    )
  }

  if (post.postedBy.toString() !== user.id) {
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED)
  }

  post.caption = caption
  await post.save()

  return successResponse("Post updated", post)
})
