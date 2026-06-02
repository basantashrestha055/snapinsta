"use client"

import { updateInfiniteQueryItem } from "@/lib/query/updateInfiniteQueryItem"
import { updateQueryItem } from "@/lib/query/updateQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { Reel } from "@/types/Reel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface ReelParams {
  reelId: string
  caption: string
}

const updateReel = async (reelData: ReelParams) => {
  const { data } = await axios.put<ApiResponse>(
    `/api/edit-reel/${reelData.reelId}`,
    {
      caption: reelData.caption,
    }
  )
  return data.data
}

export const useEditReel = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateReel,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["reel"] })
      await queryClient.cancelQueries({ queryKey: ["my-reels"] })

      const previousReel = queryClient.getQueryData<any>(["reel"])
      const previousMyReels = queryClient.getQueryData<any>(["my-reels"])

      updateInfiniteQueryItem<Reel>(
        queryClient,
        ["reel"],
        "reels",
        variables.reelId,
        (reel) => ({
          ...reel,
          caption: variables.caption,
        })
      )

      updateQueryItem<Reel>(
        queryClient,
        ["my-reels"],
        'reels',
        (reel) => ({
          ...reel,
          caption: variables.caption,
        })
      )

      return { previousReel, previousMyReels }
    },

    onError: (_err, variables, context) => {
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
      toast.success("Reel updated")
    },
  })

  return { editReel: mutate }
}
