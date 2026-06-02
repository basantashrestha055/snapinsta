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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, ImagePlus } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"
import { useCreatePost } from "@/hooks/posts/useCreatePost"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

type UploadResponse = {
  secure_url: string
}

const CreatePostDialog = ({ open, setOpen }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)

  const { addPost } = useCreatePost()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return

    try {
      setLoading(true)

      const uploadForm = new FormData()
      uploadForm.append("file", file)

      const uploadResponse = await axios.post<ApiResponse<UploadResponse>>(
        "/api/upload",
        uploadForm
      )

      if (!uploadResponse.data.success || !uploadResponse.data.data) {
        toast.error("Upload failed")
        return
      }

      const imageUrl = uploadResponse.data.data.secure_url

      addPost({ image: imageUrl, caption })

      // Reset state after success
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
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition hover:bg-muted">
            <ImagePlus className="mb-2 h-10 w-10" />
            <span className="text-sm text-muted-foreground">
              Click to upload image
            </span>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative h-64 w-full">
            <Image
              src={preview}
              alt="preview"
              fill
              className="rounded-lg object-cover"
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
          {loading ? <Loader2 className="animate-spin" /> : "Post"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostDialog
