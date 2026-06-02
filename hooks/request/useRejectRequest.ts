import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const reject = async ({ requestid }: { requestid: string }) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/reject-request/${requestid}`
  )
  return data.data
}

export const useRejectRequest = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: reject,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["requests"] })

      const previousRequests = queryClient.getQueryData<any>(["requests"])

      updateQueryItem(queryClient, ["requests"], "request", (request) => ({
        ...request,
        status: "rejected",
      }))

      return { previousRequests }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["requests"], context.previousRequests)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
  })

  return { rejectRequest: mutate }
}
