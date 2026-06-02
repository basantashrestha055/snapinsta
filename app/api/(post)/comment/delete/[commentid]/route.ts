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
    commentid: string
  }>
}

export const DELETE = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { commentid } = await params

  if (!commentid) {
    throw new AppError("Missing Comment ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const comment: IComment = (await Comment.findOne({
    _id: commentid,
  })) as IComment

  if (!comment) {
    throw new AppError(
      "Comment not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.COMMENT.NOT_FOUND
    )
  }

  if (comment.commentedBy.toString() !== user.id) {
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED)
  }

  await comment.deleteOne()

  const post: IPost = (await Post.findById(comment.commentedOn)) as IPost

  post.commentsCount = post.commentsCount - 1
  await post.save()

  return successResponse("Comment deleted")
})
