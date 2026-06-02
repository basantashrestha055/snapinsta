import { QueryClient, QueryKey } from "@tanstack/react-query"

export const updateQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId:
    | "posts"
    | "comments"
    | "reels"
    | "stories"
    | "suggested-users"
    | "request",
  updateFn: (item: T) => T
) => {
  queryClient.setQueryData<T[]>(queryKey, (oldData) => {
    if (!oldData) return oldData

    return oldData.map((item) => (item._id === itemId ? updateFn(item) : item))
  })
}
