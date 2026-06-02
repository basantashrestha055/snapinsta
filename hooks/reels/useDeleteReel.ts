import { deleteInfiniteQueryItem } from "@/lib/query/deleteInfiniteQueryItem"
import { deleteQueryItem } from "@/lib/query/deleteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const removeReel = async (params: { reelid: string }) => {
  const { data } = await axios.delete<ApiResponse>(
    `/api/delete-reel/${params.reelid}`
  )
  return data.data
}

export const useDeleteReel = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: removeReel,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["reel"] })
      await queryClient.cancelQueries({ queryKey: ["my-reels"] })

      const previousReel = queryClient.getQueryData<any>(["reel"])
      const previousMyReels = queryClient.getQueryData<any>(["my-reels"])

      deleteInfiniteQueryItem(queryClient, ["reel"], "reels", variables.reelid)
      deleteQueryItem(queryClient, ["my-reels"], variables.reelid)

      return { previousReel, previousMyReels }
    },

    onError: (_err, _, context) => {
      if (context?.previousReel) {
        queryClient.setQueryData(["reel"], context.previousReel)
      }

      if (context?.previousMyReels) {
        queryClient.setQueryData(["my-reels"], context.previousMyReels)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reel"] })
      queryClient.invalidateQueries({ queryKey: ["my-reels"] })
      toast.success("Reel deleted")
    },
  })

  return { deleteReel: mutate }
}
