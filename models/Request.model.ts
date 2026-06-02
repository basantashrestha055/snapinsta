import mongoose, { Schema, Document } from "mongoose"

export interface IRequest extends Document {
  senderId: Schema.Types.ObjectId
  receiverId: Schema.Types.ObjectId
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const RequestSchema = new Schema<IRequest>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

RequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true })

const Request =
  mongoose.models?.Request || mongoose.model<IRequest>("Request", RequestSchema)

export default Request
