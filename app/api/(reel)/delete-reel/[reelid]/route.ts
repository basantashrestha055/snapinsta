import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Comment, { IComment } from "@/models/Comment.model"
import Post, { IPost } from "@/models/Post.model"
import Reel, { IReel } from "@/models/Reel.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    reelid: string
  }>
}

export const DELETE = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { reelid } = await params

  if (!reelid) {
    throw new AppError("Missing Reel ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const reel: IReel = (await Reel.findById(reelid)) as IReel

  if (!reel) {
    throw new AppError(
      "Reel not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.REEL.NOT_FOUND
    )
  }

  if (reel.postedBy.toString() !== user.id) {
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED)
  }

  await reel.deleteOne()

  return successResponse("Reel deleted")
})
