"use client"

import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Reel } from "@/types/Reel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface Params {
  params: {
    reelid: string
    userid: string
  }
}

const toggleLike = async ({ params }: Params) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/toggle-reel/toggle-like/${params.reelid}`
  )
  return data.data
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: toggleLike,
    onMutate: async ({ params }) => {
      await queryClient.cancelQueries({ queryKey: ["reel"] })
      await queryClient.cancelQueries({ queryKey: ["my-reels"] })

      const previousReel = queryClient.getQueryData<any>(["reel"])
      const previousMyReel = queryClient.getQueryData<any>(["my-reels"])

      updateInfiniteQueryItem<Reel>(
        queryClient,
        ["reel"],
        "reels",
        params.reelid,
        (reel) => {
          const isLiked = reel.likedBy.includes(params.userid)

          return {
            ...reel,
            isLiked: !isLiked,
            likesCount: isLiked
              ? reel.likedBy.length - 1
              : reel.likedBy.length + 1,
          }
        }
      )

      return { previousReel, previousMyReel }
    },

    onError: (_err, _reelid, context) => {
      if (context?.previousReel) {
        queryClient.setQueryData(["reel"], context.previousReel)
      }

      if (context?.previousMyReel) {
        queryClient.setQueryData(["my-reels"], context.previousMyReel)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["reel"],
      })
      queryClient.invalidateQueries({
        queryKey: ["my-reels"],
      })
    },
  })

  return { likeReel: mutate, isLiking: isPending }
}
