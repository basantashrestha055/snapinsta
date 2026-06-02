"use client"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "../ui/separator"
import { useChatStore } from "@/store/useChatStore"
import { useEffect, useState } from "react"
import { User } from "@/types/User"
import { formatLastSeen } from "@/lib/formatLastSeen"
import { useDebounceCallback } from "usehooks-ts"

export default function ChatList() {
  const {
    selectedUser,
    setSelectedUser,
    onlineUsers,
    allContacts,
    getChatPartners,
    getAllContacts,
    isUsersLoading,
    chats,
    lastSeen,
    searchResults,
    searchUsers,
    isSearching,
  } = useChatStore()

  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  const debounced = useDebounceCallback(setSearchQuery, 300)

  const hide = searchQuery ? true : false

  useEffect(() => {
    getChatPartners()
  }, [getChatPartners])

  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])

  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery)
    }
  }, [searchQuery])

  if (isUsersLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 border-r p-4">
      <div>
        <h1 className="text-xl font-bold">Messages</h1>
        <Input
          placeholder="Search"
          className="mt-4 rounded-xl"
          onChange={(e) => debounced(e.target.value)}
        />
      </div>

      <Separator />

      <Tabs defaultValue="contacts" className="flex flex-col">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted">
          <TabsTrigger
            value="contacts"
            className="w-full rounded-lg data-[state=active]:bg-background"
          >
            Contacts
          </TabsTrigger>

          <TabsTrigger
            value="chats"
            className="w-full rounded-lg data-[state=active]:bg-background"
          >
            Chats
          </TabsTrigger>
        </TabsList>

        {/* {searchResults?.length === 0 && <p>No Users found.</p>} */}
        <div className={`${hide ? "block" : "hidden"}`}>
          {isSearching && <p>Loading...</p>}
          {searchResults?.map((chat) => {
            const isOnline = onlineUsers?.includes(chat?._id)

            return (
              <ScrollArea className="h-[calc(100vh-140px)] px-2">
                <div className="space-y-1">
                  <button
                    key={chat?._id}
                    onClick={() => setSelectedUser(chat)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition hover:bg-muted ${
                      selectedUser?._id === chat?._id ? "bg-muted" : ""
                    } `}
                  >
                    <Avatar>
                      <AvatarImage src={chat?.profilepic} />
                      <AvatarFallback>
                        {chat?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <AvatarBadge
                        className={`${onlineUsers?.includes(chat?._id) ? "bg-green-600" : "bg-gray-600"}`}
                      />
                    </Avatar>

                    <div className="text-left">
                      <p className="font-medium">{chat?.name}</p>
                      <p className="text-sm">
                        {isOnline ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span className="text-gray-500">
                            {formatLastSeen(lastSeen[chat?._id])}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                </div>
              </ScrollArea>
            )
          })}
        </div>

        <TabsContent
          value="chats"
          className={`mt-2 flex-1 ${hide && "hidden"}`}
        >
          <ScrollArea className="h-[calc(100vh-140px)] px-2">
            <div className="space-y-1">
              {chats.length === 0 && <div>No chats found</div>}
              {chats.map((chat: User) => {
                const isOnline = onlineUsers?.includes(chat?._id)

                return (
                  <button
                    key={chat?._id}
                    onClick={() => setSelectedUser(chat)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition hover:bg-muted ${
                      selectedUser?._id === chat?._id ? "bg-muted" : ""
                    } `}
                  >
                    <Avatar>
                      <AvatarImage src={chat?.profilepic} />
                      <AvatarFallback>
                        {chat?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <AvatarBadge
                        className={`${onlineUsers?.includes(chat?._id) ? "bg-green-600" : "bg-gray-600"}`}
                      />
                    </Avatar>

                    <div className="text-left">
                      <p className="font-medium">{chat?.name}</p>
                      <p className="text-sm">
                        {isOnline ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span className="text-gray-500">
                            {formatLastSeen(lastSeen[chat?._id])}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="contacts"
          className={`mt-2 flex-1 ${hide && "hidden"}`}
        >
          <ScrollArea className="h-[calc(100vh-140px)] px-2">
            <div className="space-y-1">
              {isUsersLoading && <p>Loading...</p>}
              {allContacts?.map((contact: User) => {
                const isOnline = onlineUsers?.includes(contact?._id)

                return (
                  <button
                    key={contact?._id}
                    onClick={() => setSelectedUser(contact)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition hover:bg-muted ${
                      selectedUser?._id?.toString() === contact?._id
                        ? "bg-muted"
                        : ""
                    } `}
                  >
                    <Avatar>
                      <AvatarImage src={contact?.profilepic} />
                      <AvatarFallback>
                        {contact?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <AvatarBadge
                        className={`${isOnline ? "bg-green-600" : "bg-gray-600"}`}
                      />
                    </Avatar>

                    <div className="text-left">
                      <p className="font-medium">{contact?.name}</p>
                      <p className="text-sm">
                        {isOnline ? (
                          <span className="text-green-500">Online</span>
                        ) : (
                          <span className="text-gray-500">
                            {formatLastSeen(lastSeen[contact?._id])}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
