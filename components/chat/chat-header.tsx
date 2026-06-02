"use client"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useChatStore } from "@/store/useChatStore"
import { X } from "lucide-react"
import { Button } from "../ui/button"

export default function ChatHeader() {
  const { selectedUser, onlineUsers, setSelectedUser } = useChatStore()

  if (!selectedUser) return

  const isOnline = onlineUsers?.includes(selectedUser._id)

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.profilepic} />
          <AvatarFallback>
            {selectedUser?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
          <AvatarBadge
            className={`${isOnline ? "bg-green-600" : "bg-gray-600"}`}
          />
        </Avatar>

        <div>
          <h3 className="font-semibold">{selectedUser?.name}</h3>

          <p className="text-xs text-muted-foreground">
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      <Button
        variant={"ghost"}
        size={"icon-sm"}
        onClick={() => setSelectedUser(null)}
      >
        <X className="cursor-pointer" />
      </Button>
    </div>
  )
}
