import React from 'react';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    color: 'black' | '#DFBAE3' | '#9E4FDE';
}

const Timeline: React.FC = () => {
    const events: TimelineEvent[] = [
        {
            year: 'June 13, 2025',
            title: 'Foundation Established',
            description: 'The founding members laid the structural and governance foundation of APF through the signing of the Memorandum of Association.',
            color: 'black'
        },
        {
            year: 'June 20, 2025',
            title: 'Legal Recognition Achieved',
            description: 'APF was officially incorporated by the Uganda Registration Services Bureau (URSB) as a Company Limited by Guarantee under the Companies Act of Uganda.',
            color: '#DFBAE3'
        },
        {
            year: 'June 20, 2025',
            title: 'Governance Framework Formalized',
            description: 'The Memorandum and Articles of Association were registered, defining the organization\'s purpose, leadership structure, and membership standards.',
            color: '#9E4FDE'
        }
    ];

    const getCircleClasses = (color: string) => {
        switch (color) {
            case 'black':
                return 'bg-black';
            case '#DFBAE3':
                return 'bg-[#DFBAE3]';
            case '#9E4FDE':
                return 'bg-[#9E4FDE]';
            default:
                return 'bg-gray-500';
        }
    };

    const getCircleSize = (color: string) => {
        if (color === '#DFBAE3') return 'w-10 h-10 md:w-16 md:h-16'; // reduced big ball
        if (color === '#9E4FDE') return 'w-5 h-5 md:w-8 md:h-8';           // smaller purple ball
        return 'w-6 h-6 md:w-8 md:h-8';                                  // smaller default
    };

    return (
        <div className="w-full bg-white py-12 px-4 md:py-16 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Desktop View */}
                <div className="hidden md:block relative">
                    {/* Wavy Timeline Line using SVG */}
                    {/* Wavy Timeline Line using SVG */}
                    <div className="absolute top-16 left-0 right-0 h-20 overflow-visible">
                        <svg className="w-full h-20" preserveAspectRatio="none" viewBox="0 0 1200 80">
                            <defs>
                                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="black" />
                                    <stop offset="50%" stopColor="#a78bfa" /> {/* light purple */}
                                    <stop offset="100%" stopColor="#7e22ce" /> {/* deep purple */}
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0 40 Q 300 10, 600 40 T 1200 40"
                                stroke="url(#timelineGradient)"
                                strokeWidth="8"   
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* Timeline Events */}
                    <div className="grid grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <div key={index} className="relative flex flex-col items-center">
                                {/* Year */}
                                <div className="text-center mb-6">
                                    <h3
                                        className={`text-3xl font-bold text-purple-600 ${index === 0 ? 'translate-y-9' : ''
                                            } ${index === 1 ? 'translate-y-7' : ''} ${index === 2 ? 'translate-y-6' : ''
                                            }`}
                                    >
                                        {event.year}
                                    </h3>
                                </div>

                                {/* Circle */}
                                <div className="flex justify-center mb-8">
                                    <div
                                        className={`${getCircleClasses(event.color)} ${getCircleSize(
                                            event.color
                                        )} rounded-full ${index === 0 ? 'translate-y-9' : ''
                                            } ${index === 1 ? 'translate-y-[8px]' : ''} ${index === 2 ? 'translate-y-6' : ''
                                            }`}
                                    ></div>
                                </div>

                                {/* Content Card */}
                                <div className="text-center px-4 translate-y-4">
                                    <h4 className="text-lg font-bold text-purple-900 mb-3">{event.title}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden relative ml-4">
                   
                    <div className="absolute left-16 top-0 bottom-0 w-1 translate-x-[7px] bg-gray-300"></div>

                    {events.map((event, index) => (
                        <div key={index} className="relative mb-12 flex items-center">
                            {/* Left Side: Year */}
                            <div className="w-16 text-right pr-2 flex items-center justify-end">
                                <h3 className="text-lg font-bold text-purple-600">{event.year}</h3>
                            </div>

                            {/* Circle on the line */}
                            <div className="flex items-center">
                                <div
                                    className={`${getCircleClasses(event.color)} w-4 h-4 rounded-full`}
                                ></div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="flex-1 pl-4">
                                <h4 className="text-base font-bold text-purple-900 mb-2">
                                    {event.title}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;