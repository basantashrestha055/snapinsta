import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ImageIcon } from "lucide-react"

const NoFeedPosts = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>No Posts</EmptyTitle>
        <EmptyDescription>
          No posts to display. Follow more users to get more posts on your feed.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default NoFeedPosts
