import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const accept = async ({ requestid }: { requestid: string }) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/accept-request/${requestid}`
  )
  return data.data
}

export const useAcceptRequest = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: accept,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["requests"] })
      await queryClient.cancelQueries({ queryKey: ["profile"] })

      const previousRequests = queryClient.getQueryData<any>(["requests"])
      const previousProfile = queryClient.getQueryData<any>(["profile"])

      updateQueryItem(queryClient, ["requests"], "request", (request) => ({
        ...request,
        status: "accepted",
      }))

      return { previousRequests, previousProfile }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["requests"], context.previousRequests)
      }

      if (context?.previousProfile) {
        queryClient.setQueryData(["profile"], context.previousProfile)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })

  return { acceptRequest: mutate }
}
