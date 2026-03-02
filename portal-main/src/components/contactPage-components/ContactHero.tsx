import haloSection from '../../assets/images/contactUs-page/halo_section.png'

function ContactHero() {
  return (
    <div
      className="h-[400px] md:h-[500px] flex items-center justify-center relative overflow-hidden pt-16 -mt-16 bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-primary/20 before:animate-gradient-shift"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${haloSection})`,
      }}
    >
      <h2 className="relative z-10 text-white text-[2.5rem] md:text-[3.5rem] font-bold text-center px-4 animate-fade-in-up">
        Contact us
      </h2>
    </div>
  )
}

export default ContactHero
