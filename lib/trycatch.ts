import { NextRequest, NextResponse } from "next/server"
import { AppError } from "@/lib/AppError"
import { ApiResponse } from "@/types/ApiResponse"
import { STATUS_CODES } from "@/lib/statusCodes"
import { ZodError } from "zod"

export const TryCatch = (
  handler: (req: NextRequest, context?: any) => Promise<Response>
) => {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context)
    } catch (error: any) {
      if (error instanceof AppError) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: error.message,
            errorCode: error.errorCode,
          },
          { status: error.statusCode }
        )
      }

      if (error instanceof ZodError) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: error.issues[0]?.message || "Validation error",
          },
          { status: STATUS_CODES.BAD_REQUEST }
        )
      }

      console.error("Unhandled Error:", error)

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Internal server error",
        },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
      )
    }
  }
}
