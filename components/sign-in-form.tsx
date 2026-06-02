"use client"

import { signinSchema } from "@/schemas/signinSchema"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
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
} from "./ui/card"

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true)

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Invalid credentials")
      setIsSubmitting(false)
    }

    if (result?.url) {
      router.replace("/home")
      toast.success("Logged in successfully")
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
    <>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant={"link"} onClick={() => router.replace("/sign-up")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-form-identifier">
                      Username or email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-form-identifier"
                      aria-invalid={fieldState.invalid}
                      placeholder="Username or email"
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
                    <FieldLabel htmlFor="login-form-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-form-password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
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
                    Logging in...
                  </>
                ) : (
                  "Log in"
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
            Login with Google
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default Form
