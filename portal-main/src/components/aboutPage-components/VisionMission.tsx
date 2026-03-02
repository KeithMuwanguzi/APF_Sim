import { Rocket, Target, CircleCheckBig, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

function VisionMission() {
  const [openObjectives, setOpenObjectives] = useState(true)

  const objectives = [
    'Advocacy & Representation',
    'Networking & Collaboration',
    'Policy Engagement',
    'Governance & Leadership',
    'Learning Community',
    'Public Awareness',
    'Knowledge Hub',
    'Innovation & Talent',
    'Practice Enablers'
  ]

  return (
    <section className="bg-[#F8F7FF] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Our Vision Card */}
          <div className="relative p-10 bg-[#5E2590] text-white flex flex-col min-h-[450px]">
            
            <div className="absolute top-10 right-10">
              <Rocket className="w-10 h-10 text-white opacity-90" />
            </div>
            
            
            <div className="mt-auto mb-14">
              <h4 className="text-3xl font-bold mb-6 tracking-tight">Our Vision</h4>
              <p className="leading-relaxed text-[1rem] text-white/90">
                To be the unified voice and transformative hub for accountancy practitioners in Uganda, elevating the profession’s impact on Uganda’s economy and beyond.
              </p>
            </div>
          </div>

          {/* Our Mission Card  */}
          <div className="relative p-10 bg-white border border-gray-100 shadow-sm flex flex-col min-h-[450px]">
            
            <div className="absolute top-5 right-5">
              <div className="absolute top-5 right-5">
                <Target className="w-10 h-10 text-purple-800 opacity-90" />
              </div>
            </div>
            
            
            <div className="mt-auto mb-4">
              <h4 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Our Mission</h4>
              <p className="text-black-600 leading-relaxed text-[1rem]">
                To elevate the accounting profession in Uganda through strategic advocacy, continuous knowledge sharing, and the deployment of cutting-edge practice enablers, ensuring our members lead with integrity and innovation in a global market.
              </p>
            </div>
          </div>

          {/* Our Objectives Section */}
          <div className="flex flex-col pt-2">
           
            <button
              onClick={() => setOpenObjectives(!openObjectives)}
              className="flex items-center justify-start gap-2 w-fit border-b border-gray-400 pb-4 mb-6"
            >
              <h4 className="text-3xl font-bold text-gray-900">Our Objectives</h4>
              {openObjectives ? (
                <ChevronUp className="w-6 h-6 text-[#5E2590]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#5E2590]" />
              )}
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                openObjectives ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="grid grid-cols-1 gap-y-4">
                {objectives.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                   
                    <CircleCheckBig className="w-5 h-5 text-b shrink-0" />
                    <span className="text-gray-700 text-[0.95rem] font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default VisionMission