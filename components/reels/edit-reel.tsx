"use client"

import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useEditReel } from "@/hooks/reels/useEditReel"
import { Reel } from "@/types/Reel"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  reel: Reel
}

const EditReelDialog = ({ open, setOpen, reel }: Props) => {
  const [caption, setCaption] = useState(reel?.caption || "")
  const [loading, setLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { editReel } = useEditReel()

  const handleSubmit = async () => {
    try {
      setLoading(true)

      editReel({ reelId: reel._id, caption })
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Edit Reel</DialogTitle>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl">
          <video
            ref={videoRef}
            src={reel?.video}
            controls
            className="h-125 w-full rounded-xl object-cover"
          />
        </div>

        <Textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Edit Reel"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default EditReelDialog
