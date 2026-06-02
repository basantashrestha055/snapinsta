"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Video } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"
import { useCreateReel } from "@/hooks/reels/useCreateReel"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

type UploadResponse = {
  secure_url: string
}

const CreateReelDialog = ({ open, setOpen }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)

  const { addReel } = useCreateReel()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]

    if (!selected) return

    setFile(selected)

    const previewUrl = URL.createObjectURL(selected)

    setPreview(previewUrl)
  }

  const handleSubmit = async () => {
    if (!file) return

    try {
      setLoading(true)

      const uploadForm = new FormData()

      uploadForm.append("file", file)

      const uploadResponse = await axios.post<ApiResponse<UploadResponse>>(
        "/api/upload/video",
        uploadForm
      )

      if (!uploadResponse.data.success || !uploadResponse.data.data) {
        toast.error("Upload failed")
        return
      }

      const videoUrl = uploadResponse.data.data.secure_url

      addReel({ video: videoUrl, caption })

      setFile(null)
      setPreview(null)
      setCaption("")
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
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Create New Reel</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition hover:bg-muted">
            <Video className="mb-2 h-10 w-10" />

            <span className="text-sm text-muted-foreground">
              Click to upload reel
            </span>

            <Input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative overflow-hidden rounded-xl">
            <video
              ref={videoRef}
              src={preview}
              controls
              className="h-125 w-full rounded-xl object-cover"
            />
          </div>
        )}

        <Textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Upload Reel"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReelDialog
