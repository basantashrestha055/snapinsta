import { QueryClient, QueryKey, InfiniteData } from "@tanstack/react-query"

export const deleteInfiniteQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemKey: "posts" | "comments" | "reels" | "stories",
  itemId: string
) => {
  queryClient.setQueryData(
    queryKey,
    (oldData: InfiniteData<any> | undefined) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          [itemKey]: page[itemKey]?.filter(
            (item: T) => String(item._id) !== String(itemId)
          ),
        })),
      }
    }
  )
}
