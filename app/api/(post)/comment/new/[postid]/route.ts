import { createdResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Comment from "@/models/Comment.model"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    postid: string
  }>
}

export const POST = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { postid } = await params

  if (!postid) {
    throw new AppError("Missing Post ID", STATUS_CODES.BAD_REQUEST)
  }

  const { text } = await req.json()

  if (!text || text.trim() === "") {
    throw new AppError("Comment is required", STATUS_CODES.BAD_REQUEST)
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

  const comment = await Comment.create({
    text,
    commentedBy: user.id,
    commentedOn: post._id,
  })

  post.commentsCount += 1
  await post.save()

  return createdResponse("Comment added", comment)
})
