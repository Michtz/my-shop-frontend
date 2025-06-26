import useCart from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/system/Container';
import Button, { ButtonContainer } from '@/components/system/Button';
import { FC } from 'react';

const EmptyCart: FC = () => {
  const { error } = useCart();
  const router = useRouter();
  if (error)
    return (
      <Container flow={'column'}>
        <h1>Dein Warenkorb ist noch leer</h1>
        <ButtonContainer>
          <Button onClick={() => router.replace('/')}>Weiter stöbern</Button>
        </ButtonContainer>
      </Container>
    );
};
export default EmptyCart;
