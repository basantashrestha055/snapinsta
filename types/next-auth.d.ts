declare module "next-auth" {
  interface User {
    id: string
    name?: string
    username?: string
    email?: string
    bio?: string
    profilepic?: string
    accountType?: string
    isVerified?: boolean
  }
}

export {}
