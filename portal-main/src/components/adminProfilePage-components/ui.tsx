

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  placeholder, 
  type = "text", 
  value, 
  onChange, 
  disabled = false 
}) => (
  <div className="relative border border-gray-200 rounded-lg p-3 bg-gray-50/50 mt-4">
    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed" 
    />
  </div>
);

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  onClick, 
  disabled = false, 
  type = 'button' 
}) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="bg-[#5C32A3] hover:bg-[#4A2882] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {text} <span>→</span>
  </button>
);