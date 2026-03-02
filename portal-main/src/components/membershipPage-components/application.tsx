import {
  User,
  FileText,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { id: 1, title: "Create Account", icon: User },
  { id: 2, title: "Submit Application & Documents", icon: FileText },
  { id: 3, title: "Make Payment & eKYC Verify", icon: CreditCard },
  { id: 4, title: "Get Approved & Access Dashboard", icon: UserCheck },
];

export default function MembershipProcess() {
  return (
    <section className="bg-[#f7f3ff] py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* TITLE */}
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-12">
          Membership Application Process
        </h2>

        {/* STEPPER */}
        <div className="relative">
          {/* DESKTOP CONNECTOR LINE */}
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-[3px] bg-purple-600" />

          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.id}
                  className="relative flex items-start md:flex-col md:items-center text-left md:text-center md:w-1/4 px-4 md:px-0"
                >
                  {/* ICON + CONNECTOR */}
                  <Link to="/register" className="relative flex flex-col items-center">
                    {/* STEP NUMBER */}
                    <span
                      className="
                        absolute -top-2 -left-2
                        w-8 h-8 rounded-full
                        bg-white border border-purple-600
                        text-xs font-semibold text-purple-700
                        flex items-center justify-center
                        z-20
                      "
                    >
                      {step.id}
                    </span>

                    {/* ICON */}
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white z-10">
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* MOBILE CONNECTOR LINE */}
                    {!isLast && (
                      <span className="
                          md:hidden
                          absolute
                          top-12
                          left-1/2
                          -translate-x-1/2
                          w-[2px]
                          h-[calc(100%+3rem)]
                          bg-purple-300
                        " />
                    )}
                  </Link>

                  {/* LABEL */}
                  <p className="
                        mt-4
                        text-[18px] font-medium text-gray-800
                        w-[180px]
                        mx-auto">
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
