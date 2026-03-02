import { Calendar, Clock, MapPin } from 'lucide-react'

interface EventCardProps {
  image: string
  title: string
  date: string
  time: string
  location: string
  description: string
  onRegister?: () => void
  delay?: number
}

function EventCard({ 
  image, 
  title, 
  date, 
  time, 
  location, 
  description, 
  onRegister,
  delay = 0 
}: EventCardProps) {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group opacity-0 translate-y-12 animate-fade-in-up w-full"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] leading-tight transition-colors duration-300 group-hover:text-purple-700">
          {title}
        </h3>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-purple-600" />
            <span className="leading-tight">{date}</span>
          </div>
          <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-purple-600" />
            <span className="leading-tight">{time}</span>
          </div>
          <div className="flex items-start gap-2 transition-transform duration-300 group-hover:translate-x-1">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-purple-600" />
            <span className="leading-tight">{location}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6 min-h-[2.5rem] sm:min-h-[3rem] leading-relaxed">
          {description}
        </p>
        
        <button 
          onClick={onRegister}
          className="w-full bg-purple-700 text-white py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default EventCard
