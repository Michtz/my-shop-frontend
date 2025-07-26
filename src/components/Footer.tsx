'use client';

import { FC } from 'react';
import Link from '@/components/system/Link';
import style from '@/styles/Footer.module.scss';
import { useTranslation } from 'react-i18next';

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerContent}>
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.navigation.customerService')}</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/service/contact">{t('footer.navigation.contact')}</Link>
              </li>
              <li>
                <Link href="/service/faq">{t('footer.navigation.faqHelp')}</Link>
              </li>
              <li>
                <Link href="/service/customer-service">{t('footer.navigation.customerSupport')}</Link>
              </li>
              <li>
                <Link href="/service/size-guide">{t('footer.navigation.sizeGuide')}</Link>
              </li>
            </ul>

            <div className={style.contactInfo}>
              <div className={style.contactItem}>
                <strong>{t('footer.contact.hotline')}:</strong> +49 (0) 123 456789
              </div>
              <div className={style.contactItem}>
                <strong>{t('footer.contact.hours')}:</strong> {t('footer.contact.schedule')}
              </div>
            </div>
          </div>

          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.legal.title')}</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/legal/terms">{t('footer.legal.terms')}</Link>
              </li>
              <li>
                <Link href="/legal/privacy">{t('footer.legal.privacy')}</Link>
              </li>
              <li>
                <Link href="/legal/imprint">{t('footer.legal.imprint')}</Link>
              </li>
              <li>
                <Link href="/legal/shipping">{t('footer.legal.shipping')}</Link>
              </li>
              <li>
                <Link href="/legal/returns">{t('footer.legal.returns')}</Link>
              </li>
            </ul>
          </div>

          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.company.title')}</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/about">{t('footer.company.aboutUs')}</Link>
              </li>
              <li>
                <Link href="#" external>
                  {t('footer.company.careers')}
                </Link>
              </li>
              <li>
                <Link href="#" external>
                  {t('footer.company.sustainability')}
                </Link>
              </li>
              <li>
                <Link href="#" external>
                  {t('footer.company.corporate')}
                </Link>
              </li>
            </ul>
          </div>

          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.social.title')}</h3>
            <div className={style.contactInfo}>
              <p>
                {t('footer.social.description')}
              </p>
            </div>

            <ul className={style.linkList}>
              <li>
                <Link href="#" external>
                  {t('footer.social.newsletter')}
                </Link>
              </li>
              <li>
                <Link href="#" external>
                  {t('footer.social.giftCards')}
                </Link>
              </li>
              <li>
                <Link href="#" external>
                  {t('footer.social.b2b')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={style.footerBottom}>
          <div className={style.paymentMethods}>
            <span className={style.paymentIcon}>VISA</span>
            <span className={style.paymentIcon}>MC</span>
            <span className={style.paymentIcon}>SOFORT</span>
            <span className={style.paymentIcon}>SEPA</span>
          </div>

          <div className={style.copyright}>
            <p>
              {t('footer.copyright.text', { year: 2024, companyName: 'MyShop GmbH' })} |
              <Link href="/legal/terms"> {t('footer.legal.terms')}</Link> |
              <Link href="/legal/privacy"> {t('footer.legal.privacy')}</Link> |
              <Link href="/legal/imprint"> {t('footer.legal.imprint')}</Link>
            </p>
            <p>
              {t('footer.copyright.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
