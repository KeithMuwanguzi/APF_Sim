import { Link } from "react-router-dom";
export default function CallToAction() {
  return (
    <section className="bg-[#f7f3ff] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        {/* HEADING */}
        <h2 className="
          text-lg
          sm:text-xl
          md:text-2xl
          font-bold
          text-[#260B41]
          mb-4
        ">
          
          Ready to Advance Your Career?
        </h2>

        {/* DESCRIPTION */}
        <p className="
          text-sm
          sm:text-sm
          md:text-xl
          text-[#260B41]
          max-w-xl
          sm:max-w-2xl
          md:max-w-2xl
          mx-auto
          mb-6
          sm:mb-8
          leading-relaxed
        ">
          Join APF Uganda today and become part of a vibrant community committed
          to excellence in the accountancy profession. Unlock exclusive
          benefits, expand your network and shape the future of accountancy.
        </p>

        {/* CTA BUTTON */}
        <Link to="/register">
        <button
          className="
            inline-flex items-center justify-center
            px-5 py-3
            sm:px-6 sm:py-3
            text-sm sm:text-base
            bg-[#5F1C9F] text-white font-semibold
            rounded-full
            shadow-md
            transition-all duration-300
            hover:bg-purple-800 hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        >
          Join APF Today
        </button>
        </Link>
      </div>
    </section>
  );
}
