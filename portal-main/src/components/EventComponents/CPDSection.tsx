import {
  TrendingUp,
  GraduationCap,
  CheckCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

const CPDSection = () => {
  const cpdItems = [
    {
      icon: TrendingUp,
      points: "5",
      title: "Industry Trends",
      description: "Stay updated with the latest industry trends and regulations."
    },
    {
      icon: GraduationCap,
      points: "8",
      title: "Professional Skills",
      description: "Enhance your professional skills and competencies."
    },
    {
      icon: CheckCircle,
      points: "6",
      title: "Exclusive Access",
      description: "Access exclusive workshops, webinars, and conferences."
    },
    {
      icon: ShieldCheck,
      points: "4",
      title: "License Maintenance",
      description: "Maintain your professional license and credibility."
    },
    {
      icon: Users,
      points: "7",
      title: "Professional Network",
      description: "Network with leading professionals in the accountancy field."
    }
  ];

  return (
    <section className="bg-[#E5DCF9] py-16 -mx-[50vw] px-[50vw]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          CPD Accreditation
        </h2>

        <h3 className="text-xl font-semibold text-[#562497] mb-4">
          Elevate Your Expertise with APF CPD
        </h3>
        <p className="text-gray-700 mb-8">
          Our Continuous Professional Development (CPD) programs are meticulously
          designed to ensure accountancy practitioners in Uganda remain at the
          forefront of industry knowledge, ethical standards, and professional skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {cpdItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon in circle */}
                <div className="flex flex-col items-center mb-4">
                  <div className="bg-[#562497] text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Title and description */}
                <h4 className="font-semibold text-[#562497] mb-2 text-sm">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CPDSection;