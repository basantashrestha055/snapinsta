import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Story, { IStory } from "@/models/Story.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    storyid: string
  }>
}

export const DELETE = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { storyid } = await params

  if (!storyid) {
    throw new AppError("Missing Story ID", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const story: IStory = (await Story.findById(storyid)) as IStory

  if (!story) {
    throw new AppError(
      "Story not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.STORY.NOT_FOUND
    )
  }

  if (story.postedBy.toString() !== user.id) {
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED)
  }

  await story.deleteOne()

  return successResponse("Story Deleted")
})
