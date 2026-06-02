import { createInfiniteQueryItem } from "@/lib/query/createInfiniteQueryItem"
import { createQueryItem } from "@/lib/query/createQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Story } from "@/types/Story"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

type StoryProps = {
  media: string
  mediaType: "image" | "video"
}

const createStory = async (storyData: StoryProps) => {
  const { data } = await axios.post<ApiResponse>("/api/create-story", {
    media: storyData.media,
    mediaType: storyData.mediaType,
  })
  return data.data
}

export const useCreateStory = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createStory,
    onSuccess: (newStory: any) => {
      createInfiniteQueryItem(queryClient, ["story"], "stories", newStory)
      createQueryItem(queryClient, ["my-story"], newStory)
      toast.success("Story created")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["story"] })
      queryClient.invalidateQueries({ queryKey: ["my-story"] })
    },
  })

  return { addStory: mutate }
}
