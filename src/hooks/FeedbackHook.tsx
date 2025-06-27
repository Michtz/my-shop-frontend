'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type FeedbackVariant = 'error' | 'info' | 'success';

interface FeedbackContextType {
  isVisible: boolean;
  variant: FeedbackVariant;
  label: string;
  showFeedback: (label: string, variant: FeedbackVariant) => void;
  hideFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined,
);

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<FeedbackVariant>('success');
  const [label, setLabel] = useState('');

  const showFeedback = useCallback(
    (newLabel: string, newVariant: FeedbackVariant) => {
      setLabel(newLabel);
      setVariant(newVariant);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    },
    [],
  );

  const hideFeedback = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value = {
    isVisible,
    variant,
    label,
    showFeedback,
    hideFeedback,
  };

  return <FeedbackContext.Provider value={value} children={children} />;
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
