import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/aboutPage-components/Hero'
import OurHistory from '../components/aboutPage-components/OurHistory'
import Timeline from '../components/aboutPage-components/Timeline'
import OurWork from '../components/aboutPage-components/OurWork'
import VisionMission from '../components/aboutPage-components/VisionMission'
import OurGovernance from '../components/aboutPage-components/OurGovernance'
import JoinCTA from '../components/aboutPage-components/JoinCTA'

function AboutPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <OurHistory />
      <Timeline />
      <OurWork />
      <VisionMission />
      <OurGovernance />
      <JoinCTA />
      <Footer />
    </div>
  )
}

export default AboutPage
