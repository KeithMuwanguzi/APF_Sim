import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import defaultConnectingImg from '../../assets/images/landingPage-image/shake.jpg'


function ConnectingProfessionals({ data }: { data?: any[] }) {
  const { elementRef, isVisible } = useScrollAnimation()
  
  
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Fallback content if CMS data hasn't loaded yet
  const fallbackSections = [
    { title: 'Empowerment', content: 'Access shared resources and opportunities for growth.' },
    { title: 'Engagement', content: 'Participate in meaningful discussions and collaborative projects.' },
    { title: 'Networking', content: 'Build valuable connections with fellow professionals.' }
  ]

  const items = data && data.length > 0 ? data : fallbackSections;

  return (
    <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center animate-[fadeIn_1s_ease-out]">
        <div className="flex-1 animate-[slideInLeft_1s_ease-out]">
          <h4 
            ref={elementRef}
            className={`text-secondary text-[1.75rem] sm:text-[2rem] mb-6 sm:mb-8 font-bold relative transition-all duration-[800ms] ease-out text-center md:text-left ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <span className="block md:inline">Connecting Accounting</span>{' '}
            <span className="block md:inline">Professionals</span>
          </h4>
          
          {items.map((section: any, index: number) => (
            <div 
              key={index}
              className="border-b border-[#ddd] py-4 sm:py-6 transition-all duration-300 hover:pl-2.5 hover:border-l-[1px] hover:border-l-primary"
            >
              <h6 
                onClick={() => toggleSection(index)}
                className={`flex justify-between items-center text-base sm:text-[1.2rem] cursor-pointer transition-colors duration-300 font-semibold hover:text-primary ${
                  openIndex === index ? 'text-primary' : 'text-secondary'
                }`}
              >
                {section.title} 
                <span className="transition-transform duration-300 inline-block">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </span>
              </h6>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-40 opacity-100 mt-3 sm:mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[#666] leading-relaxed text-sm sm:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative animate-[slideInRight_1s_ease-out] before:content-[''] before:absolute before:-top-2.5 before:-left-2.5 before:right-2.5 before:bottom-2.5 before:border-[3px] before:border-primary before:rounded-lg before:-z-10 group w-full md:w-auto flex-shrink-0">
          <img
            src={defaultConnectingImg}
            alt="Connecting Professionals"
            className="w-full md:w-[500px] h-auto md:h-[350px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-50px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  )
}

export default ConnectingProfessionals