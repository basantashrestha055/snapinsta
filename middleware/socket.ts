import { AppError } from "@/lib/AppError"
import { isAuthenticated } from "./auth"
import { STATUS_CODES } from "@/lib/statusCodes"

export const socketAuth = async (socket: any, next: any) => {
  try {
    const user = await isAuthenticated()

    socket.user = user
    socket.userId = user.id

    next()
  } catch (error: any) {
    console.log("Socket middleware error", error.message)
    return next(
      new AppError(
        "Unauthorized - Socket connection rejected",
        STATUS_CODES.UNAUTHORIZED
      )
    )
  }
}
