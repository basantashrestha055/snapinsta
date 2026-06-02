import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Reel, { IReel } from "@/models/Reel.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const reels = await Reel.find({ postedBy: user.id })

  if (!reels) {
    throw new AppError(
      "No reels found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.REEL.NOT_FOUND
    )
  }

  return successResponse("Reels fetched successfully", reels)
})
