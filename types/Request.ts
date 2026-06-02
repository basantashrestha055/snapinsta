export interface Request {
  _id: string
  senderId: {
    name: string
    username: string
    profilepic: string
  }
  receiverId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}
