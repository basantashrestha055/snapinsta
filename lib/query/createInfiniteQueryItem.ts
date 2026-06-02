import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query"

export const createInfiniteQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemKey: "posts" | "comments" | "reels" | "stories",
  newItem: T
) => {
  queryClient.setQueryData(
    queryKey,
    (oldData: InfiniteData<any> | undefined) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          if (index !== 0) return page

          return {
            ...page,
            [itemKey]: [newItem, ...(page[itemKey] || [])],
          }
        }),
      }
    }
  )
}
