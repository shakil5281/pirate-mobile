import React from "react"
import { Check } from "lucide-react"

const CheckoutProgress = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Choose Plan" },
    { number: 2, label: "Confirm & Pay" },
    { number: 3, label: "Activate & Use" }
  ]

  const getStatusFor = (stepNumber) => {
    if (currentStep > stepNumber) return "completed"
    if (currentStep === stepNumber) return "current"
    return "upcoming"
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center">
        <div className="relative flex items-center w-full max-w-2xl">
          {steps.map((step, index) => {
            const status = getStatusFor(step.number)
            const isCompleted = status === "completed"
            const isCurrent = status === "current"
            const isUpcoming = status === "upcoming"
            const isStep1Complete = currentStep > 1

            // Circle styling based on status
            let circleClasses = "relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200"
            if (isCompleted) {
              circleClasses += " bg-green-500 text-white"
            } else if (isCurrent) {
              circleClasses += " bg-green-100 border-2 border-green-500 text-green-700"
            } else {
              circleClasses += " bg-white border-2 border-gray-500 text-gray-700"
            }

            // Determine connector line gradient colors
            // Line between step 1 and 2: green gradient (matches step 2's green border)
            // Line between step 2 and 3: green gradient if step 1 is complete, otherwise gray gradient (matches step 3's border)
            const getConnectorGradient = (lineIndex) => {
              if (lineIndex === 0) {
                // Line between step 1 and 2: always green gradient (matches step 2 border)
                return "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
              } else if (lineIndex === 1) {
                // Line between step 2 and 3: green gradient if step 1 is complete, otherwise gray gradient (matches step 3 border)
                return isStep1Complete 
                  ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                  : "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500"
              }
              return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500"
            }

            return (
              <React.Fragment key={step.number}>
                {/* Step circle and label */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div className={circleClasses}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted || isCurrent
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>

                {/* Connector line after step (except last) - absolutely positioned and centered */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute h-1"
                    style={{
                      left: `${((index + 0.5) * 100) / steps.length}%`,
                      width: `${100 / steps.length - 0}%`,
                      top: '24px',
                      transform: 'translate(0%, 0%)'
                    }}
                    aria-hidden="true"
                  >
                    <div className={`h-full w-full ${getConnectorGradient(index)}`} />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CheckoutProgress
