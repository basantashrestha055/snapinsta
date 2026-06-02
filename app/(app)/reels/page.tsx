"use client"

import ReelCard from "@/components/reels/reel-card"
import { useFetchReels } from "@/hooks/reels/useFetchReels"
import { Reel } from "@/types/Reel"

const page = () => {
  const { reels, isPending } = useFetchReels()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (reels?.length === 0 || !reels) {
    return <div>No reels</div>
  }

  return (
    <div className="flex h-full w-screen items-center justify-center p-3 md:ml-3 md:w-[calc(100vw-270px)]">
      <div
      className="flex h-full w-full snap-y snap-mandatory flex-col items-center overflow-y-auto py-4">
        {reels?.map((reel: Reel) => (
          <div
            key={reel._id}
            className="flex items-center justify-center gap-4"
          >
            <ReelCard reel={reel} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
