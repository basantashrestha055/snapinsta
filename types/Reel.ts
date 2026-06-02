export interface Reel {
  _id: string
  video: string
  caption?: string
  postedBy: {
    _id: string
    username: string
    profilepic: string
  }
  likedBy: string[]
  createdAt: Date
  updatedAt: Date
}
