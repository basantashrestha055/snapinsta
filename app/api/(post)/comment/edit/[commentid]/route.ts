import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Comment from "@/models/Comment.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    commentid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { commentid } = await params

  if (!commentid) {
    throw new AppError("Missing Comment ID", STATUS_CODES.BAD_REQUEST)
  }

  const { text } = await req.json()

  if (!text || text.trim() === "") {
    throw new AppError("Comment is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const comment = await Comment.findById(commentid)

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

  comment.text = text
  await comment.save()

  return successResponse("Comment updated", comment)
})
