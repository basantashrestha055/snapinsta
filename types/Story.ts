export interface Story {
  _id: string
  media: string
  mediaType: "image" | "video"
  postedBy?: {
    username: string
    profilepic: string
  }
  viewers: string[]
  expiresAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface StoryGroup {
  user: {
    _id: string
    username: string
    profilepic: string
  }
  stories: {
    _id: string
    media: string
    mediaType: "image" | "video"
    viewers: string[]
  }[]
}
