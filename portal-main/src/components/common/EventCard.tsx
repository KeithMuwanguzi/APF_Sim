import { Calendar, Clock, MapPin } from "lucide-react";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  onRegister?: () => void;
}

function EventCard({
  image,
  title,
  date,
  time,
  location,
  description,
  onRegister,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out animate-fade-in-up h-full flex flex-col hover:-translate-y-2.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)] group">
      {/* Image */}
      <div className="h-[200px] overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title with hover color change */}
        <h6
          className="text-secondary text-[1.1rem] mb-2 leading-[1.3] font-semibold 
                     transition-colors duration-300 group-hover:text-purple-600"
        >
          {title}
        </h6>

        {/* Icons instead of emojis */}
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary" /> {date}
        </p>
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary" /> {time}
        </p>
        <p className="text-[#666] text-[0.9rem] py-1 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary" /> {location}
        </p>

        <p className="text-[#666] text-[0.9rem] py-1 pb-4 flex-grow">
          {description}
        </p>

        {/* Register Button */}
        <div className="mt-1">
          <button
            onClick={onRegister}
            className="w-full bg-[#5F1C9F] text-white rounded-[25px] py-3 font-semibold transition-all duration-300 ease-in-out mt-auto hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;