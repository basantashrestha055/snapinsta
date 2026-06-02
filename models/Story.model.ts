import mongoose, { Schema, Document } from "mongoose"

export interface IStory extends Document {
  media: string
  mediaType: "image" | "video"
  postedBy: Schema.Types.ObjectId
  viewers: Schema.Types.ObjectId[]
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const StorySchema = new Schema<IStory>(
  {
    media: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Story =
  mongoose.models?.Story || mongoose.model<IStory>("Story", StorySchema)

export default Story
