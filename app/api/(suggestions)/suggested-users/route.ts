import { successResponse } from "@/lib/apiResponse"
import { dbConnect } from "@/lib/dbConnect"
import { TryCatch } from "@/lib/trycatch"
import { isAuthenticated } from "@/middleware/auth"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const GET = TryCatch(async (req: NextRequest) => {
  const user = await isAuthenticated()

  await dbConnect()

  const usersIFollow = await User.find({ followers: user.id })

  let suggestedUsers

  if (usersIFollow.length === 0) {
    suggestedUsers = await User.find({
      _id: { $ne: user.id },
    }).limit(20)
  } else {
    const usersIFollowIds = usersIFollow.map((u) => u._id)
    suggestedUsers = await User.find({
      _id: { $ne: user.id, $nin: usersIFollowIds },
      followers: { $in: usersIFollowIds },
    }).limit(20)
  }

  return successResponse("Suggested users fetched", suggestedUsers)
})
