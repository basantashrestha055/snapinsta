"use client"

import { createInfiniteQueryItem } from "@/lib/query/createInfiniteQueryItem"
import { createQueryItem } from "@/lib/query/createQueryItem"
import { ApiResponse } from "@/types/ApiResponse"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

interface ReelParams {
  video: string
  caption?: string
}

const createReel = async (reelData: ReelParams) => {
  const { data } = await axios.post<ApiResponse>("/api/create-reel", reelData)
  return data.data
}

export const useCreateReel = () => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createReel,
    onSuccess: (newReel: any) => {
      createInfiniteQueryItem(queryClient, ["reel"], "reels", newReel)
      createQueryItem(queryClient, ["my-reels"], newReel)
      toast.success("Reel created")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Something went wrong")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reel"] })
      queryClient.invalidateQueries({ queryKey: ["my-reels"] })
    },
  })

  return { addReel: mutate }
}
