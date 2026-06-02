import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"
import mongoose from "mongoose"
import { successResponse } from "@/lib/apiResponse"

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

  await dbConnect()

  const post = await Post.findById(postid)

  if (!post) {
    throw new AppError(
      "Post not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.POST.NOT_FOUND
    )
  }

  const isAlreadySaved = post.savedBy.some(
    (id: mongoose.Types.ObjectId) => id.toString() === user.id.toString()
  )

  if (isAlreadySaved) {
    await Post.findByIdAndUpdate(
      postid,
      {
        $pull: { savedBy: user.id },
      },
      {
        returnDocument: "after",
        select: "savedBy",
      }
    )

    return successResponse("Post unsaved")
  } else {
    await Post.findByIdAndUpdate(
      postid,
      {
        $addToSet: { savedBy: user.id },
      },
      {
        returnDocument: "after",
        select: "savedBy",
      }
    )

    return successResponse("Post saved")
  }
})
