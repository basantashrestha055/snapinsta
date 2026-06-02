"use client"

import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { updateQueryItem } from "@/lib/query/updateQueryItem"
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

const toggleLike = async ({ params }: Params) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/toggle/toggle-like/${params.postid}`
  )
  return data.data
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: toggleLike,
    onMutate: async ({ params }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] })

      const previousFeedData = queryClient.getQueryData<any>(["feed"])
      const previousMyData = queryClient.getQueryData<any>(["profile-posts"])

      updateInfiniteQueryItem<Post>(
        queryClient,
        ["feed"],
        "posts",
        params.postid,
        (post) => {
          const isLiked = post.likedBy.includes(params.userid)

          return {
            ...post,
            isLiked: !isLiked,
            likesCount: isLiked
              ? post.likedBy.length - 1
              : post.likedBy.length + 1,
          }
        }
      )

      updateQueryItem<Post>(queryClient, ["profile-posts"], "posts", (post) => {
        const isLiked = post.likedBy.includes(params.userid)

        return {
          ...post,
          isLiked: !isLiked,
          likesCount: isLiked
            ? post.likedBy.length - 1
            : post.likedBy.length + 1,
        }
      })

      return { previousFeedData, previousMyData }
    },

    onError: (_err, _postid, context) => {
      if (context?.previousFeedData) {
        queryClient.setQueryData(["feed"], context.previousFeedData)
      }

      if (context?.previousMyData) {
        queryClient.setQueryData(["profile-posts"], context.previousMyData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      })
      queryClient.invalidateQueries({
        queryKey: ["profile-posts"],
      })
    },
  })

  return { likePost: mutate, isLiking: isPending }
}
