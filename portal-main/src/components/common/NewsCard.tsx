interface NewsCardProps {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
  onReadMore?: () => void
}

function NewsCard({ image, tag, title, description, date, readTime, onReadMore }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out animate-fade-in-up h-full flex flex-col hover:-translate-y-2.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)] group">
      <div className="h-[200px] overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="inline-block bg-[#e9d5ff] text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2 self-start">
          {tag}
        </span>
        <h6 className="text-secondary text-[1.1rem] my-2 min-h-[2.6em] leading-[1.3] line-clamp-2 font-semibold">
          {title}
        </h6>
        <p className="text-[#666] text-[0.9rem] leading-[1.6] my-2 min-h-[4.8em] line-clamp-3 flex-grow">
          {description}
        </p>
        <p className="text-[#999] text-[0.8rem] block mt-2">
          {date} • {readTime}
        </p>
        <button
          onClick={onReadMore}
          className="text-primary font-semibold mt-2 p-0 transition-all duration-300 ease-in-out self-start hover:underline hover:translate-x-1.5 bg-transparent"
        >
          Read More
        </button>
      </div>
    </div>
  )
}

export default NewsCard
