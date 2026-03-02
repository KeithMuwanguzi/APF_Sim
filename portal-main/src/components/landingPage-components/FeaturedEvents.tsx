import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventCard from "../common/EventCard"
import { baseEvents } from "../EventComponents/eventsData"

const FeaturedEvents = () => {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Filter for upcoming events (you can add isFeatured property to events if needed)
  const today = new Date()
  const upcomingEvents = baseEvents.filter(
    (event) => new Date(event.date) >= today
  )

  // Auto-scroll: 30s mobile, 60s desktop
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth
        const nextIndex = (activeIndex + 1) % upcomingEvents.length
        const scrollAmount =
          (scrollRef.current.children[nextIndex] as HTMLElement)?.offsetLeft ??
          nextIndex * cardWidth
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
        setActiveIndex(nextIndex)
      }
    }, window.innerWidth < 768 ? 30000 : 60000) // breakpoint check

    return () => clearInterval(interval)
  }, [activeIndex, upcomingEvents.length])

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
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" })
    }
  }

  const handleRegister = (event: any) => {
    navigate('/event-registration', {
      state: {
        eventTitle: event.title,
        eventId: event.id
      }
    })
  }

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Featured Events
        </h2>
        
        {upcomingEvents.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No featured events at the moment.
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <>
            <div className="flex items-center gap-4">
              {/* Left Arrow (desktop only) */}
              <button
                onClick={scrollLeft}
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 
                           hover:bg-[#3C096C] transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Scrollable Cards */}
              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow"
              >
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="w-full snap-start flex-shrink-0 px-2
                               md:min-w-[250px] md:max-w-[360px]" // desktop: fixed width for 3 cards
                  >
                    <EventCard
                      image={event.image}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      description={event.description}
                      onRegister={() => handleRegister(event)}
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow (desktop only) */}
              <button
                onClick={scrollRight}
                className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 
                           hover:bg-[#3C096C] transition-colors flex-shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Dots (mobile only) */}
            <div className="flex justify-center mt-6 gap-2 md:hidden">
              {upcomingEvents.map((_, index) => (
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

export default FeaturedEvents;