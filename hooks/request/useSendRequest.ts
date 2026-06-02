import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const request = async ({ userid }: { userid: string }) => {
  const { data } = await axios.post<ApiResponse>(`/api/send-request/${userid}`)
  return data.data
}

export const useSendRequest = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
  })

  return { sendRequest: mutate }
}
