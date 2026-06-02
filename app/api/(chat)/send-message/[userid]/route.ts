import { createdResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { getRoomId } from "@/lib/getRoomId"
import { socketServer } from "@/lib/socketServer"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Message from "@/models/Message.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    userid: string
  }>
}

export const POST = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { userid: receiverId } = await params

  if (!receiverId) {
    throw new AppError("User ID is required", STATUS_CODES.BAD_REQUEST)
  }

  if (receiverId === user.id) {
    throw new AppError(
      "You cannot send a message to yourself",
      STATUS_CODES.BAD_REQUEST
    )
  }

  const { message, file } = await req.json()

  if (!message && !file) {
    throw new AppError("Message or file is required", STATUS_CODES.BAD_REQUEST)
  }

  await dbConnect()

  const receiver = await User.findOne({ _id: receiverId }).select("-password")

  if (!receiver) {
    throw new AppError(
      "User not found",
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.USER.NOT_FOUND
    )
  }

  const newMessage = await Message.create({
    senderId: user.id,
    recipientId: receiverId,
    text: message,
    file,
  })

  await socketServer.post(
    "/emit-message",
    {
      receiverId,
      message: newMessage,
    },
    {
      headers: {
        Authorization: process.env.INTERNAL_SECRET,
      },
    }
  )

  return createdResponse("Message sent successfully", newMessage)
})
