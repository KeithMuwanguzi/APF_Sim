import heroImg from '../../assets/images/aboutPage-images/about1.jpg'

function Hero() {
  return (
    <div className="relative h-[400px] overflow-hidden">
      <img
        src={heroImg}
        alt="APF Uganda Team"
        className="w-full h-full object-cover brightness-[0.7]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <h2 className="text-white text-[2rem] md:text-5xl font-bold text-center [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
          About APF Uganda
        </h2>
      </div>
    </div>
  )
}

export default Hero
