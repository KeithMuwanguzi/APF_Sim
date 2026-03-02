const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <img
          src="/images/event.jpg"
          alt="APF Events Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0" />

        {/* Centered Text */}
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Events
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;