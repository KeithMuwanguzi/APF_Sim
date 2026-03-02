import { useEffect, useRef, useState } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { baseEvents } from "./eventsData"

const PreviousEvents = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Utility: check if event has expired
  const isExpired = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const now = new Date()
    return eventDate < now
  }

  const previousEvents = baseEvents.filter((event) => isExpired(event.date))

  // Auto-scroll: 30s mobile, 60s desktop
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth
        const nextIndex = (activeIndex + 1) % previousEvents.length
        const scrollAmount =
          (scrollRef.current.children[nextIndex] as HTMLElement)?.offsetLeft ??
          nextIndex * cardWidth
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
        setActiveIndex(nextIndex)
      }
    }, window.innerWidth < 768 ? 30000 : 60000)

    return () => clearInterval(interval)
  }, [activeIndex])

  // Calculate max card height dynamically based on content
  useEffect(() => {
    if (scrollRef.current) {
      const heights = Array.from(scrollRef.current.children).map(
        (child) => (child as HTMLElement).scrollHeight
      )
      if (heights.length > 0) {
        setCardHeight(Math.max(...heights))
      }
    }
  }, [])

  // Track scroll position for dots (mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft
        const cardWidth = scrollRef.current.offsetWidth
        const index = Math.round(scrollLeft / cardWidth)
        setActiveIndex(index)
      }
    }

    const ref = scrollRef.current
    ref?.addEventListener("scroll", handleScroll)
    return () => ref?.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" })
    }
  }

  return (
    <section className="bg-[#F5EFFB] py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Previous Events
        </h2>
        
        {previousEvents.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No previous events to display.
          </div>
        )}

        {previousEvents.length > 0 && (
          <>
            <div className="flex items-center gap-4">
              {/* Left Arrow (desktop only) */}
              <button
                onClick={scrollLeft}
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Scrollable Cards */}
              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow gap-6"
              >
                {previousEvents.map((event, index) => (
                  <div
                    key={index}
                    className="w-full snap-start flex-shrink-0 px-2
                               md:min-w-[350px] md:max-w-[350px] bg-gray-50 rounded-2xl shadow-md flex flex-col"
                    style={{ height: cardHeight ? `${cardHeight}px` : "auto" }}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-40 w-full object-cover rounded-t-2xl"
                    />
                    <div className="flex flex-col justify-between flex-grow p-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-700 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-1">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      {/* No register button for expired events */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow (desktop only) */}
              <button
                onClick={scrollRight}
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Dots (mobile only) */}
            <div className="flex justify-center mt-6 gap-2 md:hidden">
              {previousEvents.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300
                    ${index === activeIndex ? "bg-[#7E49B3]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PreviousEvents