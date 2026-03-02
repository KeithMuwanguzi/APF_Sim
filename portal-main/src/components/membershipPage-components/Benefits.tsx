import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import image1 from "../../assets/images/membershipPage-images/image1.webp";
import image2 from "../../assets/images/membershipPage-images/image2.webp";
import image3 from "../../assets/images/membershipPage-images/image3.jpg";
import image4 from "../../assets/images/membershipPage-images/image3.jpg";

interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    id: "b1",
    title: "Specialized Training",
    description:
      "Access to high-level Continuing Professional Development (CPD) tailored specifically for practice owners and audit partners (e.g., Quality Management Standards, IFRS updates, and Anti-Money Laundering compliance).",
    image: image1,
  },
  {
    id: "b2",
    title: "Practice Enablers",
    description:
      "Subsidized access to 'practice-in-a-box' tools, including audit software, tax management systems, and AI-driven accounting licenses to modernize your firm's operations.",
    image: image2,
  },
  {
    id: "b3",
    title: "Mentorship & Peer Review",
    description:
      "A structured framework where seasoned practitioners guide newer firms through ICPAU quality assurance reviews and practice management challenges.",
    image: image3,
  },
  {
    id: "b4",
    title: "Direct Advocacy",
    description:
      "A seat at the table in high-level policy dialogues with regulators (ICPAU, URSB, URA) to ensure the interests of practicing accountants are protected in national legislation.",
    image: image4,
  },
  {
    id: "b5",
    title: "Collective Voice",
    description:
      "Participation in the APF Knowledge Hub, contributing to periodic publications and position papers that shape the future of the profession in Uganda.",
    image: image1,
  },
  {
    id: "b6",
    title: "Exclusive Forums",
    description:
      "Invitations to quarterly 'Partners-Only' roundtables and social events designed to foster collaboration and multi-firm partnerships for large-scale assignments.",
    image: image2,
  },
  {
    id: "b7",
    title: "Sector Bridges",
    description:
      "Facilitated networking with leaders in the banking, insurance, and manufacturing sectors to promote the value of independent audit and advisory services.",
    image: image3,
  },
  {
    id: "b8",
    title: "Leadership Track",
    description:
      "Opportunities to serve on APF specialized committees or the Executive Board, enhancing your professional profile and influence within the national accountancy ecosystem.",
    image: image4,
  },
  {
    id: "b9",
    title: "Professional Endorsement",
    description:
      "Right to display the 'APF Member' logo on firm stationery and websites, signaling a commitment to the highest standards of governance and innovation.",
    image: image1,
  },
  {
    id: "b10",
    title: "Awards & Spotlights",
    description:
      "Eligibility for annual awards recognizing 'Innovative Practice of the Year' or 'Excellence in Advocacy,' providing public visibility for your firm's achievements.",
    image: image2,
  },
];

// 🔧 Card sizing
const CARD_WIDTH_MOBILE = 260;
const CARD_WIDTH_DESKTOP = 300;
const CARD_GAP = 32;

function Benefits(): JSX.Element {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const visibleCards = isMobile ? 1 : 3;
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;

  const maxIndex = Math.max(0, benefits.length - visibleCards);
  // Calculate number of pages based on visible cards
  const totalPages = Math.ceil(benefits.length / visibleCards);
  const [index, setIndex] = useState(0);
  // Calculate current page based on index
  const currentPage = Math.floor(index / visibleCards);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - visibleCards, 0));
  }, [visibleCards]);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + visibleCards, maxIndex));
  }, [maxIndex, visibleCards]);

  return (
    <section className="bg-white py-16">
      {/* TITLE */}
      <div className="max-w-[900px] mx-auto text-center">
         <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-10">
        Benefits of Joining APF Uganda
      </h2>
      <p className="
          text-sm
          sm:text-base
          text-black
          leading-relaxed
          sm:leading-[2.4]
          max-w-[1050px]
          mx-auto
          mb-10
        ">
          By joining APF Uganda, you will be part of a professional community
          that connects accounting practitioners, supports their growth, and
          represents their interests across Uganda.
      </p>
      </div>
     

      {/* CAROUSEL */}
      <div className="flex justify-center">
        <div className="relative">
          {/* LEFT ARROW (outside mask) */}
          <button
            onClick={prev}
            aria-label="Previous"
            className={`absolute
              -left-10
              top-1/2 -translate-y-1/2 z-10
              w-8 h-8 flex items-center justify-center rounded-full
              bg-purple-500
              ${index === 0 ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* MASK (STRICT VIEWPORT — SHOWS EXACTLY 3 ON DESKTOP) */}
          <div
            className="overflow-hidden"
            style={{
              width:
                cardWidth * visibleCards +
                CARD_GAP * (visibleCards - 1),
            }}
          >
            {/* TRACK */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                gap: `${CARD_GAP}px`,
                transform: `translateX(-${
                  index * (cardWidth + CARD_GAP)
                }px)`,
              }}
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-100"
                  style={{ width: cardWidth }}
                >
                  {/* IMAGE */}
                  <div className="h-[180px] sm:h-[200px] overflow-hidden">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ARROW (outside mask) */}
          <button
            onClick={next}
            aria-label="Next"
            className={`absolute
              -right-10
              top-1/2 -translate-y-1/2 z-10
              w-8 h-8 flex items-center justify-center rounded-full
              bg-purple-500
              ${index === maxIndex ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors
              ${i === currentPage ? "bg-purple-600" : "bg-slate-300"}
            `}
          />
        ))}
      </div>
    </section>
  );
}

export default Benefits;
