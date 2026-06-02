"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useFetchStory } from "@/hooks/story/useFetchStory"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { StoryViewer } from "./view-story"

const Stories = () => {
  const { groupStories, isPending } = useFetchStory()

  const { data: session } = useSession()
  const user: User = session?.user as User

  const scrollRef = useRef<HTMLDivElement>(null)

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return

    const scrollAmount = 300

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const checkScroll = () => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container

    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  useEffect(() => {
    checkScroll()
  }, [])

  if (isPending) {
    return <div>Loading...</div>
  } else if (groupStories.length === 0) {
    return <div>No stories</div>
  }

  return (
    <div className="relative mb-6">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {groupStories.map((group, i) => {
          const isSeen = group?.stories?.every((story: any) =>
            story.viewers.some((v: any) => v === user?.id)
          )

          return (
            <div
              key={group.user?._id}
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
              className="flex cursor-pointer flex-col items-center"
            >
              <div
                className={`rounded-full p-0.75 ${isSeen ? "bg-gray-300" : "bg-linear-to-tr from-pink-500 to-yellow-500"}`}
              >
                <div className="rounded-full bg-background p-0.75">
                  <Image
                    src={group.user?.profilepic || "/default_avatar.webp"}
                    alt={`${group.user?.username}-story.jpg`}
                    width={72}
                    height={72}
                    className="rounded-full"
                  />
                </div>
              </div>

              <span className="mt-1 max-w-18 truncate text-center text-xs">
                {group.user?.username}
              </span>
            </div>
          )
        })}

        <StoryViewer open={open} setOpen={setOpen} storyGroups={groupStories} />
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  )
}

export default Stories
