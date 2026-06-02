import { formatDistanceToNow } from "date-fns"

export const formatLastSeen = (timestamp?: number) => {
  if (!timestamp) {
    return "Offline"
  }

  return `Last seen ${formatDistanceToNow(timestamp, { addSuffix: true })}`
}
