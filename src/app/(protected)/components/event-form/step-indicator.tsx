import { memo } from "react";

import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  currentStep: number;
  steps: readonly string[];
};

export const StepIndicator = memo(
  ({ currentStep, steps }: StepIndicatorProps) => {
    return (
      <div className="flex justify-between items-center flex-wrap gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={cn(
                "size-8 mx-auto rounded-full flex items-center justify-center border-2 border-primary",
                i <= currentStep && "bg-primary text-white border-primary"
              )}
            >
              {i + 1}
            </div>
            <div
              className={cn(
                "mt-2",
                i <= currentStep ? "text-primary" : "text-foreground"
              )}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

StepIndicator.displayName = "StepIndicator";
