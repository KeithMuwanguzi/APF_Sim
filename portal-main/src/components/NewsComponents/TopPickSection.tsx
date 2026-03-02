import React from "react";

const TopPickSection: React.FC = () => {
    return (
        <section className="bg-white py-12 px-6 md:px-12">
            <h2 className="text-center text-3xl font-bold text-black mb-10">
                Our Latest News: Top Pick
            </h2>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden md:flex">
                {/* Details */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex gap-2 mb-4">
                            <span className="bg-[#641BA1] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Featured
                            </span>
                            <span className="bg-gray-100 text-black text-xs font-semibold px-3 py-1 rounded-full">
                                Policy Update
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3">
                            Navigating the New Tax Regime: Key Considerations for Ugandan Businesses
                        </h3>
                        <p className="text-gray-700 mb-4">
                            The recent changes in Uganda's tax policy present both challenges and opportunities for businesses.
                            Our in-depth analysis provides a clear breakdown of the new regulations.
                        </p>
                        <div className="text-sm text-gray-500 mb-6">
                            <span>January 2, 2026</span> <span className="mx-2">•</span> <span>10 min read</span>
                        </div>
                    </div>

                    <button className="bg-[#641BA1] text-white py-2 rounded-xl w-full  transition">
                        Read More
                    </button>
                </div>
                {/* Image */}
                <div className="md:w-1/2">
                    <img
                        src="/images/News/Tax.jpg"
                        alt="Tax calculator and coins"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
};

export default TopPickSection;