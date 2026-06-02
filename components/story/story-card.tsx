"use client"

import Image from "next/image"

interface Props {
  story: any
  isSeen: boolean
}

const StoryCard = ({ story, isSeen }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full p-0.75 ${isSeen ? "bg-gray-300" : "bg-linear-to-tr from-pink-500 to-yellow-500"}`}
      >
        <div className="rounded-full bg-background p-0.75">
          <Image
            src={story.postedBy.profilepic}
            alt={`${story.postedBy.username}-story.jpg`}
            width={72}
            height={72}
            className="rounded-full"
          />
        </div>
      </div>

      <span className="mt-1 max-w-18 truncate text-center text-xs">
        {story.postedBy.username}
      </span>
    </div>
  )
}

export default StoryCard
