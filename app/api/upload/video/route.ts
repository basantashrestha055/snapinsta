import { successResponse } from "@/lib/apiResponse"
import { AppError } from "@/lib/AppError"
import cloudinary from "@/lib/cloudinary"
import { STATUS_CODES } from "@/lib/statusCodes"
import { TryCatch } from "@/lib/trycatch"
import { NextRequest } from "next/server"

export const POST = TryCatch(async (req: NextRequest) => {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    throw new AppError("No file uploaded", STATUS_CODES.BAD_REQUEST)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          folder: "snapinsta/reels",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      .end(buffer)
  })

  return successResponse("File uploaded successfully", uploadResult)
})
