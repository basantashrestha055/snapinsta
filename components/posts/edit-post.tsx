"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useEditPost } from "@/hooks/posts/useEditPost"
import { Post } from "@/types/FeedResponse"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  post: Post
}

const EditPostDialog = ({ open, setOpen, post }: Props) => {
  const [caption, setCaption] = useState(post?.caption || "")
  const [loading, setLoading] = useState(false)

  const { editPost } = useEditPost()

  const handleSubmit = async () => {
    try {
      setLoading(true)

      editPost({ postId: post._id, caption })
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
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="relative h-64 w-full">
          <Image
            src={post?.image}
            alt={`${post?.caption}-post.png`}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <Textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Update"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog
