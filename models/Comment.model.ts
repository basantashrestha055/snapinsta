import mongoose, { Schema, Document } from "mongoose"

export interface IComment extends Document {
  text: string
  commentedBy: Schema.Types.ObjectId
  commentedOn: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Comment text cannot exceed 1000 characters"],
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentedOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({
  commentedOn: 1,
  createdAt: -1,
})

const Comment =
  mongoose.models?.Comment || mongoose.model<IComment>("Comment", CommentSchema)

export default Comment
