import { ApiResponse } from "@/types/ApiResponse"
import { Request } from "@/types/Request"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getRequest = async () => {
  const { data } = await axios.get<ApiResponse<Request[]>>("/api/get-request")
  return data.data
}

export const useFetchRequest = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequest,
    retry: false,
  })

  return { requests: data, isLoading }
}
