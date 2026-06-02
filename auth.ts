import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { dbConnect } from "./lib/dbConnect"
import User from "./models/User.model"
import { AppError } from "./lib/AppError"
import { STATUS_CODES } from "./lib/statusCodes"
import { ERROR_CODES } from "./lib/errorCodes"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          })

          if (!user) {
            throw new AppError(
              "Invalid credentials",
              STATUS_CODES.BAD_REQUEST,
              ERROR_CODES.AUTH.INVALID_CREDENTIALS
            )
          }

          if (!user.isVerified) {
            throw new AppError(
              "Please verify your email before logging in",
              STATUS_CODES.FORBIDDEN,
              ERROR_CODES.AUTH.EMAIL_NOT_VERIFIED
            )
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password
          )

          if (!isPasswordValid) {
            throw new AppError(
              "Invalid credentials",
              STATUS_CODES.BAD_REQUEST,
              ERROR_CODES.AUTH.INVALID_CREDENTIALS
            )
          }

          return user
        } catch (error: any) {
          throw new AppError(
            "Internal Server Error",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          )
        }
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect()

        let dbUser = await User.findOne({ email: user.email })

        if (dbUser && dbUser.signupMethod === "credentials") {
          return `/sign-in?error=ACCOUNT_EXISTS_CREDENTIALS`
        }

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            username: user.name?.toLowerCase(),
            email: user.email,
            profilepic: user.image ?? "",
            isVerified: true,
            signupMethod: "google",
          })
        }

        user.id = dbUser._id.toString()
        user.accountType = dbUser.accountType
        user.isVerified = dbUser.isVerified
        user.bio = dbUser.bio
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        ;((token.id = user.id),
          (token.name = user.name),
          (token.username = user.username),
          (token.email = user.email),
          (token.profilepic = user.profilepic),
          (token.accountType = user.accountType),
          (token.isVerified = user.isVerified),
          (token.bio = user.bio))
      }

      if (trigger === "update") {
        token.name = session.user.name
        token.username = session.user.username
        token.bio = session.user.bio
        token.profilpic = session.user.profilepic
        token.accountType = session.user.accountType
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;((session.user.id = token.id as string),
          (session.user.name = token.name as string),
          (session.user.username = token.username as string),
          (session.user.email = token.email as string),
          (session.user.profilepic = token.profilepic as string),
          (session.user.accountType = token.accountType as string),
          (session.user.isVerified = token.isVerified as boolean),
          (session.user.bio = token.bio as string))
      }

      return session
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.BETTER_AUTH_SECRET,
})
