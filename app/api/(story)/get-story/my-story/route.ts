import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Story from "@/models/Story.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const story = await Story.find({
    postedBy: user.id,
    expiresAt: { $gt: new Date() },
  }).populate("postedBy", "username profilepic")

  if (!story) {
    return successResponse("No stories found", STATUS_CODES.OK)
  }

  return successResponse("Stories fetched", story)
})
