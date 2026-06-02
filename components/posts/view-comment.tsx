"use client"

import Image from "next/image"
import { Send, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Drawer, DrawerContent } from "@/components/ui/drawer"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useFetchComments } from "@/hooks/posts/comments/useFetchComments"
import { Post } from "@/types/FeedResponse"
import { formatDistanceToNow } from "date-fns"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useDeleteComment } from "@/hooks/posts/comments/useDeleteComment"
import { Button } from "../ui/button"
import { useState } from "react"
import { useCreateComment } from "@/hooks/posts/comments/useCreateComment"

type Props = {
  post: Post
  open: boolean
  setOpen: (open: boolean) => void
}

const CommentModal = ({ post, open, setOpen }: Props) => {
  const [comment, setComment] = useState("")

  const { comments } = useFetchComments(post._id)
  const { deleteComment } = useDeleteComment()
  const { addComment } = useCreateComment()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const { data: session } = useSession()

  const user: User = session?.user as User

  const content = (
    <div className="flex h-full w-full flex-col bg-background md:w-105">
      <div className="border-b p-4 font-semibold">Comments</div>

      <div className="w-full flex-1 space-y-6 overflow-y-auto p-4">
        {comments?.map((cmt) => {
          const isMyComment = cmt.commentedBy._id === user.id

          return (
            <div key={cmt?._id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between md:w-85">
                <div className="flex items-center gap-3">
                  <Image
                    src={cmt.commentedBy.profilepic || "/default_avatar.webp"}
                    alt={`${cmt.commentedBy.username}-profile.png`}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />

                  <div className="flex flex-col">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {cmt.commentedBy.username}
                      </span>{" "}
                      {cmt.text}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(cmt.createdAt))}
                    </span>
                  </div>
                </div>

                {isMyComment && (
                  <Trash2
                    size={14}
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                      console.log("clicked")
                      deleteComment({
                        params: { commentid: cmt._id, postid: post._id },
                      })
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-3">
        <div className="flex items-center justify-between gap-3 md:w-90">
          <input
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            variant={"ghost"}
            onClick={() =>
              addComment({ commentedOn: post?._id, text: comment.trim() })
            }
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[90vh]">{content}</DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="h-[90vh] max-w-6xl overflow-hidden p-0">
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default CommentModal
