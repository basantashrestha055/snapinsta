import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get("limit") || "10")
  const cursor = searchParams.get("cursor")

  await dbConnect()

  const usersIFollow = await User.find({ followers: user.id })

  if (!usersIFollow) {
    throw new AppError("You are not following anyone", STATUS_CODES.BAD_REQUEST)
  }

  const usersIFollowIds = usersIFollow.map((user) => user._id)

  usersIFollowIds.push(user.id)

  const query: any = {
    postedBy: { $in: usersIFollowIds },
  }

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) }
  }

  const posts = await Post.find(query)
    .populate("postedBy", "_id username profilepic")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : null

  return successResponse("Posts fetched", {
    posts,
    nextCursor,
    hasMore: posts.length === limit,
  })
})
