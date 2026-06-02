import { deleteInfiniteQueryItem } from "@/lib/query/deleteInfiniteQueryItem"
import { deleteQueryItem } from "@/lib/query/deleteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const removeStory = async (params: { storyid: string }) => {
  const { data } = await axios.delete<ApiResponse>(
    `/api/delete-story/${params.storyid}`
  )
  return data.data
}

export const useDeleteStory = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: removeStory,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["story"] })
      await queryClient.cancelQueries({ queryKey: ["my-story"] })

      const previousStory = queryClient.getQueryData<any>(["story"])
      const previousMyStory = queryClient.getQueryData<any>(["my-story"])

      deleteInfiniteQueryItem(
        queryClient,
        ["story"],
        "stories",
        variables.storyid
      )
      deleteQueryItem(queryClient, ["my-story"], variables.storyid)

      return { previousStory, previousMyStory }
    },
    onError: (_err, _, context) => {
      if (context?.previousStory) {
        queryClient.setQueryData(["story"], context.previousStory)
      }

      if (context?.previousMyStory) {
        queryClient.setQueryData(["my-story"], context.previousMyStory)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["story"] })
      queryClient.invalidateQueries({ queryKey: ["my-story"] })
    },
  })

  return { deleteStory: mutate }
}
