"use client"

import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface Params {
  params: {
    postid: string
    userid: string
  }
}

const toggleSave = async ({ params }: Params) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/toggle/toggle-save/${params.postid}`
  )
  return data.data
}

export const useToggleSave = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: toggleSave,
    onMutate: async ({ params }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })

      const previousData = queryClient.getQueryData<any>(["feed"])

      updateInfiniteQueryItem<Post>(
        queryClient,
        ["feed"],
        "posts",
        params.postid,
        (post) => {
          const isSaved = post.savedBy.includes(params.userid)

          return {
            ...post,
            isSaved: !isSaved,
          }
        }
      )

      return { previousData }
    },

    onError: (_err, _postid, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["feed"], context.previousData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })

  return { savePost: mutate, isSaving: isPending }
}
