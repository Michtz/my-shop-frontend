import React from 'react';
import style from '@/styles/checkout/CheckoutStepNavigation.module.scss';
import { useCheckout } from '@/providers/checkout/CheckoutContextProvider';

const CheckoutStepNavigation: React.FC = () => {
  const { currentStep, goToStep } = useCheckout();

  const steps = [
    {
      number: 1,
      title: 'ADRESSEN',
      active: currentStep === 1,
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: 'ZAHLUNG',
      active: currentStep === 2,
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: 'BESTELLUNG',
      active: currentStep === 3,
      completed: false,
    },
  ];

  return (
    <div className={style.stepNavigation}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={style.stepItem}
            data-active={step.active}
            data-completed={step.completed}
            onClick={() => goToStep(step.number)}
          >
            <div className={style.stepNumber}>
              {step.completed ? '✓' : step.number}
            </div>
            <span className={style.stepTitle}>{step.title}</span>
          </div>

          {index < steps.length - 1 && <div className={style.stepDivider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutStepNavigation;
