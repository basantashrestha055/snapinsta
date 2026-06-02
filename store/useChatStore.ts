import { getRoomId } from "@/lib/getRoomId"
import { ApiResponse } from "@/types/ApiResponse"
import { Message } from "@/types/Message"
import { SessionUser, User } from "@/types/User"
import axios from "axios"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { create } from "zustand"

type MessageData = {
  text?: string
  file?: string
}

type ChatStore = {
  socket: Socket | null
  onlineUsers: string[]
  lastSeen: Record<string, number>
  allContacts: User[]
  searchResults: User[]
  chats: User[]
  user: SessionUser | null
  messages: Message[]
  activeTab: string
  imagePreview: string | null
  selectedUser: User | null
  isUsersLoading: boolean
  isMessagesLoading: boolean
  isSearching: boolean

  setUser: (user: SessionUser | null) => void
  setActiveTab: (tab: string) => void
  setImagePreview: (preview: string | null) => void
  setSelectedUser: (selectedUser: User | null) => void
  getAllContacts: () => Promise<void>
  searchUsers: (query: string) => Promise<void>
  getChatPartners: () => Promise<void>
  getMessagesByUserId: (userId: string) => Promise<void>
  sendMessage: (messageData: MessageData) => Promise<void>
  subsribeToMessage: () => void
  unSubscribeFromMessage: () => void
  connectSocket: (userId: string) => void
  disconnectSocket: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  user: null,
  onlineUsers: [],
  searchResults: [],
  lastSeen: {},
  activeTab: "chats",
  selectedUser: null,
  socket: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearching: false,
  imagePreview: null,

  setUser: (user) => set({ user }),

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),

  setImagePreview: (imagePreview: string | null) => set({ imagePreview }),

  getAllContacts: async () => {
    set({ isUsersLoading: true })
    try {
      const { data } = await axios.get<ApiResponse<User[]>>(
        "/api/get-my-contacts"
      )
      set({ allContacts: data.data })
    } catch (error: any) {
      console.error(error?.response?.data?.message || error.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getChatPartners: async () => {
    set({ isUsersLoading: true })
    try {
      const { data } = await axios.get<ApiResponse<User[]>>(
        "/api/get-chat-partners"
      )
      set({ chats: data.data })
    } catch (error: any) {
      console.error(error?.response?.data?.message || error.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true })
    try {
      const { data } = await axios.get<ApiResponse<Message[]>>(
        `/api/get-message/${userId}`
      )
      set({ messages: data.data })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  searchUsers: async (query: string) => {
    set({ isSearching: true })
    try {
      const { data } = await axios.get<ApiResponse<User[]>>(
        `/api/search-users?q=${query}`
      )
      set({ searchResults: data.data })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      set({ isSearching: false })
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser, messages, user } = get()

    if (!selectedUser || !user) return

    const temp = `temp-${Date.now()}`

    const optimisticMessage = {
      _id: temp,
      senderId: user.id,
      recipientId: selectedUser._id,
      text: messageData.text,
      file: messageData.file,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }

    set({ messages: [...messages, optimisticMessage] })

    try {
      const { data } = await axios.post<ApiResponse<Message>>(
        `/api/send-message/${selectedUser?._id}`,
        {
          message: messageData?.text,
          file: messageData?.file,
        }
      )

      if (!data?.data) return

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === temp ? (data.data as Message) : msg
        ),
      }))
    } catch (error: any) {
      set({ messages: messages })
      console.error(error?.response?.data?.message || error.message)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  },

  connectSocket: () => {
    const { socket, user } = get()

    if (!user || socket?.connected) return

    const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
      withCredentials: true,
      transports: ['websocket']
    })

    socketConnection.connect()

    set({ socket: socketConnection })

    socketConnection.emit("user", user)

    socketConnection.on(
      "presence-update",
      (data: { onlineUsers: string[]; lastSeen: Record<string, number> }) => {
        set({ onlineUsers: data.onlineUsers, lastSeen: data.lastSeen })
      }
    )
  },

  disconnectSocket: () => {
    const { socket } = get()

    if (!socket) return

    if (socket?.connected) {
      socket.disconnect()
    }
  },

  subsribeToMessage: () => {
    const { selectedUser, socket, user } = get()
    if (!selectedUser || !socket || !user) return

    socket.off("new-message")

    socket.on("new-message", (message: Message) => {
      if (message.senderId !== selectedUser._id) return

      const currentMessages = get().messages

      set({ messages: [...currentMessages, message] })
    })
  },

  unSubscribeFromMessage: () => {
    const { socket } = get()

    if (!socket) return

    socket.off("new-message")
  },
}))
