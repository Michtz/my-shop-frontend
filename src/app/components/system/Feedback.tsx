import React from 'react';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import { useFeedback } from '@/hooks/FeedbackHook';
import styles from '@/styles/system/Feedback.module.scss';

const Feedback: React.FC = React.memo(() => {
  const { isVisible, variant, label } = useFeedback();

  if (!isVisible) return null;

  return (
    <section className={styles.feedbackContainer} data-variant={variant}>
      <MaterialIcon icon={'check'} color={'white'} />
      <div className={styles.feedbackContent}>{label}</div>
    </section>
  );
});

Feedback.displayName = 'Feedback';

export default Feedback;
