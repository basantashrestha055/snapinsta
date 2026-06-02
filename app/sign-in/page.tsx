import Form from "@/components/sign-in-form"
import Image from "next/image"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen w-screen items-center justify-center gap-24 select-none lg:max-w-7xl">
      <div className="hidden w-1/2 lg:flex">
        <Image
          src={"/landing.png"}
          width={1000}
          height={1000}
          alt="landing.png"
          className="object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <Form />
      </div>
    </div>
  )
}
