"use client"

import { Post } from "@/types/FeedResponse"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchFeed = async ({ pageParam }: { pageParam?: string | null }) => {
  const { data } = await axios.get(
    `/api/get-post/feed-post?limit=5${pageParam ? `&cursor=${pageParam}` : ""}`
  )

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch feed")
  }

  return data.data
}

export const useFetchFeed = () => {
  const { data, isPending } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  const posts = data?.pages.flatMap((page: any) => (page.posts as Post) || [])

  return { posts, isPending }
}
