'use client';

import { FC } from 'react';
import Link from '@/components/system/Link';
import style from '@/styles/Footer.module.scss';

const Footer: FC = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerContent}>
          {/* Customer Service Column */}
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>Kundenservice</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/service/contact">Kontakt</Link>
              </li>
              <li>
                <Link href="/service/faq">FAQ / Hilfe</Link>
              </li>
              <li>
                <Link href="/service/customer-service">Kundendienst</Link>
              </li>
              <li>
                <Link href="/service/size-guide">Größenratgeber</Link>
              </li>
            </ul>
            
            <div className={style.contactInfo}>
              <div className={style.contactItem}>
                <strong>Hotline:</strong> +49 (0) 123 456789
              </div>
              <div className={style.contactItem}>
                <strong>Mo-Fr:</strong> 9:00 - 18:00 Uhr
              </div>
            </div>
          </div>

          {/* Legal Information Column */}
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>Rechtliches</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/legal/terms">AGB</Link>
              </li>
              <li>
                <Link href="/legal/privacy">Datenschutz</Link>
              </li>
              <li>
                <Link href="/legal/imprint">Impressum</Link>
              </li>
              <li>
                <Link href="/legal/shipping">Versandinformationen</Link>
              </li>
              <li>
                <Link href="/legal/returns">Rückgabe & Umtausch</Link>
              </li>
            </ul>
          </div>

          {/* Company Information Column */}
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>Über uns</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/about">Über MyShop</Link>
              </li>
              <li>
                <Link href="#" external>Karriere</Link>
              </li>
              <li>
                <Link href="#" external>Nachhaltigkeit</Link>
              </li>
              <li>
                <Link href="#" external>Unternehmen</Link>
              </li>
            </ul>

            <div className={style.socialLinks}>
              <Link href="#" external>📘</Link>
              <Link href="#" external>📷</Link>
              <Link href="#" external>🐦</Link>
              <Link href="#" external>📺</Link>
            </div>
          </div>

          {/* Newsletter & Extra Column */}
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>Newsletter</h3>
            <div className={style.contactInfo}>
              <p>Bleiben Sie auf dem Laufenden über neue Produkte und exklusive Angebote.</p>
              <div className={style.contactItem}>
                <strong>E-Mail:</strong> newsletter@myshop.de
              </div>
            </div>

            <ul className={style.linkList}>
              <li>
                <Link href="#" external>Newsletter anmelden</Link>
              </li>
              <li>
                <Link href="#" external>Geschenkgutscheine</Link>
              </li>
              <li>
                <Link href="#" external>B2B / Firmenkunden</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={style.footerBottom}>
          <div className={style.paymentMethods}>
            <span className={style.paymentIcon}>VISA</span>
            <span className={style.paymentIcon}>MC</span>
            <span className={style.paymentIcon}>PayPal</span>
            <span className={style.paymentIcon}>AMEX</span>
            <span className={style.paymentIcon}>SOFORT</span>
            <span className={style.paymentIcon}>SEPA</span>
          </div>
          
          <div className={style.copyright}>
            <p>
              © 2024 MyShop GmbH. Alle Rechte vorbehalten. | 
              <Link href="/legal/terms"> AGB</Link> | 
              <Link href="/legal/privacy"> Datenschutz</Link> | 
              <Link href="/legal/imprint"> Impressum</Link>
            </p>
            <p>
              Alle Preise inkl. gesetzl. MwSt. zzgl. Versandkosten und ggf. Nachnahmegebühren, wenn nicht anders beschrieben.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
