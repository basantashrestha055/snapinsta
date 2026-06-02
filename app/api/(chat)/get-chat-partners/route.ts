import { successResponse } from "@/lib/apiResponse"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Message, { IMessage } from "@/models/Message.model"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  const message = await Message.find<IMessage>({
    $or: [{ senderId: user.id }, { recipientId: user.id }],
  })

  const chatPartnerIds = [
    ...new Set(
      message.map((msg) =>
        msg.senderId.toString() === user.id
          ? msg.recipientId.toString()
          : msg.senderId.toString()
      )
    ),
  ]

  const chatPartners = await User.find({
    _id: { $in: chatPartnerIds },
  }).select("-password")

  return successResponse("Chat partners retrieved successfully", chatPartners)
})
