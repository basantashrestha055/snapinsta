"use client"

import { useSendRequest } from "@/hooks/request/useSendRequest"
import { useFetchSuggestedUsers } from "@/hooks/suggestions/useFetchSuggestedUsers"
import Image from "next/image"
import { useRouter } from "next/navigation"

const suggestions = () => {
  const { suggestedUsers, isLoading } = useFetchSuggestedUsers()
  const { sendRequest } = useSendRequest()

  const router = useRouter()

  if (isLoading) {
    return <div>Loading...</div>
  } else if (suggestedUsers?.length === 0) {
    return <div>No suggested users</div>
  }

  return (
    <div className="sticky top-20 select-none">
      <h3 className="mb-4 font-semibold text-muted-foreground">
        Suggested for you
      </h3>

      <div className="flex flex-col gap-4">
        {suggestedUsers?.map((user) => (
          <div key={user?._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={user?.profilepic || "/default_avatar.webp"}
                alt={`${user?.username}-profile.png`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p
                  className="cursor-pointer text-sm font-medium"
                  onClick={() => router.replace(`/profile/${user?.username}`)}
                >
                  {user?.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  Suggested for you
                </p>
              </div>
            </div>

            <button
              className="text-sm font-semibold text-blue-400 hover:text-blue-300"
              onClick={() => sendRequest({ userid: user?._id })}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default suggestions
