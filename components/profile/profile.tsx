"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Grid3X3, Clapperboard, Bookmark } from "lucide-react"
import { useFetchUserByUsername } from "@/hooks/profile/useFetchUserByUsername"
import { useFetchPostsByUsername } from "@/hooks/profile/useFetchPostsByUsername"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { useState } from "react"
import EditProfile from "./edit-profile"
import { useFetchMySavedPosts } from "@/hooks/posts/useFetchMySavedPost"
import { useFetchReelsByUsername } from "@/hooks/profile/useFetchReelsByUsername"

const Profile = ({ username }: { username: string }) => {
  const { fetchProfile: profile, isLoading } = useFetchUserByUsername(username)
  const { fetchProfilePosts: profilePosts, isPostsLoading } =
    useFetchPostsByUsername(username)
  const { fetchProfileReels: profileReels, isReelsLoading } =
    useFetchReelsByUsername(username)

  const { data: session } = useSession()
  const user: User = session?.user as User

  const isMyProfile = user?.id === profile?._id.toString()
  const displayPost = isMyProfile || profile?.accountType === "public"

  const { mySavedPosts, savedPostsLoading } = useFetchMySavedPosts({
    enabled: !!profile && isMyProfile,
  })

  const [openProfile, setOpenProfile] = useState(false)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <section className="py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile?.profilepic} />
              <AvatarFallback>
                {profile?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <h2 className="text-2xl font-semibold">{profile?.username}</h2>

              {isMyProfile && (
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      setOpenProfile(true)
                    }}
                  >
                    Edit profile
                  </Button>
                </div>
              )}
            </div>

            <EditProfile open={openProfile} setOpen={setOpenProfile} />

            <div className="flex gap-8">
              <div>
                <span className="font-bold">{profilePosts?.length}</span> posts
              </div>

              <div>
                <span className="font-bold">{profile?.followers?.length}</span>{" "}
                followers
              </div>

              <div>
                <span className="font-bold">{profile?.following?.length}</span>{" "}
                following
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{profile?.name}</h3>

              <p className="text-muted-foreground">{profile?.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {!displayPost && (
        <div className="flex items-center justify-center">
          <p className="text-center text-muted-foreground">
            This profile is private
          </p>
        </div>
      )}

      {displayPost && (
        <Tabs defaultValue="posts">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="posts">
              <Grid3X3 size={16} />
            </TabsTrigger>

            <TabsTrigger value="reels">
              <Clapperboard size={16} />
            </TabsTrigger>

            {isMyProfile && (
              <TabsTrigger value="saved">
                <Bookmark size={16} />
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts">
            <div className="grid grid-cols-3 gap-1">
              {isPostsLoading && <div>Loading...</div>}
              {!isPostsLoading && profilePosts?.length === 0
                ? "No posts to display"
                : profilePosts?.map((post) => (
                    <div
                      key={post?._id}
                      className="relative aspect-square overflow-hidden"
                    >
                      <Image
                        fill
                        alt={`${post?.image}-${post?._id}.jpg`}
                        src={post?.image}
                        className="object-cover transition hover:scale-105"
                      />
                    </div>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="reels">
            <div className="grid grid-cols-3 gap-1">
              {isReelsLoading && <div>Loading...</div>}
              {!isReelsLoading && profileReels?.length === 0
                ? "No reels to display"
                : profileReels?.map((reel) => (
                    <div
                      key={reel?._id}
                      className="relative aspect-3/4 overflow-hidden"
                    >
                      <video
                        src={reel?.video}
                        className="object-cover transition hover:scale-105"
                      />
                    </div>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="grid grid-cols-3 gap-1">
              {savedPostsLoading && <div>Loading...</div>}
              {!savedPostsLoading && mySavedPosts?.length === 0
                ? "No saved posts"
                : mySavedPosts?.map((post) => (
                    <div
                      key={post?._id}
                      className="relative aspect-square overflow-hidden"
                    >
                      <Image
                        fill
                        alt={`${post?.image}-${post?._id}.jpg`}
                        src={post?.image}
                        className="object-cover transition hover:scale-105"
                      />
                    </div>
                  ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}

export default Profile
