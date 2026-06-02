"use client"

import { Story } from "@/types/Story"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"

interface Props {
  openViewers: boolean
  setOpenViewers: (v: boolean) => void
  setPaused: (v: boolean) => void
  story: Story
}

const StoryViewersModal = ({
  openViewers,
  setOpenViewers,
  setPaused,
  story,
}: Props) => {
  return (
    <Drawer
      open={openViewers}
      onOpenChange={(v) => {
        setOpenViewers(v)

        if (!v) {
          setPaused(false)
        }
      }}
    >
      <DrawerContent className="mx-auto w-full rounded-t-3xl md:max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Viewers</DrawerTitle>
        </DrawerHeader>

        <div className="max-h-96 overflow-y-auto px-4 pb-6">
          {story?.viewers?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No viewers yet</p>
          ) : (
            <div className="space-y-4">
              {story?.viewers?.map((viewer: any) => (
                <div key={viewer._id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={viewer.profilepic || "/default_avatar.webp"}
                    />
                  </Avatar>

                  <span className="font-medium">{viewer?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default StoryViewersModal
