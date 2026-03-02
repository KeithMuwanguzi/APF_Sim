import React, { useState } from "react";

type NewsItem = {
    category: string;
    title: string;
    summary: string;
    date: string;
    readTime: string;
    image: string;
};

const newsItems: NewsItem[] = [
    {
        category: "Thought Leadership",
        title: "The Future of Accountancy: Embracing Digital",
        summary:
            "Digital tools are reshaping the accounting landscape. Explore how AI, blockchain, and cloud computing are revolutionizing...",
        date: "October 18, 2024",
        readTime: "7 min read",
        image: "/images/News/digital.jpeg",
    },
    {
        category: "Ethics & Governance",
        title: "Strengthening Ethical Frameworks in Public Practice",
        summary:
            "A deep dive into the importance of ethical conduct in maintaining public trust and the role of APF in fostering integrity...",
        date: "October 10, 2024",
        readTime: "9 min read",
        image: "/images/News/legal.png",
    },
    {
        category: "Announcements",
        title: "Highlights from the Annual CPD Conference 2024",
        summary:
            "Recap of the key takeaways, insightful sessions, and networking opportunities from our recent successful CPD conference.",
        date: "September 30, 2024",
        readTime: "5 min read",
        image: "/images/News/annual.jpg",
    },
    {
        category: "SME Support",
        title: "Financial Strategies for Sustainable SME Growth",
        summary:
            "Practical advice and proven strategies for small and medium-sized enterprises to achieve sustainable financial growth...",
        date: "September 22, 2024",
        readTime: "6 min read",
        image: "/images/News/growth.jpeg",
    },
    {
        category: "Policy Update",
        title: "Understanding IFRS 17: Impact on Insurance",
        summary:
            "An essential guide to IFRS 17 and its profound implications for the insurance sector in Uganda...",
        date: "September 13, 2024",
        readTime: "11 min read",
        image: "/images/News/Insurance.webp",
    },
    {
        category: "Announcements",
        title: "Member Spotlight: Celebrating Professional Excellence",
        summary:
            "We feature one of our esteemed members, highlighting their journey, achievements, and contributions...",
        date: "September 08, 2024",
        readTime: "8 min read",
        image: "/images/News/member.jpeg",
    },
];

const getTagStyle = (category: string) => {
    switch (category) {
        case "Thought Leadership":
            return "bg-gray-200 text-gray-800";
        case "Ethics & Governance":
            return "bg-gray-200 text-gray-800";
        case "Announcements":
            return "bg-gray-200 text-gray-800";
        case "SME Support":
            return "bg-gray-200 text-gray-800";
        case "Policy Update":
            return "bg-gray-200 text-gray-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
};

const categories = [
    "All Categories",
    "Policy Update",
    "Thought Leadership",
    "Announcements",
    "Ethics & Governance",
    "SME Support",
];

const OtherNewsSection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const filteredItems =
        selectedCategory === "All Categories"
            ? newsItems
            : newsItems.filter((item) => item.category === selectedCategory);

    return (
        <section className="bg-[#F8F5FE] py-12 px-6 md:px-12">
            <h2 className="text-center text-3xl font-bold text-black mb-6">Our Other News</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat
                                ? "bg-[#641BA1] text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* News Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5">
                            <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${getTagStyle(
                                    item.category
                                )}`}
                            >
                                {item.category}
                            </span>
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-3">{item.summary}</p>
                            <div className="text-sm text-gray-500 mb-4">
                                {item.date} <span className="mx-2">•</span> {item.readTime}
                            </div>
                            <a
                                href="#"
                                className="text-[#641BA1] font-semibold text-sm hover:underline"
                            >
                                Read More
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OtherNewsSection;