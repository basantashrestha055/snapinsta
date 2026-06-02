import { ApiResponse } from "@/types/ApiResponse"
import { Reel } from "@/types/Reel"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getReels = async ({ username }: { username: string }) => {
  const { data } = await axios.get<ApiResponse<Reel[]>>(
    `/api/reels-by-username/${username}`
  )
  return data.data
}

export const useFetchReelsByUsername = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile-reels"],
    queryFn: () => getReels({ username }),
    retry: false,
  })

  return { fetchProfileReels: data, isReelsLoading: isLoading }
}
