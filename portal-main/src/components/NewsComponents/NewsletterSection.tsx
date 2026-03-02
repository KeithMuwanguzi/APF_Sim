import React from "react";

const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-[#DED2F6] py-12 px-6 md:px-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Never Miss an Update</h2>

        {/* Sentence broken into two lines */}
        <p className="text-gray-700 mb-2">
          Subscribe to our newsletter for the latest insights,
        </p>
        <p className="text-gray-700 mb-8">
          policy changes, and events directly in your inbox.
        </p>

        {/* Input + Button horizontally aligned */}
        <form className="flex items-center gap-4 w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white text-gray-200 flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-[#7944B4] text-white px-6 py-3 rounded-xl  hover:bg-purple-700 transition"
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;