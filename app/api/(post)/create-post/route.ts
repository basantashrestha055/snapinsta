import { createdResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Post from "@/models/Post.model"
import { NextRequest } from "next/server"

export const POST = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const { image, caption } = await req.json()

  if (!image) {
    throw new AppError("Image is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const post = await Post.create({
    caption,
    image,
    postedBy: user.id,
  })

  return createdResponse("Post created successfully", post)
})
