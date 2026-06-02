"use client"

import { ImageIcon, Send, X } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group"
import { useChatStore } from "@/store/useChatStore"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"

type UploadResponse = {
  secure_url: string
}

export default function MessageInput() {
  const { sendMessage, imagePreview, setImagePreview } = useChatStore()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setImagePreview(URL.createObjectURL(selected))
  }

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!text.trim() && !file) return

    let imageUrl

    if (file) {
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

      imageUrl = uploadResponse.data.data.secure_url
    }

    sendMessage({
      text: text.trim(),
      file: imageUrl,
    })

    setText("")
    setFile(null)
    setImagePreview(null)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <div className="border-t p-4">
      {imagePreview && (
        <div className="relative my-3 w-fit">
          <img
            src={imagePreview}
            alt="preview"
            className="h-24 w-24 rounded-lg border object-cover"
          />

          <Button
            type="button"
            size={"icon-xs"}
            onClick={() => {
              setFile(null)
              setImagePreview(null)

              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }}
            className="absolute -top-2 -right-2 rounded-full"
          >
            <X />
          </Button>
        </div>
      )}
      <InputGroup className="py-4">
        <InputGroupAddon align={"inline-start"} className="border-r">
          <input
            ref={fileInputRef}
            type="file"
            name="send-image"
            id="send-image"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <InputGroupButton
            aria-label="Send Image"
            title="Upload image"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton
            aria-label="Send Message"
            title="Send"
            onClick={handleSendMessage}
          >
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
