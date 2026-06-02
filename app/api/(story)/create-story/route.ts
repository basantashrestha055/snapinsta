import { createdResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Story from "@/models/Story.model"
import { NextRequest } from "next/server"

export const POST = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { media, mediaType } = await req.json()

  console.log(media, mediaType)

  if (!media || !mediaType) {
    throw new AppError("Missing fields", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const story = await Story.create({
    media,
    mediaType,
    postedBy: user.id,
    expiresAt,
  })

  return createdResponse("Story posted", story)
})
