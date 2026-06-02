import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchMySavedPosts = async () => {
  const { data } = await axios.get<ApiResponse<Post[]>>(
    "/api/get-post/saved-post"
  )
  return data.data
}

export const useFetchMySavedPosts = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-saved-posts"],
    queryFn: fetchMySavedPosts,
    retry: false,
    enabled,
  })

  return { mySavedPosts: data, savedPostsLoading: isLoading }
}
