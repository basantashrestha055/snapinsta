import { ApiResponse } from "@/types/ApiResponse"
import { User } from "@/types/User"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getUsers = async () => {
  const { data } = await axios.get<ApiResponse<User[]>>("/api/suggested-users")
  return data.data
}

export const useFetchSuggestedUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: getUsers,
    retry: false,
  })

  return { suggestedUsers: data, isLoading }
}
