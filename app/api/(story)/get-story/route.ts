import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Story, { IStory } from "@/models/Story.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get("limit") || "10")
  const cursor = searchParams.get("cursor")

  await dbConnect()

  const userIFollow = await User.find({ followers: user.id }).select("_id")

  if (!userIFollow) {
    throw new AppError("You are not following anyone", STATUS_CODES.BAD_REQUEST)
  }

  const userIFollowIds = userIFollow.map((user) => user._id)

  userIFollowIds.push(user.id)

  const query: any = {
    postedBy: { $in: userIFollowIds },
    expiresAt: { $gt: new Date() },
  }

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) }
  }

  const stories = await Story.find(query)
    .populate("postedBy", "username profilepic")
    .populate("viewers", "name profilepic")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  const groupedStories = stories.reduce((acc, story) => {
    const userid = story.postedBy.toString()

    if (!acc[userid]) {
      acc[userid] = {
        user: story.postedBy,
        stories: [],
      }
    }

    acc[userid].stories.push(story)

    return acc
  }, {})

  const nextCursor =
    stories.length > 0 ? stories[stories.length - 1].createdAt : null

  return successResponse("Stories fetched", {
    stories: Object.values(groupedStories),
    nextCursor,
    hasMore: stories.length === limit,
  })
})
