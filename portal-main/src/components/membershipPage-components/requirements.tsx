import { useState } from "react";
import { ChevronDown } from "lucide-react";
import requirementsImg from "../../assets/images/membershipPage-images/account.jpg";

const requirements = [
  {
    title: "Valid ICPAU Practising Certificate",
    content:
      "Applicants must hold a current and valid practising certificate issued by ICPAU.",
  },
  {
    title: "Identification & Qualifications",
    content:
      "National ID or passport and certified academic/professional qualifications are required for verification.",
  },
  {
    title: "Completed Online Application",
    content:
      "Applicants must accurately complete the APF online membership application form.",
  },
  {
    title: "Membership Fees",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Registration Fee: UGX 50,000</li>
        <li>Annual Subscription: UGX 150,000</li>
        <li>Payments accepted via Mobile Money or Bank Transfer</li>
      </ul>
    ),
  },
];

export default function MembershipRequirements() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* LEFT: ACCORDION */}
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
              Membership Requirements
            </h2>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {requirements.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="w-full flex items-center justify-between text-left gap-4"
                    >
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        {item.title}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: IMAGE */}
          <div className="flex justify-center md:justify-end">
            <img
              src={requirementsImg}
              alt="Membership requirements"
              className="
                w-full
                max-w-xs
                sm:max-w-sm
                md:max-w-md
                h-64
                md:h-80
                lg:h-96
                object-contain
                rounded-lg
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
}
