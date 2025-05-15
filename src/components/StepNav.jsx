export default function StepNav({ currentStep }) {
  const steps = ['session', 'deal', 'preflop', 'flop', 'turn', 'river'];

  return (
    <div className="w-full max-w-2xl flex justify-between mb-6 px-4">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 text-center py-2 text-sm font-semibold border-b-4 ${
            currentStep === step ? 'border-blue-600 text-blue-700' : 'border-gray-300 text-gray-500'
          }`}
        >
          {step.charAt(0).toUpperCase() + step.slice(1)}
        </div>
      ))}
    </div>
  );
}
