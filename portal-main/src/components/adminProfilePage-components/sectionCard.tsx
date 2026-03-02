import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  buttonText?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, children, buttonText }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
      <div className="border-l-4 border-purple-700 pl-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      
      {children}

      {buttonText && (
        <button className="mt-8 bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
          {buttonText}
          <span>→</span>
        </button>
      )}
    </div>
  );
};

export default SectionCard;