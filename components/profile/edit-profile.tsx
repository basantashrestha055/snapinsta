"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Pencil } from "lucide-react"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { editProfileSchema } from "@/schemas/editProfileSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

type UploadResponse = {
  secure_url: string
}

const EditProfile = ({ open, setOpen }: Props) => {
  const { data: session, update } = useSession()
  const user: User = session?.user as User

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    setPreview(URL.createObjectURL(selected))
  }

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      profilepic: user?.profilepic || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    try {
      setLoading(true)

      let imageUrl

      if (file) {
        const uploadForm = new FormData()
        uploadForm.append("file", file)

        const uploadResponse = await axios.post<ApiResponse<UploadResponse>>(
          "/api/upload",
          uploadForm
        )

        if (!uploadResponse.data.success || !uploadResponse.data.data) {
          toast.error("Upload failed")
          return
        }

        imageUrl = uploadResponse.data.data.secure_url
      }

      const { data } = await axios.put<ApiResponse>("/api/edit-profile", {
        profilepic: imageUrl || "",
        name: values?.name,
        username: values?.username,
        bio: values?.bio,
      })

      await update({
        ...session,
        user: {
          ...session?.user,
          profilepic: imageUrl || session?.user?.profilepic,
          name: values.name,
          username: values.username,
          bio: values.bio,
        },
      })

      toast.success(data.message)

      setOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg sm:w-screen sm:p-3">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form id="edit-profile-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="profilepic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-center">
                    <div className="relative inline-block">
                      <Image
                        src={
                          preview || user?.profilepic || "/default_avatar.webp"
                        }
                        alt={`${user?.username}-profile.png`}
                        width={80}
                        height={80}
                        loading="eager"
                        className="rounded-full object-cover"
                      />

                      {editMode && (
                        <>
                          <label
                            htmlFor="edit-profile-form-profilepic"
                            className="absolute -right-1 -bottom-1 z-10 cursor-pointer"
                          >
                            <div className="rounded-full border-2 bg-red-500 p-1.5">
                              <Pencil className="h-4 w-4" />
                            </div>
                          </label>

                          <Input
                            id="edit-profile-form-profilepic"
                            type="file"
                            accept="image/*"
                            aria-invalid={fieldState.invalid}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </Field>
              )}
            />
            <Button onClick={() => setEditMode(true)} type="button">
              Edit Profile
            </Button>
          </FieldGroup>
          <FieldGroup className="overflow-y-auto py-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-profile-form-name">Name</FieldLabel>
                  <Input
                    {...field}
                    disabled={!editMode}
                    aria-invalid={fieldState.invalid}
                    placeholder="Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-profile-form-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={!editMode}
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-profile-form-bio">Bio</FieldLabel>
                  <Textarea
                    {...field}
                    disabled={!editMode}
                    aria-invalid={fieldState.invalid}
                    placeholder="Edit your bio"
                    autoComplete="off"
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
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false)
                  setFile(null)
                  setPreview(null)
                  setLoading(false)
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!form.formState.isValid || loading || !editMode}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfile
