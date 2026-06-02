export interface Post {
  _id: string
  caption: string
  image: string
  likedBy: string[]
  commentsCount: number
  savedBy: string
  createdAt: Date
  updatedAt: Date
  postedBy: {
    _id: string
    username: string
    profilepic: string
  }
}

export interface FeedResponse {
  posts: Post[]
  nextCursor: string | null
  hasMore: boolean
}
