export interface Comment {
  _id: string
  text: string
  commentedBy: {
    _id: string
    username: string
    profilepic: string
  }
  commentedOn: string
  createdAt: Date
  updatedAt: Date
}
