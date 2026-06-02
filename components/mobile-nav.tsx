"use client"

import {
  HomeIcon,
  Film,
  Plus,
  Settings,
  Clapperboard,
  ImageIcon,
  CircleDot,
  CircleUserRound,
  User,
  EyeClosed,
  Shield,
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import CreatePostDialog from "./posts/create-post"
import CreateReelDialog from "./reels/create-reel"
import CreateStoryDialog from "./story/create-story"
import EditProfile from "./profile/edit-profile"
import ChangePassword from "./profile/change-password"
import AccountPrivacy from "./profile/account-privacy"

const MobileNav = () => {
  const pathname = usePathname()

  const [openPost, setOpenPost] = useState(false)
  const [openReel, setOpenReel] = useState(false)
  const [openStory, setOpenStory] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [openPassword, setOpenPassword] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)

  const navItems = [
    { href: "/home", icon: HomeIcon },
    { href: "/reels", icon: Film },
    { href: "/profile", icon: CircleUserRound },
  ]

  return (
    <>
      {/* Bottom Nav */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background md:hidden">
        <div className="flex items-center justify-around py-2">
          {/* Home / Reels / Settings */}
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
              </Link>
            )
          })}

          {/* SETTINGS BUTTON WITH POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 text-muted-foreground">
                <Settings className="h-6 w-6" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="center" className="w-53 rounded-xl p-2">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setOpenProfile(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </button>

                <button
                  onClick={() => setOpenPassword(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <EyeClosed className="h-4 w-4" />
                  Change Password
                </button>

                <button
                  onClick={() => setOpenPrivacy(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <Shield className="h-4 w-4" />
                  Account Privacy
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* CREATE BUTTON WITH POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 text-muted-foreground">
                <Plus className="h-6 w-6" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="center" className="w-44 rounded-xl p-2">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setOpenPost(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <ImageIcon className="h-4 w-4" />
                  Post
                </button>

                <button
                  onClick={() => setOpenReel(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <Clapperboard className="h-4 w-4" />
                  Reel
                </button>

                <button
                  onClick={() => setOpenStory(true)}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                >
                  <CircleDot className="h-4 w-4" />
                  Story
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Dialogs */}
      <CreatePostDialog open={openPost} setOpen={setOpenPost} />
      <CreateReelDialog open={openReel} setOpen={setOpenReel} />
      <CreateStoryDialog open={openStory} setOpen={setOpenStory} />
      <EditProfile open={openProfile} setOpen={setOpenProfile} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
      <AccountPrivacy open={openPrivacy} setOpen={setOpenPrivacy} />
    </>
  )
}

export default MobileNav
