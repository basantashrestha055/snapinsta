import { ApiResponse } from "@/types/ApiResponse"
import { Story } from "@/types/Story"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"

const getMyStory = async () => {
  const { data } = await axios.get<ApiResponse>("/api/get-story/my-story")

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch story")
  }

  return data.data
}

export const useFetchMyStory = () => {
  const { data, isPending } = useQuery({
    queryKey: ["my-story"],
    queryFn: getMyStory,
    retry: false,
  })

  return { myStory: data, isPending }
}
