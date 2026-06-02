"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useAcceptRequest } from "@/hooks/request/useAcceptRequest"
import { useRejectRequest } from "@/hooks/request/useRejectRequest"
import { Request } from "@/types/Request"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  requests: Request[] | undefined
}

const Notification = ({ open, setOpen, requests }: Props) => {
  const { acceptRequest } = useAcceptRequest()
  const { rejectRequest } = useRejectRequest()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-screen px-3 py-6 md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        {requests?.length === 0 ? (
          <p className="p-4 text-center">No requests</p>
        ) : (
          <div className="space-y-4">
            {requests?.map((request) => (
              <Item variant="outline" key={request?._id}>
                <ItemMedia>
                  <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
                    <Avatar className="hidden sm:flex">
                      <AvatarImage
                        src={request?.senderId?.profilepic}
                        alt={request?.senderId?.username}
                      />
                      <AvatarFallback>
                        {request?.senderId?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="italic">
                    {request?.senderId?.name}
                  </ItemTitle>
                  <ItemDescription>
                    {request?.senderId?.username}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acceptRequest({ requestid: request?._id })}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => rejectRequest({ requestid: request?._id })}
                  >
                    Reject
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Notification
