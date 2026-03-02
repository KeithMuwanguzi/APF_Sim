import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ContactHero from '../components/contactPage-components/ContactHero'
import ContactForm from '../components/contactPage-components/ContactForm'
import ContactMap from '../components/contactPage-components/ContactMap'

function ContactPage() {
  return (
    <div>
      <Navbar />
      <ContactHero />
      <ContactForm />
      <ContactMap />
      <Footer />
    </div>
  )
}

export default ContactPage
