import { QueryClient, QueryKey } from "@tanstack/react-query"

export const createQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  newItem: T
) => {
  queryClient.setQueryData<T[]>(queryKey, (oldData) => {
    if (!oldData) return [newItem]

    return [newItem, ...oldData]
  })
}
