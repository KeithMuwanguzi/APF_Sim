import { Link } from "react-router-dom";
import heroImg from "../../assets/images/membershipPage-images/member.jpg";

function Hero() {
  return (
    <section
      className="
        relative h-[500px] flex items-center justify-center overflow-hidden
        pt-[56px] sm:pt-[64px]
        mt-[-56px] sm:mt-[-64px]
        bg-cover bg-center
      "
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImg})` }}
      
    >
      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-3xl mx-auto text-center text-white p-4 fade-in-up">
        <h1 className="text-2xl md:text-5xl font-bold mb-6 fade-in-up delay-200">
          Membership
        </h1>
        <Link to="/register">
        <button
          className="
            fade-in-up delay-600
            px-8 py-3 text-base font-semibold
            rounded-full border border-white
            bg-transparent text-white
            transition-all duration-300 ease-out
            hover:bg-white/15 hover:-translate-y-1
          "
        >
          Become a Member
        </button>
        </Link>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.1; }
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .gradient-overlay {
            background: linear-gradient(
              45deg,
              rgba(124, 58, 237, 0.1),
              rgba(124, 58, 237, 0.2)
            );
            animation: gradientShift 8s ease infinite;
          }

          .fade-in-up {
            animation: fadeInUp 1s ease-out both;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }

          .delay-600 {
            animation-delay: 0.6s;
          }
        `}
      </style>
    </section>
  );
}

export default Hero;
