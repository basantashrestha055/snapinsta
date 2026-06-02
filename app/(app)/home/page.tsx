import Feed from "@/components/feed/feed"
import Suggestions from "@/components/feed/suggestions"
import Stories from "@/components/story/stories"

const page = async () => {
  return (
    <div className="flex w-screen gap-8 p-6 md:w-[calc(100vw-270px)]">
      {/* Feed */}
      <div className="flex w-full max-w-7xl items-center justify-center">
        <div className="w-full max-w-117.5">
          <Stories />
          <Feed />
        </div>
      </div>

      {/* Suggestions */}
      <div className="hidden w-lg pr-12 lg:block">
        <Suggestions />
      </div>
    </div>
  )
}

export default page
