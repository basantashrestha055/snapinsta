import { createdResponse, successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Request, { IRequest } from "@/models/Request.model"
import User, { IUser } from "@/models/User.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    userid: string
  }>
}

export const POST = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { userid } = await params

  if (!userid) {
    throw new AppError("Bad parameters", STATUS_CODES.BAD_REQUEST)
  }

  if (user.id.toString() === userid) {
    throw new AppError(
      "Cannot send request to yourself",
      STATUS_CODES.BAD_REQUEST
    )
  }

  await dbConnect()

  const receiver = await User.findById<IUser>(userid)

  if (!receiver) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  if (receiver.accountType === "private") {
    const existingRequest = await Request.findOne({
      $or: [
        { senderId: user.id, receiverId: receiver._id },
        { senderId: receiver._id, receiverId: user.id },
      ],
      status: "pending",
    })

    if (existingRequest) {
      throw new AppError("Request already sent", STATUS_CODES.BAD_REQUEST)
    }

    const request = await Request.create({
      senderId: user.id,
      receiverId: receiver._id,
    })

    return createdResponse("Request sent successfully", request)
  }

  const updateReceiver = await User.findOneAndUpdate(
    {
      _id: userid,
      accountType: "public",
    },
    {
      $addToSet: {
        followers: user.id,
      },
    },
    {
      returnDocument: "after",
    }
  )

  const updateSender = await User.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      $addToSet: {
        following: userid,
      },
    },
    {
      returnDocument: "after",
    }
  )

  return successResponse("Followed", {
    receiver: updateReceiver,
    sender: updateSender,
  })
})
