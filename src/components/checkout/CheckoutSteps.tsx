// src/components/checkout/CheckoutSteps.tsx
import { CheckIcon } from "@heroicons/react/24/solid";
import type { CheckoutStep } from "../../pages/checkout/Page";
 
interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: "shipping", name: "Shipping", href: "#" },
  { id: "payment", name: "Payment", href: "#" },
  { id: "review", name: "Review", href: "#" },
  { id: "confirmation", name: "Confirmation", href: "#" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <li key={step.name} className="flex-1 md:flex-initial">
            {index < currentStepIndex ? (
              // Completed step
              <div className="group flex items-center">
                <span className="flex items-center px-2 py-2 text-sm font-medium">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-800">
                    <CheckIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-900 hidden md:block">
                    {step.name}
                  </span>
                </span>
              </div>
            ) : index === currentStepIndex ? (
              // Current step
              <div className="flex items-center" aria-current="step">
                <span className="flex items-center px-2 py-2 text-sm font-medium">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                    <span className="text-blue-600">{index + 1}</span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-blue-600 hidden md:block">
                    {step.name}
                  </span>
                </span>
              </div>
            ) : (
              // Future step
              <div className="group flex items-center">
                <span className="flex items-center px-2 py-2 text-sm font-medium">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span className="text-gray-500">{index + 1}</span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-500 hidden md:block">
                    {step.name}
                  </span>
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
