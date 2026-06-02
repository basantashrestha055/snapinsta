import { auth } from "@/auth"
import { AppError } from "@/lib/AppError"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"

export const isAuthenticated = async () => {
  const session = await auth()

  if (!session || !session?.user) {
    throw new AppError(
      "Unauthorized",
      STATUS_CODES.UNAUTHORIZED,
      ERROR_CODES.AUTH.UNAUTHORIZED
    )
  }

  return session.user
}
