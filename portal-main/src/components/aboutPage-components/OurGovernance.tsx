
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import ronaldImg from '../../assets/images/aboutPage-images/CPA Ronald Katumba.jpg'
import sarahImg from '../../assets/images/aboutPage-images/CPA Sarah Nejesa.webp'
import michaelImg from '../../assets/images/aboutPage-images/CPA Michael Tugyetwena.png'
import johnImg from '../../assets/images/aboutPage-images/CPA John kato.webp'
import arindaImg from '../../assets/images/aboutPage-images/CPA Arinda Jolus.jpg'
import patienceImg from '../../assets/images/aboutPage-images/CPA Patience Atuhaire.jpg'

function OurGovernance() {
  const { elementRef, isVisible } = useScrollAnimation()

  const leaders = [
    { name: 'CPA Ronald Katumba', role: 'Director', image: ronaldImg },
    { name: 'CPA Sarah Nejesa', role: 'Vice Chairperson', image: sarahImg },
    { name: 'CPA Michael Tugyetwena', role: 'Chairperson', image: michaelImg },
    { name: 'CPA John Kato', role: 'Secretary', image: johnImg },
    { name: 'CPA Arinda Jolus', role: 'Technical lead', image: arindaImg },
    { name: 'CPA Patience Atuhaire', role: 'Chief Accountant', image: patienceImg }
  ]

  return (
    <section className="bg-[#FBFAFF] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 
          ref={elementRef}
          className={`text-center text-secondary text-[2.5rem] mb-4 font-bold transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Our Governance
        </h3>
        <p className="text-center text-[#666] mb-12 max-w-[700px] mx-auto">
          Meet the dedicated leaders who steer APF Uganda towards its vision of 
          professional excellence and integrity.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_12px_rgba(0,0,0,0.15)]"
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-[200px] h-[200px] rounded-[2rem]  mx-auto mb-6 object-cover"
              />
              <h6 className="text-secondary text-[1.1rem] font-semibold mb-2">
                {leader.name}
              </h6>
              <p className="text-[#666] text-[0.9rem]">
                {leader.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurGovernance