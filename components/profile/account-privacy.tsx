"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"
import { Switch } from "../ui/switch"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AccountPrivacy = ({ open, setOpen }: Props) => {
  const { data: session, update } = useSession()
  const user: User = session?.user as User

  const [isPrivate, setIsPrivate] = useState(user?.accountType === "private")

  const handleSubmit = async () => {
    try {
      const newState = !isPrivate
      setIsPrivate(newState)

      const { data } = await axios.put<ApiResponse>("/api/toggle-private")

      await update({
        ...session,
        user: {
          ...session?.user,
          accountType: newState ? "private" : "public",
        },
      })

      toast.success(data.message)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Account Privacy</DialogTitle>
        </DialogHeader>
        <Field orientation="horizontal" className="max-w-sm py-4">
          <FieldContent>
            <FieldLabel htmlFor="private-account">Private Account</FieldLabel>
            <FieldDescription>
              Enabling this will make your account private. Users who do not
              follow you cannot see your posts on your profile.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="private-account"
            onClick={handleSubmit}
            checked={isPrivate}
          />
        </Field>
      </DialogContent>
    </Dialog>
  )
}

export default AccountPrivacy
