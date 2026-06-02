import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Reel from "@/models/Reel.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get("limit") || "10")
  const cursor = searchParams.get("cursor")

  await dbConnect()

  const query: any = {}

  if (cursor) {
    query.createdAt = {
      $lt: new Date(cursor),
    }
  }

  const reels = await Reel.find(query)
    .populate("postedBy", "_id username profilepic")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  const nextCursor = reels.length > 0 ? reels[reels.length - 1].createdAt : null

  return successResponse("Reels fetched successfully", {
    reels,
    nextCursor,
    hasMore: reels.length === limit,
  })
})
