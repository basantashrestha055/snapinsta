import { ApiResponse } from "@/types/ApiResponse"
import { Story } from "@/types/Story"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

const getStory = async ({ pageParam }: { pageParam?: string | null }) => {
  const { data } = await axios.get<ApiResponse>(
    `/api/get-story?limit=6${pageParam ? `&cursor=${pageParam}` : ""}`
  )

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch story")
  }

  return data.data
}

export const useFetchStory = () => {
  const { data, isPending } = useInfiniteQuery({
    queryKey: ["story"],
    queryFn: getStory,
    initialPageParam: null,
    getNextPageParam: (lastPage: any) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  const groupStories = data?.pages.flatMap((page: any) => page.stories) || []

  return { groupStories, isPending }
}
