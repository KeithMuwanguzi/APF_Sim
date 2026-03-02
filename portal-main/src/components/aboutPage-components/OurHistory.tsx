import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { History, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function OurHistory() {
  const { elementRef, isVisible } = useScrollAnimation()

  const historyLinks = [
    { text: 'Become a Member', path: '/membership' },
    { text: 'Our Events', path: '/events' },
    { text: 'News & Insights', path: '/news' },
    
    { text: "Chairman's Message", path: '/' }, 
  ]

  return (
    <section className="bg-[#F8F9FB] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="w-10 h-10 rounded-full bg-[#5E2590] flex items-center justify-center shadow-sm">
                <History className="w-5 h-5 text-white" />
              </div>
            </div>

            <h4
              ref={elementRef}
              className={`text-black text-4xl font-extrabold mb-4 transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Our History
            </h4>

            <p className="leading-relaxed text-gray-600 text-[0.95rem] max-w-xl lg:max-w-2xl">
              The Accountancy Practitioners Forum (APF Uganda) is the leading professional
              body dedicated to advancing the accountancy profession in Uganda. 
              We uphold ethical standards, foster professional development, and advocate 
              for policies that benefit our members and the nation's economic growth.
            </p>
          </div>

          {/* Right Column: Active Links */}
          <div className="flex flex-col border-l-2 border-[#5E2590] pl-8 md:mt-24 self-start">
            <div className="flex flex-col gap-0.5 w-full max-w-[260px]"> 
              {historyLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="group flex items-center gap-3 py-3 border-b border-gray-200 last:border-0 transition-all duration-300 hover:pl-2"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5E2590] shrink-0 transition-all group-hover:bg-[#4a1d72] group-hover:scale-110">
                    <ChevronRight className="w-3.5 h-3.5 text-white stroke-[3px]" />
                  </div>
                  
                  <span className="text-[#5E2590] text-[0.9rem] font-bold whitespace-nowrap tracking-tight group-hover:text-[#4a1d72]">
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default OurHistory