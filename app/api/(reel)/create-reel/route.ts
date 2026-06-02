import { createdResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Reel from "@/models/Reel.model"
import { NextRequest } from "next/server"

export const POST = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { video, caption } = await req.json()

  if (!video) {
    throw new AppError("Video is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const reel = await Reel.create({
    video,
    caption,
    postedBy: user?.id,
  })

  return createdResponse("Reel created successfully", reel)
})
