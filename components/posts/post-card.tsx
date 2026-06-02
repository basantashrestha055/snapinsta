"use client"

import { CldImage } from "next-cloudinary"
import {
  Bookmark,
  Ellipsis,
  Heart,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
} from "lucide-react"
import { Post } from "@/types/FeedResponse"
import { useState } from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCreateComment } from "@/hooks/posts/comments/useCreateComment"
import { useToggleLike } from "@/hooks/posts/useToggleLike"
import { useToggleSave } from "@/hooks/posts/useToggleSave"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import CommentModal from "./view-comment"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import EditPostDialog from "./edit-post"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { useDeletePost } from "@/hooks/posts/useDeletePost"

const PostCard = ({ post }: { post: Post }) => {
  const [comment, setComment] = useState("")
  const [openComments, setOpenComments] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const { data: session } = useSession()
  const user: User = session?.user as User

  const { resolvedTheme } = useTheme()

  const { addComment } = useCreateComment()
  const { likePost } = useToggleLike()
  const { savePost } = useToggleSave()
  const { deletePost } = useDeletePost()

  return (
    <div className="rounded-xl border bg-background">

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Image
            src={post.postedBy.profilepic || "/default_avatar.webp"}
            alt={`${post.postedBy.username}-profile.png`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <Link href={`/profile/${post.postedBy.username}`}>
            <span className="font-semibold">{post.postedBy.username}</span>
          </Link>
        </div>
        <div
          className={`${post.postedBy._id === user?.id ? "flex" : "hidden"}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className="cursor-pointer"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setOpenEdit(true)
                  }}
                >
                  Edit Post
                  <DropdownMenuShortcut>
                    <Pencil />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <EditPostDialog
                  open={openEdit}
                  setOpen={setOpenEdit}
                  post={post}
                />

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onSelect={(e) => {
                    e.preventDefault()
                    setOpenDelete(true)
                  }}
                >
                  Delete Post
                  <DropdownMenuShortcut>
                    <Trash2 className="text-red-500" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePost({ postid: post?._id })}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative aspect-4/5 w-full">
        <CldImage
          src={post.image}
          alt={`${post.postedBy.username}-post.png`}
          fill
          crop={"fill"}
          gravity="auto"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex gap-4">
          {resolvedTheme === "dark" ? (
            <Heart
              className={`${post.likedBy.includes(user?.id) ? "text-red-500" : ""} cursor-pointer`}
              fill={`${post.likedBy.includes(user?.id) ? "red" : ""}`}
              onClick={() =>
                likePost({ params: { postid: post._id, userid: user?.id } })
              }
            />
          ) : (
            <Heart
              className={`${post.likedBy.includes(user?.id) ? "text-red-500" : "text-black"} cursor-pointer`}
              fill={`${post.likedBy.includes(user?.id) ? "red" : "white"}`}
              onClick={() =>
                likePost({ params: { postid: post._id, userid: user?.id } })
              }
            />
          )}

          <MessageCircle
            onClick={() => setOpenComments(true)}
            className="cursor-pointer"
          />

          <Send />
        </div>
        {resolvedTheme === "dark" ? (
          <Bookmark
            className="cursor-pointer"
            fill={`${post.savedBy.includes(user?.id) ? "white" : ""}`}
            onClick={() =>
              savePost({ params: { postid: post._id, userid: user?.id } })
            }
          />
        ) : (
          <Bookmark
            className="cursor-pointer"
            fill={`${post.savedBy.includes(user?.id) ? "black" : "white"}`}
            onClick={() =>
              savePost({ params: { postid: post._id, userid: user?.id } })
            }
          />
        )}
      </div>

      <div className="px-3 pb-1">
        <span className="font-semibold">{post.likedBy.length} likes</span>
      </div>

      <div className="px-3 text-sm">
        <span className="font-semibold">{post.postedBy.username} </span>
        {post.caption}
      </div>

      <div className="px-3 py-1">
        <Button variant={'link'} onClick={() => setOpenComments(true)} className="text-neutral-600">
          View all {Number(post.commentsCount)} comments
        </Button>
      </div>

      {/* Add comment */}
      <div className="flex justify-between p-3">
        <div className="flex gap-4">
          <Image
            src={post.postedBy.profilepic || "/default_avatar.webp"}
            alt={`${post.postedBy.username}-profile.png`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-b outline-none"
          />
        </div>
        {comment.trim() !== "" && (
          <Button
            variant={"link"}
            onClick={() => {
              addComment({ text: comment, commentedOn: post._id })
              setComment("")
            }}
          >
            Post
          </Button>
        )}
      </div>

      <CommentModal open={openComments} setOpen={setOpenComments} post={post} />
    </div>
  )
}

export default PostCard
