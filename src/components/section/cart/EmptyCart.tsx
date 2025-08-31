import { useRouter } from 'next/navigation';
import { Container, Title } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const EmptyCart: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Container flow={'column'}>
      <Title>{t('cart.emptyTitle')}</Title>
      <ButtonContainer>
        <Button onClick={() => router.replace('/')}>
          {t('cart.continueShopping')}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default EmptyCart;
