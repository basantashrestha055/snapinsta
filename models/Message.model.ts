import mongoose, { Schema, Document } from "mongoose"

export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId
  recipientId: Schema.Types.ObjectId
  text?: string
  file?: string
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Message =
  mongoose.models?.Message || mongoose.model<IMessage>("Message", MessageSchema)

export default Message
