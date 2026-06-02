import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Message from "@/models/Message.model"
import { NextRequest } from "next/server"

type Props = {
  params: Promise<{
    userid: string
  }>
}

export const GET = TryCatch(async (req: NextRequest, { params }: Props) => {
  const user = await isAuthenticated()

  const { userid: userToChatId } = await params

  if (!userToChatId) {
    throw new AppError("User ID is required", STATUS_CODES.BAD_REQUEST)
  }

  const messages = await Message.find({
    $or: [
      { senderId: user.id, recipientId: userToChatId },
      { senderId: userToChatId, recipientId: user.id },
    ],
  })

  return successResponse("Messages fetched successfully", messages)
})
