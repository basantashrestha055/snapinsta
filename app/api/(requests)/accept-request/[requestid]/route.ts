import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Request from "@/models/Request.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    requestid: string
  }>
}

export const PUT = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { requestid } = await params

  if (!requestid) {
    throw new AppError("Bad parameters", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const request = await Request.findOneAndUpdate(
    {
      _id: requestid,
      receiverId: user.id,
    },
    {
      status: "accepted",
    },
    {
      returnDocument: "after",
    }
  )

  if (!request) {
    throw new AppError(
      "Request not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.REQUEST.NOT_FOUND
    )
  }

  await User.findOneAndUpdate(
    {
      _id: request.senderId,
    },
    {
      $addToSet: {
        following: user.id,
      },
    },
    {
      returnDocument: "after",
    }
  )

  await User.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      $addToSet: {
        followers: request.senderId,
      },
    },
    {
      returnDocument: "after",
    }
  )

  return successResponse("Request accepted", request)
})
