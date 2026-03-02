interface NewsCardProps {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
  onReadMore?: () => void
  delay?: number
}

function NewsCard({ 
  image, 
  tag, 
  title, 
  description, 
  date, 
  readTime, 
  onReadMore,
  delay = 0 
}: NewsCardProps) {
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
        <span className="inline-block bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded mb-2 sm:mb-3 transition-all duration-300 group-hover:bg-purple-100 group-hover:text-purple-700">
          {tag}
        </span>
        
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] leading-tight transition-colors duration-300 group-hover:text-purple-700">
          {title}
        </h3>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4.5rem] leading-relaxed">
          {description}
        </p>
        
        <div className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
          {date} • {readTime}
        </div>
        
        <button 
          onClick={onReadMore}
          className="text-purple-700 font-semibold text-xs sm:text-sm hover:underline transition-all duration-300 hover:translate-x-2 inline-flex items-center group/btn"
        >
          Read More
          <span className="ml-1 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
        </button>
      </div>
    </div>
  )
}

export default NewsCard
