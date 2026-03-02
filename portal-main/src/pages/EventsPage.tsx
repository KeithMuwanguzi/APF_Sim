import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/EventComponents/HeroSection';
import EventCalendar from '../components/EventComponents/EventCalendar';
import UpcomingEvents from '../components/EventComponents/UpcomingEvents';
import PreviousEvents from '../components/EventComponents/PreviousEvents';
import CPDSection from '../components/EventComponents/CPDSection';

function EventsPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl mx-auto">
        <EventCalendar />
        <UpcomingEvents />
        <PreviousEvents />
        <CPDSection />
      </div>
      <Footer />
    </div>
  );
}

export default EventsPage;