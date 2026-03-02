import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[60vh] flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/images/News/news1.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Insights</h1>
        
      </div>
    </section>
  );
};

export default HeroSection;