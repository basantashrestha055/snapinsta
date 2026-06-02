"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ImagePlus, Video } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { useCreateStory } from "@/hooks/story/useCreateStory"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

type UploadResponse = {
  secure_url: string
}

const CreateStoryDialog = ({ open, setOpen }: Props) => {
  const [file, setFile] = useState<File | null>(null)

  const [preview, setPreview] = useState<string | null>(null)

  const [fileType, setFileType] = useState<"image" | "video" | null>(null)

  const [loading, setLoading] = useState(false)

  const { addStory } = useCreateStory()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]

    if (!selected) return

    setFile(selected)

    const type = selected.type.startsWith("video") ? "video" : "image"

    setFileType(type)

    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file || !fileType) return

    try {
      setLoading(true)

      const uploadForm = new FormData()

      uploadForm.append("file", file)

      const uploadEndpoint =
        fileType === "image" ? "/api/upload" : "/api/upload/video"

      const uploadResponse = await axios.post<ApiResponse<UploadResponse>>(
        uploadEndpoint,
        uploadForm
      )

      if (!uploadResponse.data.success || !uploadResponse.data.data) {
        toast.error("Upload failed")
        return
      }

      const mediaUrl = uploadResponse.data.data.secure_url

      addStory({ media: mediaUrl, mediaType: fileType })

      toast.success("Story created")

      // reset
      setFile(null)
      setPreview(null)
      setFileType(null)

      setOpen(false)
    } catch (err: any) {
      console.error(err)

      toast.error(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition hover:bg-muted">
            <div className="mb-3 flex gap-2">
              <ImagePlus className="h-8 w-8" />
              <Video className="h-8 w-8" />
            </div>

            <span className="text-sm text-muted-foreground">
              Upload image or video
            </span>

            <Input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative overflow-hidden rounded-xl">
            {fileType === "image" ? (
              <div className="relative aspect-9/16 w-full">
                <Image
                  src={preview}
                  alt="story-preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <video
                src={preview}
                controls
                className="aspect-9/16 w-full object-cover"
              />
            )}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Share Story"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreateStoryDialog
