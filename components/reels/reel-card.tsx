"use client"

import { Reel } from "@/types/Reel"
import EditReelDialog from "@/components/reels/edit-reel"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, Heart, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useToggleLike } from "@/hooks/reels/useToggleLike"
import { useDeleteReel } from "@/hooks/reels/useDeleteReel"
import Link from "next/link"

const ReelCard = ({ reel }: { reel: Reel }) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const { data: session } = useSession()
  const user: User = session?.user as User

  const { likeReel } = useToggleLike()
  const { deleteReel } = useDeleteReel()

  return (
    <div
      key={reel._id}
      className="relative my-4 h-[90vh] w-full max-w-105 snap-start overflow-hidden rounded-3xl bg-black"
    >
      <video
        src={reel.video}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      <div
        className={`absolute top-5 right-4 z-10 items-center gap-3 ${reel.postedBy._id === user.id ? "flex" : "hidden"}`}
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
                Edit Reel
                <DropdownMenuShortcut>
                  <Pencil />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <EditReelDialog
                open={openEdit}
                setOpen={setOpenEdit}
                reel={reel}
              />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenDelete(true)
                }}
              >
                Delete Reel
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
                      This action cannot be undone. This will permanently delete
                      your reel.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteReel({ reelid: reel?._id })}
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

      <div className="absolute bottom-5 left-4 z-10 flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white">
          <Image
            src={reel.postedBy?.profilepic || "/default_avatar.webp"}
            alt={reel.postedBy?.username}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <Link href={`/profile/${user.username}`}>
            <p className="text-sm font-semibold text-white">
              @{reel.postedBy?.username}
            </p>
          </Link>

          {reel.caption && (
            <p className="max-w-55 truncate text-sm text-white/90">
              {reel.caption}
            </p>
          )}
        </div>
      </div>

      <div className="absolute right-3 bottom-8 z-10 flex flex-col items-center gap-6">
        <button className="flex flex-col items-center">
          <Heart
            className={`h-8 w-8 ${reel.likedBy?.includes(user?.id) ? "fill-red-500 text-red-500" : "fill-white text-white"}`}
            onClick={() =>
              likeReel({ params: { reelid: reel._id, userid: user?.id } })
            }
          />
          <span className="mt-1 text-xs font-medium text-white">
            {reel.likedBy?.length}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ReelCard
