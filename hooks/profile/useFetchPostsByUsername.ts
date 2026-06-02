import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getPosts = async ({ username }: { username: string }) => {
  const { data } = await axios.get<ApiResponse<Post[]>>(
    `/api/posts-by-username/${username}`
  )
  return data.data
}

export const useFetchPostsByUsername = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile-posts"],
    queryFn: () => getPosts({ username }),
    retry: false,
  })

  return { fetchProfilePosts: data, isPostsLoading: isLoading }
}
