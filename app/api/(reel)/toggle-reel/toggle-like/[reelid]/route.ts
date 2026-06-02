import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import { NextRequest } from "next/server"
import mongoose from "mongoose"
import { successResponse } from "@/lib/apiResponse"
import Reel from "@/models/Reel.model"

type Params = {
  params: Promise<{
    reelid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { reelid } = await params

  if (!reelid) {
    throw new AppError("Missing Reel ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const reel = await Reel.findById(reelid)

  if (!reel) {
    throw new AppError(
      "Reel not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.REEL.NOT_FOUND
    )
  }

  const isAlreadyLiked = reel.likedBy.some(
    (id: mongoose.Types.ObjectId) => id.toString() === user.id.toString()
  )

  if (isAlreadyLiked) {
    const updatedReel = await Reel.findByIdAndUpdate(
      reelid,
      {
        $pull: { likedBy: user.id },
      },
      {
        returnDocument: "after",
        select: "likedBy",
      }
    )

    return successResponse("Reel unliked", {
      likesCount: updatedReel.likedBy.length,
    })
  } else {
    const updatedReel = await Reel.findByIdAndUpdate(
      reelid,
      {
        $addToSet: { likedBy: user.id },
      },
      {
        returnDocument: "after",
        select: "likedBy",
      }
    )

    return successResponse("Reel liked", {
      likesCount: updatedReel.likedBy.length,
    })
  }
})
