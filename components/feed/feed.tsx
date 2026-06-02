"use client"

import { useFetchFeed } from "@/hooks/posts/useFetchFeed"
import PostCard from "../posts/post-card"
import NoFeedPosts from "./empty-feed"

const Feed = () => {
  const { posts, isPending } = useFetchFeed()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (posts?.length == 0) {
    return <NoFeedPosts />
  }

  return (
    <div className="flex flex-col gap-8">
      {posts?.map((post) => (
        <PostCard key={post?._id} post={post} />
      ))}
    </div>
  )
}

export default Feed
