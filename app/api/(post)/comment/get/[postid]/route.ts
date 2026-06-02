import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"
import mongoose from "mongoose"
import Comment from "@/models/Comment.model"
import { successResponse } from "@/lib/apiResponse"

type Params = {
  params: Promise<{
    postid: string
  }>
}

export const GET = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { postid } = await params

  if (!postid) {
    throw new AppError("Missing Post ID", STATUS_CODES.BAD_REQUEST)
  }

  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get("limit") || "10")
  const cursor = searchParams.get("cursor")

  await dbConnect()

  const post = await Post.findById(postid)

  if (!post) {
    throw new AppError(
      "Post not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.POST.NOT_FOUND
    )
  }

  const query: any = {
    commentedOn: postid,
  }

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) }
  }

  const comments = await Comment.find(query)
    .populate("commentedBy", "_id username profilepic")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].createdAt : null

  return successResponse("Comments fetched", {
    comments,
    nextCursor,
    hasMore: comments.length === limit,
  })
})
