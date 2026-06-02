"use client"

import { socket } from "@/lib/socket"
import { useEffect } from "react"

export const useSocket = (userId?: string) => {
  useEffect(() => {
    if (!userId) return

    socket.connect()

    socket.emit("join", userId)

    return () => {
      socket.disconnect()
    }
  }, [userId])

  return socket
}
