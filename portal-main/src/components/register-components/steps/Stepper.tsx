function Stepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="w-full overflow-x-auto mb-10">
      <div className="flex items-center justify-center gap-4 sm:gap-6 whitespace-nowrap px-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 shrink-0">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                index === currentStep
                  ? "bg-purple-600 text-white"
                  : "bg-purple-200 text-purple-700"
              }`}
            >
              {step}
            </span>
            {index !== steps.length - 1 && (
              <div className="w-10 h-px bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;