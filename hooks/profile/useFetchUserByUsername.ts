import { ApiResponse } from "@/types/ApiResponse"
import { User } from "@/types/User"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getProfile = async ({ username }: { username: string }) => {
  const { data } = await axios.get<ApiResponse<User>>(
    `/api/user-by-username/${username}`
  )
  return data.data
}

export const useFetchUserByUsername = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile({ username }),
    retry: false,
  })

  return { fetchProfile: data, isLoading }
}
