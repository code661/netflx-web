import * as React from "react"
import Image from "next/image"
import type { SetState } from "@/types"
import { motion } from "framer-motion"

import { api } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfilePickerProps {
  profilePicker: boolean
  setProfilePicker: SetState<boolean>
  iconId: string
  setIconId: SetState<string>
}

const ProfilePicker = ({
  profilePicker,
  setProfilePicker,
  iconId,
  setIconId,
}: ProfilePickerProps) => {
  const [isScrolled, setIsScrolled] = React.useState(false)

  // change background color on scroll
  React.useEffect(() => {
    const changeBgColor = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false)
    }
    window.addEventListener("scroll", changeBgColor)
    return () => window.removeEventListener("scroll", changeBgColor)
  }, [isScrolled])

  //  user query
  const userQuery = api.profile.getCurrentUser.useQuery()

  // icons query
  const iconsQuery = api.icon.getAll.useQuery()

  return (
    <motion.div
      className="flex min-h-[200vh] w-full flex-col gap-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "sticky top-0 z-40 w-full pb-5 pt-20",
          isScrolled
            ? "bg-white shadow-md backdrop-blur-sm dark:bg-neutral-900/80"
            : "bg-transparent"
        )}
      >
        <div className="container flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Button
              aria-label="Go back"
              variant="ghost"
              className="h-auto p-0 hover:bg-transparent dark:hover:bg-transparent"
              onClick={() => setProfilePicker(false)}
            >
              <Icons.arrowLeft className="h-10 w-10" aria-hidden="true" />
            </Button>
            <div>
              <h1 className="text-2xl font-medium sm:text-3xl">Edit Profile</h1>
              <h2 className="text-xl font-medium sm:text-2xl">
                Choose a profile icon.
              </h2>
            </div>
          </div>
          {userQuery.data && (
            <div className="text-xl font-medium sm:text-2xl">
              {userQuery.data.name}
            </div>
          )}
        </div>
      </div>
      <div className="container flex w-full max-w-screen-2xl flex-col gap-2.5">
        <div className="text-xl font-medium sm:text-2xl">The Classics</div>
        {iconsQuery.isError ? (
          <div>Failed to load profiles</div>
        ) : iconsQuery.isLoading ? (
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="aspect-square w-32 bg-neutral-700" />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-5 overflow-x-auto py-1.5">
            {iconsQuery.data?.map((icon) => (
              <Button
                key={icon.id}
                aria-label="Choose profile icon"
                className="relative aspect-square h-auto w-32 min-w-[96px] overflow-hidden rounded p-0 hover:opacity-80 active:scale-90"
                onClick={() => {
                  setIconId(icon.id)
                  setProfilePicker(false)
                }}
              >
                {icon ? (
                  <Image
                    src={icon.href}
                    alt={icon.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Skeleton className="h-full w-full bg-neutral-700" />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProfilePicker
