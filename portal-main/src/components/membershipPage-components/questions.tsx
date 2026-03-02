import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What are the eligibility criteria for professional membership",
    answer:
      "Professional membership is open to individuals who hold a recognized accountancy qualification (e.g. CPA, ACCA, CIMA) and possess a minimum of three years of relevant post-qualification experience.",
  },
  {
    question: "How do I apply for membership",
    answer:
      "You can apply for membership through our online portal. The process involves submitting your academic and professional qualifications, a detailed resume, and two professional references. Our team will review your application within 10 business days.",
  },
  {
    question: "What are the annual membership fees",
    answer:
      "The annual membership fees depend on the membership category. Detailed fee information is provided during the application process.",
  },
  {
    question: "What CPD requirements are there for members",
    answer:
      "Members are required to complete Continuing Professional Development (CPD) hours annually to maintain professional competence and membership status.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITLE */}
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>

        {/* FAQ LIST */}
        <div className="border-t border-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-b border-gray-200 py-4 sm:py-5"
              >
                {/* QUESTION */}
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {faq.question}
                  </span>

                  <span className="flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-purple-600" />
                    )}
                  </span>
                </button>

                {/* ANSWER */}
                {isOpen && (
                  <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
