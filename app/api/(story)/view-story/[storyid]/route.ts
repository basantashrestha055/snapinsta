import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Story from "@/models/Story.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    storyid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { storyid } = await params

  if (!storyid) {
    throw new AppError("Missing Story ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const story = await Story.findByIdAndUpdate(storyid, {
    $addToSet: {
      viewers: user.id,
    },
  })

  if (!story) {
    throw new AppError(
      "Story not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.STORY.NOT_FOUND
    )
  }

  return successResponse("Story viewed")
})
