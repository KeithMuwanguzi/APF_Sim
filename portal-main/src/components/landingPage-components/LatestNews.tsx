import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import NewsCard from '../cards/NewsCard'

import news1Img from '../../assets/images/landingPage-image/news1.webp'
import news2Img from '../../assets/images/landingPage-image/news2.webp'
import news3Img from '../../assets/images/landingPage-image/news3.png'

interface NewsItem {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
}

const CARDS_PER_VIEW = 3
const AUTO_SCROLL_INTERVAL = 60_000

function LatestNews() {
  const { elementRef, isVisible } = useScrollAnimation()

  const [cardsVisible, setCardsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const autoScrollTimerRef =  useRef<ReturnType<typeof window.setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const news: NewsItem[] = [
    {
      image: news1Img,
      tag: 'Thought Leadership',
      title: 'The Future of Accountancy: Embracing  Transformation',
      description:
        'Digital tools are revolutionizing the accounting landscape. Explore how AI & blockchain are revolutionizing accounting practices .',
      date: 'October 18, 2024',
      readTime: '7 min read',
    },
    {
      image: news2Img,
      tag: 'Ethics & Governance',
      title: 'Strengthening Ethical Frameworks in Public Practice',
      description:
        'A deep dive into the importance of ethical conduct in maintaining public trust and the role of APF in fostering integrity within the profession.',
      date: 'October 10, 2024',
      readTime: '5 min read',
    },
    {
      image: news3Img,
      tag: 'Announcements',
      title: 'Highlights from the Annual CPD Conference 2024',
      description:
        'Recap of the key takeaways, insightful sessions, and networking opportunities from our recent successful CPD conference.',
      date: 'September 28, 2024',
      readTime: '5 min read',
    },
    {
      image: news1Img,
      tag: 'Industry Insights',
      title: 'Navigating Tax Compliance in 2026',
      description:
        'Expert insights on the latest tax regulations and how they impact accounting professionals and their clients.',
      date: 'September 15, 2024',
      readTime: '6 min read',
    },
    {
      image: news2Img,
      tag: 'Member Spotlight',
      title: 'Success Stories from Our Community',
      description:
        'Celebrating the achievements of our members and their contributions to the accounting profession.',
      date: 'September 5, 2024',
      readTime: '4 min read',
    },
    {
      image: news3Img,
      tag: 'Professional Development',
      title: 'Continuous Learning: The Key to Career Growth',
      description:
        'Discover how ongoing professional development can enhance your career prospects and expertise.',
      date: 'August 28, 2024',
      readTime: '5 min read',
    },
  ]

  const maxIndex = news.length - CARDS_PER_VIEW


  useEffect(() => {
    if (!isVisible) return
    const timeout = setTimeout(() => setCardsVisible(true), 200)
    return () => clearTimeout(timeout)
  }, [isVisible])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile auto-scroll
  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % news.length)
    }, AUTO_SCROLL_INTERVAL)
    return () => clearInterval(interval)
  }, [isMobile, news.length])

  // Desktop auto-scroll
  useEffect(() => {
    if (isMobile) return
    startAutoScroll()
    return clearAutoScroll
  }, [isMobile, maxIndex])

 

  const clearAutoScroll = () => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }
  }

  const startAutoScroll = () => {
    clearAutoScroll()
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, AUTO_SCROLL_INTERVAL)
  }

  const resetAutoScroll = () => {
    if (!isMobile) startAutoScroll()
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    resetAutoScroll()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    resetAutoScroll()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!isMobile) return
    const swipeDistance = touchStartX.current - touchEndX.current
    if (swipeDistance > 50) {
      setMobileIndex((prev) => Math.min(prev + 1, news.length - 1))
    } else if (swipeDistance < -50) {
      setMobileIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <section className="bg-purple-300 py-16">
      <div className="max-w-6xl mx-auto px-6 relative">
        <h2
          ref={elementRef}
          className={`text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          Latest News & Insights
        </h2>

        {/*  Mobile View  */}
        <div className="sm:hidden">
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            >
              {news.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <NewsCard {...item} delay={0} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setMobileIndex((p) => Math.max(p - 1, 0))}
              className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                setMobileIndex((p) => Math.min(p + 1, news.length - 1))
              }
              className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/*  Desktop View  */}
        <div className="hidden sm:block relative">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute -left-12 top-1/2 -translate-y-1/2
                       bg-white w-11 h-11 rounded-full shadow
                       flex items-center justify-center
                       hover:scale-110 transition
                       disabled:opacity-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {news.map((item, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-3">
                  <NewsCard
                    {...item}
                    delay={cardsVisible ? (index % 3) * 150 : 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute -right-12 top-1/2 -translate-y-1/2
                       bg-white w-11 h-11 rounded-full shadow
                       flex items-center justify-center
                       hover:scale-110 transition
                       disabled:opacity-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LatestNews
