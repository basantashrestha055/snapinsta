"use client"

import {
  Bell,
  CircleDot,
  CircleUserRound,
  Clapperboard,
  EyeClosed,
  HomeIcon,
  ImageIcon,
  LogOut,
  Plus,
  Send,
  Settings,
  Shield,
  User2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useState } from "react"
import CreatePostDialog from "./posts/create-post"
import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import CreateReelDialog from "./reels/create-reel"
import CreateStoryDialog from "./story/create-story"
import EditProfile from "./profile/edit-profile"
import ChangePassword from "./profile/change-password"
import AccountPrivacy from "./profile/account-privacy"
import Notification from "./profile/notification"
import { useFetchRequest } from "@/hooks/request/useFetchRequest"
import { useChatStore } from "@/store/useChatStore"

const Sidemenu = ({ user }: { user: User | undefined }) => {
  const { requests, isLoading } = useFetchRequest()
  const { disconnectSocket } = useChatStore()

  const menus = [
    {
      id: 1,
      name: "Home",
      href: "/home",
      icon: <HomeIcon />,
    },
    {
      id: 2,
      name: "Reels",
      href: "/reels",
      icon: <Clapperboard />,
    },
    {
      id: 3,
      name: "Profile",
      href: `/profile/${user?.username}`,
      icon: <CircleUserRound />,
    },
    {
      id: 4,
      name: "Messages",
      href: "/messages",
      icon: <Send />,
    },
  ]

  const [openPost, setOpenPost] = useState(false)
  const [openReel, setOpenReel] = useState(false)
  const [openStory, setOpenStory] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [openPassword, setOpenPassword] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)

  return (
    <Sidebar className="hidden md:flex md:w-64">
      <SidebarHeader>
        <span className="text-lg font-bold">SnapInsta</span>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent className="my-6">
        <SidebarGroup>
          <SidebarMenu>
            {menus.map((menu) => (
              <SidebarMenuItem key={menu.id}>
                <SidebarMenuButton asChild>
                  <Link href={menu.href}>
                    {menu.icon}
                    <span>{menu.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={(e) => {
                  e.preventDefault()
                  setOpenNotification(true)
                }}
              >
                <Link href="#notifications">
                  <Bell />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
              {!isLoading && requests && requests?.length > 0 && (
                <SidebarMenuBadge>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-2">
                    {requests?.length}
                  </div>
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>

            <Notification
              open={openNotification}
              setOpen={setOpenNotification}
              requests={requests}
            />
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <Plus />
                Create
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenPost(true)
                }}
              >
                Post
                <DropdownMenuShortcut>
                  <ImageIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <CreatePostDialog open={openPost} setOpen={setOpenPost} />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenReel(true)
                }}
              >
                Reels
                <DropdownMenuShortcut>
                  <Clapperboard />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <CreateReelDialog open={openReel} setOpen={setOpenReel} />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenStory(true)
                }}
              >
                Story
                <DropdownMenuShortcut>
                  <CircleDot />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <CreateStoryDialog open={openStory} setOpen={setOpenStory} />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
        <SidebarGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <Settings />
                Settings
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenProfile(true)
                }}
              >
                Edit Profile
                <DropdownMenuShortcut>
                  <User2 />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <EditProfile open={openProfile} setOpen={setOpenProfile} />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenPassword(true)
                }}
              >
                Change Password
                <DropdownMenuShortcut>
                  <EyeClosed />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <ChangePassword open={openPassword} setOpen={setOpenPassword} />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenPrivacy(true)
                }}
              >
                Account Privacy
                <DropdownMenuShortcut>
                  <Shield />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <AccountPrivacy open={openPrivacy} setOpen={setOpenPrivacy} />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  const { socket, user } = useChatStore.getState()
                  socket?.emit("logout", user?.id)

                  disconnectSocket()
                  await signOut()
                }}
              >
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage src={user?.image || ""} alt={`${user?.name}.jpg`} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarBadge className="border-green-600 bg-green-600" />
          </Avatar>
          <span className="font-semibold">{user?.name}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default Sidemenu
