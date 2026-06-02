"use client"

import { Reel } from "@/types/Reel"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchReel = async ({ pageParam }: { pageParam?: string | null }) => {
  const { data } = await axios.get(
    `/api/get-reel/feed-reel?limit=5${pageParam ? `&cursor=${pageParam}` : ""}`
  )

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch feed")
  }

  return data.data
}

export const useFetchReels = () => {
  const { data, error, isError, isPending } = useInfiniteQuery({
    queryKey: ["reel"],
    queryFn: fetchReel,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  const reels = data?.pages.flatMap((page: any) => (page.reels as Reel) || [])

  return { reels, error, isError, isPending }
}
