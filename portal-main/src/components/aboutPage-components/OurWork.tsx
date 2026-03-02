import { useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { ArrowRight, ArrowLeft,  } from 'lucide-react'

import workImg1 from '../../assets/images/aboutPage-images/our_work1.png'

function OurWork() {
  const { elementRef, isVisible } = useScrollAnimation()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    { url: workImg1, alt: "APF Team Collaboration" },
    { url: workImg1, alt: "APF Professional Development" },
    { url: workImg1, alt: "APF Advocacy Meeting" }
  ]

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

  return (
    <section className="bg-[#F8F7FF] py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-md">
            <h4 
              ref={elementRef}
              className={`text-[#1e293b] text-4xl mb-8 font-bold transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Our Work
            </h4>
            <p className="leading-relaxed text-[#4B5563] text-lg">
              APF supports its accounting professionals through advocacy, consultation, 
              and professional development. We promote ethical practice, influence policy, 
              shape standards and provide platforms that help practitioners thrive, 
              innovate and lead within the profession.
            </p>
          </div>

          {/* Slider Content */}
          <div className="relative flex items-center">
            
            <button
              onClick={prevSlide}
              className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-purple-400/50 shadow-xl flex items-center justify-center text-[#ffffff] hover:bg-[#5E2590] hover:text-white transition-all duration-300 z-20"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>

            
            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl shadow-sm bg-gray-200">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={slide.url} 
                    alt={slide.alt}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>

            {/* onClick from prevSlide to nextSlide */}
            <button
              onClick={nextSlide}
              className="flex w-7 h-7 rounded-full bg-purple-400/50 items-center justify-center text-[#ffffff] "
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>

          </div>
        </div>

       
        <div className="flex justify-center gap-3 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide ? 'w-4 h-4 bg-[#5E2590]' : 'w-4 h-4 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurWork