import { QueryClient, QueryKey } from "@tanstack/react-query"

export const deleteQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string
) => {
  queryClient.setQueryData<T[]>(queryKey, (oldData) => {
    if (!oldData) return oldData

    return oldData.filter((item) => item._id !== itemId)
  })
}
