type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
};

function Input({ 
  label, 
  type = "text", 
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  name,
  required = false,
  disabled = false
}: InputProps) {
  // Generate a unique ID for the input
  const inputId = name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-3 text-sm sm:py-2 touch-manipulation
                   focus:outline-none focus:ring-2 focus:ring-purple-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   ${error ? 'border-red-500' : 'border-gray-300'}`}
        style={{ fontSize: '16px' }}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default Input;