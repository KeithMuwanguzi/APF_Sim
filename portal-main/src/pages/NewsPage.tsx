import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import HeroSection from '../components/NewsComponents/HeroSection';
import TopPickSection from "../components/NewsComponents/TopPickSection";
import OtherNewsSection from '../components/NewsComponents/OtherNewsSection';
import NewsletterSection from '../components/NewsComponents/NewsletterSection';

function NewsPage() {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <TopPickSection />        
        <OtherNewsSection />
        <NewsletterSection />
      <Footer />
    </div>
  )
}

export default NewsPage
