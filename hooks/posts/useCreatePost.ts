"use client"

import { createInfiniteQueryItem } from "@/lib/query/createInfiniteQueryItem"
import { createQueryItem } from "@/lib/query/createQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface PostParams {
  image: string
  caption: string
}

const createPost = async (postData: PostParams) => {
  const { data } = await axios.post<ApiResponse>("/api/create-post", postData)
  return data.data
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost: any) => {
      createInfiniteQueryItem(queryClient, ["feed"], "posts", newPost)
      createQueryItem(queryClient, ["profile-posts"], newPost)
      toast.success("Post created")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] })
    },
  })

  return { addPost: mutate }
}
