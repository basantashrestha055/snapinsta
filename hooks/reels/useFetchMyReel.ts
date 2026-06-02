import { ApiResponse } from "@/types/ApiResponse"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchMyReels = async () => {
  const { data } = await axios.get<ApiResponse>("/api/get-reel/my-reel")
  return data.data
}

export const useFetchMyReels = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-reels"],
    queryFn: fetchMyReels,
    retry: false,
  })

  return { myReels: data, myReelsLoading: isLoading }
}
