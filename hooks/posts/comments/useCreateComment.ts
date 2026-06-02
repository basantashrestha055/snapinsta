import { createInfiniteQueryItem } from "@/lib/query/createInfiniteQueryItem"
import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface CommentParams {
  text: string
  commentedOn: string
}

const createComment = async (commentData: CommentParams) => {
  const { data } = await axios.post<ApiResponse>(
    `/api/comment/new/${commentData.commentedOn}`,
    {
      text: commentData.text,
    }
  )
  return data.data
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (newComment: any) => {
      createInfiniteQueryItem(
        queryClient,
        ["comments", newComment.commentedOn],
        "comments",
        newComment
      )

      updateInfiniteQueryItem<Post>(
        queryClient,
        ["feed"],
        "posts",
        newComment.commentedOn,
        (post) => ({
          ...post,
          commentsCount: post.commentsCount + 1,
        })
      )

      updateQueryItem<Post>(
        queryClient,
        ["profile-posts"],
        newComment.commentedOn,
        (post) => ({
          ...post,
          commentsCount: post.commentsCount + 1,
        })
      )

      toast.success("Comment created")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentedOn],
      })
    },
  })

  return { addComment: mutate }
}
