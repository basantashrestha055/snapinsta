import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface CommentData {
  text: string
  commentid: string
  postid: string
}

const updateComment = async (commentData: CommentData) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/comment/edit/${commentData.commentid}`,
    {
      text: commentData.text,
    }
  )
  return data.data
}

export const useEditComment = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateComment,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", variables.postid],
      })

      const previousComments = queryClient.getQueryData<any>([
        "comments",
        variables.postid,
      ])

      updateInfiniteQueryItem(
        queryClient,
        ["comments", variables.postid],
        "comments",
        variables.commentid,
        (comment) => ({
          ...comment,
          text: variables.text,
        })
      )

      return { previousComments }
    },

    onError: (_err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", variables.postid],
          context.previousComments
        )
      }
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postid],
      })
    },
  })

  return { editComment: mutate }
}
