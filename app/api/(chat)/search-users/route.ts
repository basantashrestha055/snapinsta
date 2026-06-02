import { NextRequest } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import User from "@/models/User.model"
import { isAuthenticated } from "@/middleware/auth"
import { TryCatch } from "@/lib/trycatch"
import { successResponse } from "@/lib/apiResponse"
import Message from "@/models/Message.model"

export const GET = TryCatch(async (req: NextRequest) => {
  const authUser = await isAuthenticated()

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""

  await dbConnect()

  if (!query.trim()) {
    return successResponse("No query provided", [])
  }

  const conversations = await Message.find({
    $or: [{ senderId: authUser.id }, { recipientId: authUser.id }],
  }).select("senderId recipientId")

  const partnerIds = new Set<string>()

  conversations.forEach((conversation) => {
    const senderId = conversation.senderId.toString()
    const recipientId = conversation.recipientId.toString()

    if (senderId !== authUser.id) {
      partnerIds.add(senderId)
    }

    if (recipientId !== authUser.id) {
      partnerIds.add(recipientId)
    }
  })

  const users = await User.find({
    _id: { $in: Array.from(partnerIds) },
    $or: [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ],
  }).select("name username profilepic")

  return successResponse("Users fetched", users)
})
