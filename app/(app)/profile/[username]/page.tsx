import Profile from "@/components/profile/profile"

const page = async ({ params }: { params: { username: string } }) => {
  const { username } = await params

  return (
    <div className="w-screen p-3 md:ml-3 md:w-[calc(100vw-270px)]">
      <div className="mx-auto w-full px-4 md:max-w-5xl">
        <Profile username={username} />
      </div>
    </div>
  )
}
export default page
