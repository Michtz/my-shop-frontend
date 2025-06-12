import { CSSProperties, FC } from 'react';
import { Container } from '@/components/system/Container';

interface ProductCardProps {}
const Footer = ({}) => {
  const footerStyle: CSSProperties = {
    textAlign: 'center',
    height: 164,
    paddingInline: 48,
    lineHeight: '64px',

    bottom: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  return (
    <section style={footerStyle}>
      this will be the footer at some time soooooon :D
    </section>
  );
};
export default Footer;
