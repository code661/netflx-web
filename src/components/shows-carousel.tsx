"use client"

import * as React from "react"
import Image from "next/image"
import { useMounted } from "@/hooks/use-mounted"
import { useModalStore } from "@/stores/modal"
import type { Show } from "@/types"
import { useDraggable } from "react-use-draggable-scroll"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ShowsCarouselProps {
  title: string
  shows: Show[]
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const showsRef = React.useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>
  const [isScrollable, setIsScrollable] = React.useState(false)

  // endless scroll to left or right
  const scrollToDirection = (direction: "left" | "right") => {
    if (!showsRef.current) return

    setIsScrollable(true)
    const { scrollLeft, clientWidth } = showsRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    showsRef.current.scrollTo({ left: offset, behavior: "smooth" })

    if (scrollLeft === 0) {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: "smooth",
      })
    }
  }

  // check if component is mounted
  const mounted = useMounted()

  // draggable scrollbar
  const { events: dragEvents } = useDraggable(showsRef, {
    isMounted: mounted,
  })

  // modal store for storing show and modal state
  const modalStore = useModalStore()

  return (
    <section aria-label="Carousel of shows">
      {shows.length !== 0 && (
        <div className="container w-full max-w-screen-2xl ">
          <h2 className="text-base font-semibold text-white/90 transition-colors hover:text-white md:text-xl ">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            <Button
              aria-label="Scroll to right"
              variant="ghost"
              className={cn(
                "absolute left-0 top-8 z-10 h-[8.5rem] rounded-none bg-slate-950/50 px-1 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50",
                isScrollable ? "block" : "hidden"
              )}
              onClick={() => scrollToDirection("left")}
            >
              <Icons.chevronLeft
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </Button>
            <Button
              aria-label="Scroll to left"
              variant="ghost"
              className="absolute right-0 top-8 z-10 h-[8.5rem] rounded-none bg-slate-950/50 px-1 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50"
              onClick={() => scrollToDirection("right")}
            >
              <Icons.chevronRight
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </Button>
            <div
              ref={showsRef}
              className="no-scrollbar flex h-full w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden"
              {...dragEvents}
            >
              {shows.map((show) => (
                <div
                  key={show.id}
                  className={cn(
                    "group relative my-8 aspect-video min-w-[15rem] !cursor-pointer overflow-hidden rounded-sm transition-all duration-300 ease-in-out hover:m-8 hover:scale-125",
                    dragEvents.onMouseDown
                  )}
                  onClick={() => {
                    modalStore.setShow(show)
                    modalStore.setOpen(true)
                    modalStore.setPlay(false)
                  }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${
                      show.backdrop_path ?? show.poster_path
                    }`}
                    alt={show.title ?? "poster"}
                    fill
                    sizes="(max-width: 768px) 100vw, 
                        (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ShowsCarousel
