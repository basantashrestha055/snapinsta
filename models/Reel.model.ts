import mongoose, { Schema, Document } from "mongoose"

export interface IReel extends Document {
  video: string
  caption?: string
  postedBy: Schema.Types.ObjectId
  likedBy: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const ReelSchema = new Schema<IReel>(
  {
    video: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
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
  },
  {
    timestamps: true,
  }
)

ReelSchema.index({ createdAt: -1 })

const Reel = mongoose.models?.Reel || mongoose.model<IReel>("Reel", ReelSchema)

export default Reel
