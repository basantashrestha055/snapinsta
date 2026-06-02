"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { StoryGroup } from "@/types/Story"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { useDeleteStory } from "@/hooks/story/useDeleteStory"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis, Eye, Trash2 } from "lucide-react"
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
import { useViewStory } from "@/hooks/story/useViewStory"
import StoryViewersModal from "./story-viewers"

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  storyGroups: StoryGroup[]
}

export const StoryViewer = ({ open, setOpen, storyGroups }: Props) => {
  const { deleteStory } = useDeleteStory()
  const { viewStory } = useViewStory()

  const [groupIndex, setGroupIndex] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  const [openDelete, setOpenDelete] = useState(false)
  const [viewedStories, setViewedStories] = useState<string[]>([])
  const [paused, setPaused] = useState(false)
  const [openViewers, setOpenViewers] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const group = storyGroups?.[groupIndex]
  const story = group?.stories?.[storyIndex]

  const { data: session } = useSession()
  const user: User = session?.user as User

  const isMyStory = group?.user?._id === user?.id

  useEffect(() => {
    setProgress(0)
  }, [storyIndex, groupIndex])

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (open && (!group || !story)) {
      setOpen(false)
    }
  }, [group, story, open, setOpen])

  useEffect(() => {
    if (!open || paused) return

    const interval = setInterval(() => {
      setProgress((prev) => prev + 1)
    }, 50)

    return () => clearInterval(interval)
  }, [open, paused, storyIndex, groupIndex])

  useEffect(() => {
    if (progress >= 100) {
      nextStory()
      setProgress(0)
    }
  }, [progress])

  useEffect(() => {
    if (!story?._id) return

    if (viewedStories.includes(story?._id)) return

    viewStory({ storyid: story?._id })

    setViewedStories((prev) => [...prev, story?._id])
  }, [story?._id])

  useEffect(() => {
    setPaused(menuOpen || openDelete)
  }, [menuOpen, openDelete])

  const nextStory = () => {
    const group = storyGroups[groupIndex]

    if (storyIndex < group?.stories?.length - 1) {
      setStoryIndex((s) => s + 1)
    } else if (groupIndex < storyGroups?.length - 1) {
      setGroupIndex((g) => g + 1)
      setStoryIndex(0)
    } else {
      setOpen(false)
    }
  }

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((s) => s - 1)
    } else if (groupIndex > 0) {
      const prevGroup = storyGroups[groupIndex - 1]
      setGroupIndex((g) => g - 1)
      setStoryIndex(prevGroup?.stories.length - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="h-screen max-w-full bg-black p-0">
        <div className="absolute inset-0 flex">
          <div className="w-1/2" onClick={prevStory} />
          <div className="w-1/2" onClick={nextStory} />
        </div>

        <div className="absolute top-0 z-20 flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={group?.user?.profilepic || "/default_avatar.webp"}
              />
            </Avatar>

            <span className="font-medium text-white">
              {group?.user?.username}
            </span>
          </div>
          {isMyStory && (
            <div>
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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
                      className="text-red-500"
                      onSelect={(e) => {
                        e.preventDefault()
                        setOpenDelete(true)
                      }}
                    >
                      Delete Story
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
                            delete your story.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteStory({ storyid: story?._id })}
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
          )}
        </div>

        <div className="absolute top-2 z-20 flex w-full gap-1 px-2">
          {group?.stories?.map((_, i) => (
            <Progress
              key={i}
              value={i === storyIndex ? progress : i < storyIndex ? 100 : 0}
              className="h-1"
            />
          ))}
        </div>

        <div className="flex h-full items-center justify-center">
          {story?.mediaType === "image" ? (
            <Image
              src={story?.media}
              alt="story"
              fill
              className="object-contain"
            />
          ) : (
            <video src={story?.media} autoPlay className="h-full w-full" />
          )}
        </div>

        {isMyStory && (
          <button
            onClick={() => {
              setPaused(true)
              setOpenViewers(true)
            }}
            className="absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-sm text-white"
          >
            <Eye size={18} />
            {story?.viewers?.length}
          </button>
        )}
        <StoryViewersModal
          openViewers={openViewers}
          setOpenViewers={setOpenViewers}
          setPaused={setPaused}
          story={story}
        />
      </DialogContent>
    </Dialog>
  )
}
