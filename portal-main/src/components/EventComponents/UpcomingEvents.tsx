import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../common/EventCard";
import { baseEvents } from "./eventsData";

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const today = new Date();
  const upcomingEvents = baseEvents.filter(
    (event) => new Date(event.date) >= today
  );

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth;
        const nextIndex = (activeIndex + 1) % upcomingEvents.length;
        const scrollAmount =
          (scrollRef.current.children[nextIndex] as HTMLElement)?.offsetLeft ??
          nextIndex * cardWidth;
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
        setActiveIndex(nextIndex);
      }
    }, window.innerWidth < 768 ? 30000 : 60000);

    return () => clearInterval(interval);
  }, [activeIndex, upcomingEvents.length]);

  // Track scroll position for dots
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const cardWidth = scrollRef.current.offsetWidth;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
      }
    };

    const ref = scrollRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
  };

  const handleRegister = (event: any) => {
    navigate('/event-registration', {
      state: {
        eventTitle: event.title,
        eventId: event.id
      }
    });
  };

  return (
    <section className="bg-white py-12 -mx-[50vw] px-[50vw] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Upcoming Events
        </h2>

        <div className="flex items-center gap-4">
          <button onClick={scrollLeft} className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-grow">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="w-full snap-start flex-shrink-0 px-2 md:min-w-[250px] md:max-w-[360px]">
                <EventCard
                  {...event}
                  onRegister={() => handleRegister(event)}
                />
              </div>
            ))}
          </div>

          <button onClick={scrollRight} className="hidden md:flex bg-[#7E49B3] text-white rounded-full shadow p-3 hover:bg-[#3C096C] transition-colors flex-shrink-0">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {upcomingEvents.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No upcoming events at the moment. Check back soon!
          </div>
        )}

        {/* Mobile Progress Dots */}
        <div className="flex justify-center mt-6 gap-2 md:hidden">
          {upcomingEvents.map((_, index) => (
            <div key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-[#7E49B3]" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;