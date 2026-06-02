import axios from "axios"

export const socketServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!,
})
