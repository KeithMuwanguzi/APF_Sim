type PaymentOptionProps = {
  label: string;
  value: string;
  logo : string;
  selected: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

function PaymentOption({
  label,
  value,
  logo,
  selected,
  onSelect,
  disabled = false,
}: PaymentOptionProps) {
  const isActive = selected === value;

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      className={`border rounded-lg p-4 text-sm text-center transition min-h-[44px] touch-manipulation
        ${
          disabled
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
            : isActive
            ? "border-purple-600 bg-purple-50 text-purple-700"
            : "border-gray-200 hover:border-purple-400 active:border-purple-500"
        }`}
    >
        <div className="flex justify-center mb-2">
        <img
        src={logo}
        alt={label}
        className={`h-12 object-contain ${disabled ? 'opacity-50' : ''}`}
      />
    </div>
      {label}
    </button>
  );
}
export default PaymentOption;