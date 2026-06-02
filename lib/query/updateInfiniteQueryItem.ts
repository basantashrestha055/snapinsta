import { QueryClient, QueryKey, InfiniteData } from "@tanstack/react-query"

export const updateInfiniteQueryItem = <T extends { _id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemKey: "posts" | "comments" | "reels" | "stories",
  itemId: string,
  updateFn: (item: T) => T
) => {
  queryClient.setQueryData(
    queryKey,
    (oldData: InfiniteData<any> | undefined) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          [itemKey]: page[itemKey]?.map((item: T) =>
            item._id === itemId ? updateFn(item) : item
          ),
        })),
      }
    }
  )
}
