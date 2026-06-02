import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Comment, { IComment } from "@/models/Comment.model"
import Post, { IPost } from "@/models/Post.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    postid: string
  }>
}

export const DELETE = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { postid } = await params

  if (!postid) {
    throw new AppError("Missing Post ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const post: IPost = (await Post.findById(postid)) as IPost

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

  await Comment.deleteMany({ commentedOn: post._id })

  await post.deleteOne()

  return successResponse("Post deleted")
})
