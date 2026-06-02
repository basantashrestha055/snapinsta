"use client"

import { useChatStore } from "@/store/useChatStore"
import { SessionUser } from "@/types/User"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function ChatProvider() {
  const { data: session } = useSession()

  const { setUser, connectSocket, disconnectSocket } = useChatStore()

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as SessionUser)

      connectSocket(session.user.id)
    }

    return () => disconnectSocket()
  }, [session])

  return null
}
