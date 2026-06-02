"use client"

import { useChatStore } from "@/store/useChatStore"
import ChatHeader from "./chat-header"
import MessageInput from "./message-input"
import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { ScrollArea } from "../ui/scroll-area"

export default function MessageList() {
  const {
    messages,
    getMessagesByUserId,
    isMessagesLoading,
    selectedUser,
    subsribeToMessage,
    unSubscribeFromMessage,
    imagePreview,
  } = useChatStore()

  const { data: session } = useSession()

  if (!session || !session?.user) return

  useEffect(() => {
    if (!selectedUser?._id) return

    getMessagesByUserId(selectedUser._id)
    subsribeToMessage()

    return () => unSubscribeFromMessage()
  }, [
    selectedUser?._id,
    getMessagesByUserId,
    subsribeToMessage,
    unSubscribeFromMessage,
  ])

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <ScrollArea
        className={`${imagePreview !== null ? "h-[65vh]" : "h-[77vh] md:h-[87vh] lg:h-[80vh]"}`}
      >
        <div className="flex-1 p-6">
          <div className="space-y-3">
            {messages?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            )}
            {!isMessagesLoading &&
              messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm ${
                      msg.senderId === session?.user?.id
                        ? "bg-blue-500 text-white"
                        : "bg-muted"
                    } `}
                  >
                    {msg.file && (
                      <img
                        src={msg.file}
                        alt="shared"
                        className="h-48 rounded-lg object-cover"
                      />
                    )}

                    {msg.text && <p className="mt-2">{msg.text}</p>}
                    <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>

      <MessageInput />
    </div>
  )
}
