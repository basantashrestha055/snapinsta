import { deleteInfiniteQueryItem } from "@/lib/query/deleteInfiniteQueryItem"
import { deleteQueryItem } from "@/lib/query/deleteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const removePost = async (params: { postid: string }) => {
  const { data } = await axios.delete<ApiResponse>(
    `/api/delete-post/${params.postid}`
  )
  return data.data
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: removePost,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["profile-posts"] })

      const previousFeed = queryClient.getQueryData<any>(["feed"])
      const previousMyPosts = queryClient.getQueryData<any>(["profile-posts"])

      deleteInfiniteQueryItem(queryClient, ["feed"], "posts", variables.postid)
      deleteQueryItem(queryClient, ["profile-posts"], variables.postid)

      return { previousFeed, previousMyPosts }
    },

    onError: (_err, _, context) => {
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
      toast.success("Post deleted")
    },
  })

  return { deletePost: mutate }
}
