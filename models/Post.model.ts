import mongoose, { Schema, Document } from "mongoose"

export interface IPost extends Document {
  caption: string
  image: string
  postedBy: Schema.Types.ObjectId
  likedBy: Schema.Types.ObjectId[]
  commentsCount: number
  savedBy: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    caption: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
)

PostSchema.index({ createdAt: -1 })

const Post = mongoose.models?.Post || mongoose.model<IPost>("Post", PostSchema)

export default Post
