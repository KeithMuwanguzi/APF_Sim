export const Input = ({ label, placeholder, type = "text" }: { label: string, placeholder?: string, type?: string }) => (
    <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50/50">
      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300" 
      />
    </div>
  );
  
  export const ActionButton = ({ text }: { text: string }) => (
    <button className="bg-[#5C32A3] hover:bg-[#4A2882] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
      {text} <span className="text-lg">→</span>
    </button>
  );