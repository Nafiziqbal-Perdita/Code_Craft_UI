import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="p-4 h-full font-secondary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutrals-charcoal flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-blue rounded-full animate-pulse shadow-floating"></div>
          Build Progress
        </h2>
        <div className="text-xs text-white bg-gradient-to-r from-primary-blue to-secondary-aqua px-3 py-1 rounded-full shadow-floating">
          {steps.filter(s => s.status === 'completed').length}/{steps.length}
        </div>
      </div>
      <div className="space-y-4 overflow-auto max-h-full">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-slow font-secondary ${
              currentStep === step.id
                ? 'bg-gradient-to-r from-primary-blue/20 to-accent-pink/20 border-2 border-primary-blue/40 shadow-clay scale-105'
                : 'bg-white/80 hover:bg-primary-blue/10 border border-neutrals-mediumGray/40 shadow-floating'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            {/* Step connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-10 w-0.5 h-8 bg-gradient-to-b from-primary-blue/40 to-transparent"></div>
            )}
            <div className="flex items-start gap-3">
              {/* Add step icon or status indicator here if needed */}
              <div className={`w-4 h-4 rounded-full mt-1 ${
                step.status === 'completed' ? 'bg-accent-green' : step.status === 'in-progress' ? 'bg-accent-yellow animate-pulse' : 'bg-neutrals-darkGray'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-neutrals-charcoal text-base truncate">{step.title}</div>
                {step.description && (
                  <div className="text-xs text-neutrals-darkGray mt-1">{step.description}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {steps.length === 0 && (
          <div className="text-center py-8 text-neutrals-darkGray">
            No steps yet.
          </div>
        )}
      </div>
    </div>
  );
}