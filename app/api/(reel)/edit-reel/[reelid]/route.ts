import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Reel from "@/models/Reel.model"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    reelid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Params) => {
  const user = await isAuthenticated()

  const { reelid } = await params

  if (!reelid) {
    throw new AppError("Missing Reel ID", STATUS_CODES.BAD_REQUEST)
  }

  const { caption } = await req.json()

  if (!caption) {
    throw new AppError("Caption is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const reel = await Reel.findById(reelid)

  if (!reel) {
    throw new AppError(
      "Reel not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.REEL.NOT_FOUND
    )
  }

  if (reel.postedBy.toString() !== user.id) {
    throw new AppError("Unauthorized", STATUS_CODES.UNAUTHORIZED)
  }

  reel.caption = caption
  await reel.save()

  return successResponse("Reel updated", reel)
})
