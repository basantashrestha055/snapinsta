"use client"

import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"
import { changePasswordSchema } from "@/schemas/changePasswordSchema"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const ChangePassword = ({ open, setOpen }: Props) => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    try {
      setLoading(true)

      const { data } = await axios.put<ApiResponse>(
        "/api/change-password",
        values
      )

      toast.success(data.message)

      setOpen(false)
      signOut()
    } catch (err: any) {
      console.error(err)
      const errorMessage = err.response?.data?.message || "Something went wrong"

      if (errorMessage.includes("New")) {
        form.setError("newPassword", {
          type: "server",
          message: errorMessage,
        })
      } else {
        form.setError("currentPassword", {
          type: "server",
          message: errorMessage,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form
          id="change-password-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          aria-disabled={loading}
        >
          <FieldGroup className="py-4">
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="change-password-form-currentPassword">
                    Current Password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="off"
                    type="password"
                    onChange={(e) => {
                      field.onChange(e)
                      form.clearErrors("currentPassword")
                      form.clearErrors("form")
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="change-password-form-newPassword">
                    New Password
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="off"
                    type="password"
                    onChange={(e) => {
                      field.onChange(e)
                      form.clearErrors("newPassword")
                      form.clearErrors("form")
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setLoading(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!form.formState.isValid || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePassword
