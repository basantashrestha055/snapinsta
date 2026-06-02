"use client"

import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface PostParams {
  postId: string
  caption: string
}

const updatePost = async (postData: PostParams) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/edit-post/${postData.postId}`,
    {
      caption: postData.caption,
    }
  )
  return data.data
}

export const useEditPost = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updatePost,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] })

      const previousFeed = queryClient.getQueryData<any>(["feed"])
      const previousMyPosts = queryClient.getQueryData<any>(["profile-posts"])

      updateInfiniteQueryItem<Post>(
        queryClient,
        ["feed"],
        "posts",
        variables.postId,
        (post) => ({
          ...post,
          caption: variables.caption,
        })
      )

      updateQueryItem<Post>(
        queryClient,
        ["profile-posts"],
        "posts",
        (post) => ({
          ...post,
          caption: variables.caption,
        })
      )

      return { previousFeed, previousMyPosts }
    },

    onError: (_err, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed)
      }

      if (context?.previousMyPosts) {
        queryClient.setQueryData(["profile-posts"], context.previousMyPosts)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] })
      toast.success("Post updated")
    },
  })

  return { editPost: mutate }
}
