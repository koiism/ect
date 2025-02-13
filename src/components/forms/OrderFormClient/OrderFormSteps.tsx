import React from 'react'
import { cn } from '@/utilities/cn'
import { CheckCircle2 } from 'lucide-react'
import type { FormStep } from './constants'

interface OrderFormStepsProps {
  currentStep: number
  steps: readonly FormStep[]
}

export const OrderFormSteps: React.FC<OrderFormStepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="md:mb-8 mb-4">
      <div className="hidden sm:flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
          >
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep > index
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === index
                    ? 'bg-gradient-to-r from-gradient-start to-gradient-end text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {currentStep > index ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className="mt-2 text-sm font-medium text-center w-24 truncate">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-full',
                  currentStep > index ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="sm:hidden">
        <p className="text-sm font-medium">
          Step {currentStep + 1} / {steps.length}: {steps[currentStep].title}
        </p>
      </div>
    </div>
  )
}
