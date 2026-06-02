"use client"

import { ApiResponse } from "@/types/ApiResponse"
import { Comment } from "@/types/Comment"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchComments = async ({
  pageParam = null,
  postid,
}: {
  pageParam?: string | null
  postid: string
}) => {
  const { data } = await axios.get<ApiResponse>(
    `/api/comment/get/${postid}?limit=5${pageParam ? `&cursor=${pageParam}` : ""}`
  )

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch feed")
  }

  return data.data
}

export const useFetchComments = (postid: string) => {
  const {
    data,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", postid],
    queryFn: ({ pageParam }) => fetchComments({ pageParam, postid }),
    initialPageParam: null,
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  const comments =
    data?.pages.flatMap((page: any) => (page.comments as Comment) || []) || []

  return { comments, isError, error }
}
