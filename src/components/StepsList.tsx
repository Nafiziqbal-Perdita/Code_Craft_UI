import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          Build Progress
        </h2>
        <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
          {steps.filter(s => s.status === 'completed').length}/{steps.length}
        </div>
      </div>
      
      <div className="space-y-3 overflow-auto max-h-full">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
                : 'bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/30'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            {/* Step connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-8 w-0.5 h-8 bg-gradient-to-b from-gray-600 to-transparent"></div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'completed' ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : step.status === 'in-progress' ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center">
                    <Circle className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-100 text-sm group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    step.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : step.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-600/20 text-gray-500'
                  }`}>
                    {step.status === 'completed' ? '✓' : step.status === 'in-progress' ? '⟳' : '○'}
                  </div>
                </div>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {steps.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">Waiting for build steps...</p>
          </div>
        )}
      </div>
    </div>
  );
}