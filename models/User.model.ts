import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  username: string
  email: string
  password: string
  profilepic?: string
  bio: string
  accountType: "public" | "private"
  isVerified: boolean
  verifyCode: string
  verifyCodeExpiry: Date
  signupMethod: "google" | "credentials"
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    profilepic: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    accountType: {
      type: String,
      default: "public",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      length: 6,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    signupMethod: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
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

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return

  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema)

export default User
