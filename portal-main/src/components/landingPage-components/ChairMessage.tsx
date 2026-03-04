import { useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import defaultChairmanImg from '../../assets/images/landingPage-image/chair.jpg'
import { CMS_BASE_URL } from '../../config/api';

interface ChairMessageProps {
  data?: {
    name?: string;
    role?: string;
    fullMessage?: string;
    photo?: {
      url: string;
    };
  };
}

function ChairMessage({ data }: ChairMessageProps) {
  const { elementRef, isVisible } = useScrollAnimation()
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle dynamic photo from Strapi
  const photoUrl = data?.photo?.url 
    ? `${CMS_BASE_URL}${data.photo.url}` 
    : defaultChairmanImg;

  return (
    <section className="bg-[#e9d5ff] py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-12 items-center animate-[fadeIn_1s_ease-out]">
        
        {/* Profile Image Container */}
        <div className="relative overflow-hidden rounded-lg w-full max-w-[300px] h-[350px] flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] group flex-shrink-0 shadow-lg">
          <img
            src={photoUrl}
            alt={data?.name || "Chairperson"}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 relative z-0 group-hover:scale-105"
          />
        </div>
        
        <div className="animate-[slideInRight_1s_ease-out] flex-1">
          <h4 
            ref={elementRef}
            className={`text-secondary text-[1.75rem] sm:text-[2rem] mb-4 sm:mb-6 font-bold relative inline-block transition-all duration-[800ms] ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            A Message from the Board Chairperson
          </h4>
          
         

          {/* Dynamic Message Content */}
          <div className="leading-relaxed text-[#333] text-sm sm:text-base whitespace-pre-line">
            {isExpanded 
              ? (data?.fullMessage || "Welcome to the Accountancy Professionals Forum Uganda. As the leading professional body for accountants in Uganda, we are committed to advancing excellence, integrity, and innovation in the accountancy profession. Our mission is to support our members through continuous professional development, advocacy, and creating opportunities for networking and collaboration. Together, we are building a stronger, more ethical financial sector that contributes to Uganda's economic growth and development.")
              : `${(data?.fullMessage || "Welcome to the Accountancy Professionals Forum Uganda. As the leading professional body for accountants in Uganda, we are committed to advancing excellence, integrity, and innovation in the accountancy profession. Our mission is to support our members through continuous professional development, advocacy, and creating opportunities for networking and collaboration. Together, we are building a stronger, more ethical financial sector that contributes to Uganda's economic growth and development.").substring(0, 350)}...`}
          </div>
          
          {/* Read More Button */}
          {((data?.fullMessage || "Welcome to the Accountancy Professionals Forum Uganda. As the leading professional body for accountants in Uganda, we are committed to advancing excellence, integrity, and innovation in the accountancy profession. Our mission is to support our members through continuous professional development, advocacy, and creating opportunities for networking and collaboration. Together, we are building a stronger, more ethical financial sector that contributes to Uganda's economic growth and development.").length > 350) && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary font-semibold mt-4 mb-4 p-0 transition-all duration-300 bg-transparent text-sm sm:text-base hover:underline hover:translate-x-1.5"
            >
              {isExpanded ? 'Show Less ←' : 'Read Full Message →'}
            </button>
          )}
          
          <div className="mt-4 sm:mt-6 border-t border-purple-200 pt-4">
            <p className="font-bold text-sm sm:text-base">
              {data?.name || "CPA Ronald Mutumba"}
            </p>
            <p className="text-[#666] text-[0.85rem] sm:text-[0.9rem]">
              {data?.role || "Board Chairperson - APF Uganda"}
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  )
}

export default ChairMessage
