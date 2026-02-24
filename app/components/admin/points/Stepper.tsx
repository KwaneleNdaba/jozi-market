'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep,
  onStepClick 
}) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = !!onStepClick; // Allow clicking any step

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200
                    ${isCompleted 
                      ? 'bg-[var(--jozi-forest)] text-white' 
                      : isCurrent 
                        ? 'bg-[var(--jozi-forest)] text-white ring-4 ring-green-100' 
                        : 'bg-gray-200 text-gray-500'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                <div className="mt-2 text-center">
                  <p className={`
                    text-sm font-medium
                    ${isCurrent ? 'text-[var(--jozi-forest)]' : isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2 -mt-12
                  ${index < currentStep ? 'bg-[var(--jozi-forest)]' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
