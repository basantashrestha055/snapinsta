import { successResponse } from "@/lib/apiResponse"
import { dbConnect } from "@/lib/dbConnect"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import Request from "@/models/Request.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const requests = await Request.find({
    receiverId: user.id,
    status: "pending",
  }).populate("senderId", "name username profilepic")

  return successResponse("Requests fetched successfully", requests)
})
