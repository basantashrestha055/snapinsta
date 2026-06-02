import { deleteInfiniteQueryItem } from "@/lib/query/deleteInfiniteQueryItem"
import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Post } from "@/types/FeedResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface CommentProps {
  params: {
    commentid: string
    postid: string
  }
}

const removeComment = async ({ params }: CommentProps) => {
  console.log("mutation function clicked")

  const { data } = await axios.delete<ApiResponse>(
    `/api/comment/delete/${params.commentid}`
  )
  return data.data
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: removeComment,
    onMutate: async ({ params }) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", params.postid],
      })
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] })

      const previousComments = queryClient.getQueryData<any>([
        "comments",
        params.postid,
      ])
      const previousFeed = queryClient.getQueryData<any>(["feed"])
      const previousMyPosts = queryClient.getQueryData<any>(["profile-posts"])

      deleteInfiniteQueryItem(
        queryClient,
        ["comments", params.postid],
        "comments",
        params.commentid
      )

      updateInfiniteQueryItem<Post>(
        queryClient,
        ["feed"],
        "posts",
        params.postid,
        (post) => {
          console.log(post)

          return {
            ...post,
            commentsCount: post.commentsCount - 1,
          }
        }
      )

      updateQueryItem<Post>(
        queryClient,
        ["profile-posts"],
        "posts",
        (post) => ({
          ...post,
          commentsCount: post.commentsCount - 1,
        })
      )

      return { previousComments, previousFeed, previousMyPosts }
    },

    onError: (_err, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed)
      }

      if (context?.previousMyPosts) {
        queryClient.setQueryData(["profile-posts"], context.previousMyPosts)
      }

      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", variables.params.postid],
          context.previousComments
        )
      }
    },

    onSettled: (_data, _, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.params.postid],
      })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["profile-posts"] })
      toast.success("Comment deleted")
    },
  })

  return { deleteComment: mutate }
}
