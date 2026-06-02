import { auth } from "@/auth"
import MobileNav from "@/components/mobile-nav"
import Sidemenu from "@/components/side-bar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden select-none">
        {/* Sidebar */}

        <Sidemenu user={session?.user} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile Nav */}
        <MobileNav />
      </div>
    </SidebarProvider>
  )
}
