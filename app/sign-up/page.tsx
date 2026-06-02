"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signupSchema } from "@/schemas/signupSchema"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const { data } = await axios.post<ApiResponse>(
        "/api/auth/sign-up",
        values
      )
      toast.success(data.message)
      router.replace(`/verify-code/${values.username}`)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    await signIn("google")
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")

    if (error === "ACCOUNT_EXISTS_CREDENTIALS") {
      toast.error(
        "An account with this email already exists. Please sign in with your credentials."
      )
      router.replace("/sign-in")
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>SnapInsta</CardTitle>
          <CardDescription>
            Welcome to SnapInsta! Please log in to your account or sign up to
            get started.
          </CardDescription>
          <CardAction>
            <Button variant={"link"} onClick={() => router.replace("/sign-in")}>
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-form-name"
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
                    <FieldLabel htmlFor="sign-up-form-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-form-username"
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
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-form-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="off"
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </FieldGroup>
          </form>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Form
