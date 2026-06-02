import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const watchStory = async ({ storyid }: { storyid: string }) => {
  const { data } = await axios.put<ApiResponse>(`/api/view-story/${storyid}`)
  return data.data
}

export const useViewStory = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: watchStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story"] })
      queryClient.invalidateQueries({ queryKey: ["my-story"] })
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
  })

  return { viewStory: mutate }
}
