import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { createdResponse, errorResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import { dbConnect } from "@/lib/dbConnect"
import { ERROR_CODES } from "@/lib/errorCodes"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import User from "@/models/User.model"
import { NextRequest } from "next/server"

export const POST = TryCatch(async (req: NextRequest) => {
  const { name, username, email, password } = await req.json()

  if (!name || !username || !email || !password) {
    throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST)
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

  await dbConnect()

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new AppError(
      "User already exists",
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.USER.ALREADY_EXISTS
    )
  }

  const expiryDate = new Date()
  expiryDate.setMinutes(expiryDate.getMinutes() + 15)

  const user = await User.create({
    name,
    username,
    email,
    password,
    verifyCode,
    verifyCodeExpiry: expiryDate,
    signupMethod: "credentials",
  })

  const emailResponse = await sendVerificationEmail(email, username, verifyCode)

  if (!emailResponse.success) {
    return errorResponse(
      "Failed to send verification email",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    )
  }

  return createdResponse(
    "User created successfully. Please verify your email.",
    user
  )
})
