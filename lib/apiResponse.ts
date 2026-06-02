import { NextResponse } from "next/server"
import { ApiResponse } from "@/types/ApiResponse"
import { STATUS_CODES } from "@/lib/statusCodes"

export function apiResponse<T = null>(
  success: boolean,
  message: string,
  status: number,
  data?: T,
  errorCode?: string
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success,
      message,
      ...(data && { data }),
      ...(errorCode && { errorCode }),
    },
    { status }
  )
}

export const successResponse = <T>(message: string, data?: T) =>
  apiResponse(true, message, STATUS_CODES.OK, data)

export const createdResponse = <T>(
  message: string,
  data?: T,
  location?: string
) => {
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data && { data }),
    },
    {
      status: STATUS_CODES.CREATED,
      headers: location ? { Location: location } : undefined,
    }
  )
}

export const errorResponse = (
  message: string,
  status: number = STATUS_CODES.BAD_REQUEST,
  errorCode?: string
) => apiResponse(false, message, status, undefined, errorCode)
