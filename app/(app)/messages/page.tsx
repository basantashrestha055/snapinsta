"use client"

import ChatList from "@/components/chat/chat-list"
import EmptyChat from "@/components/chat/empty-chat"
import MessageList from "@/components/chat/message-list"
import { useChatStore } from "@/store/useChatStore"

export default function MessagesPage() {
  const { selectedUser } = useChatStore()

  return (
    <div className="h-full w-screen overflow-hidden p-3 md:w-[calc(100vw-270px)] lg:ml-3">
      <div className="h-full">
        <div className="hidden h-full lg:grid lg:grid-cols-[380px_1fr]">
          <ChatList />

          <div className="border-l">
            {!selectedUser ? <EmptyChat /> : <MessageList />}
          </div>
        </div>

        <div className="h-full lg:hidden">
          {!selectedUser ? <ChatList /> : <MessageList />}
        </div>
      </div>
    </div>
  )
}
