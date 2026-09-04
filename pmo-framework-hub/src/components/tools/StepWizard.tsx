import React from 'react';

interface Step {
  id: string;
  title: string;
  required?: boolean;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function StepWizard({ steps, currentStep, onStepChange }: StepWizardProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 overflow-x-auto" aria-label="Progress">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep + 1;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepChange(index)}
              disabled={!isClickable}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : isCompleted
                  ? 'border-green-500 text-green-600 hover:text-green-700'
                  : isClickable
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-300 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center">
                <span className={`
                  flex-shrink-0 w-6 h-6 mr-2 flex items-center justify-center rounded-full text-xs
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span>
                  {step.title}
                  {step.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}