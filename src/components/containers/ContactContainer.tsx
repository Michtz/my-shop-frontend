'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const ContactContainer: React.FC = () => {
  return (
    <Container
      flow="column"
      alignItems="center"
      justifyContent="flex-start"
      padding={true}
      maxWidth="1150"
      gap="2"
    >
      <div className={style.legalContainer}>
        <h1 className={style.title}>
          Kontakt
        </h1>
        
        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kontaktinformationen</h2>
            <p className={style.paragraph}>
              Haben Sie Fragen zu unserem Sortiment, zu Ihrer Bestellung oder benötigen Sie Hilfe? Wir sind gerne für Sie da und helfen Ihnen weiter.
            </p>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Adresse</h3>
              <p className={style.paragraph}>
                <strong>MyShop GmbH</strong><br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Telefon & E-Mail</h3>
              <p className={style.paragraph}>
                <strong>Kundenservice:</strong> +49 (0) 123 456789<br />
                <strong>E-Mail:</strong> service@myshop.de<br />
                <strong>Bestellfragen:</strong> orders@myshop.de<br />
                <strong>Rückgaben:</strong> returns@myshop.de
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Öffnungszeiten</h2>
            <ul className={style.list}>
              <li><strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr</li>
              <li><strong>Samstag:</strong> 10:00 - 16:00 Uhr</li>
              <li><strong>Sonntag:</strong> Geschlossen</li>
            </ul>
            <p className={style.paragraph}>
              <em>An gesetzlichen Feiertagen ist unser Kundenservice geschlossen.</em>
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kontaktformular</h2>
            <p className={style.paragraph}>
              Nutzen Sie unser Kontaktformular für allgemeine Anfragen. Wir antworten Ihnen in der Regel innerhalb von 24 Stunden.
            </p>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '2rem', 
              backgroundColor: '#f9f9f9',
              marginTop: '1rem'
            }}>
              <h3 className={style.sectionTitle}>Schnellkontakt</h3>
              <p className={style.paragraph}>
                <strong>Für dringende Anfragen:</strong><br />
                Rufen Sie uns direkt an: +49 (0) 123 456789
              </p>
              <p className={style.paragraph}>
                <strong>Live-Chat:</strong><br />
                Montag - Freitag von 9:00 - 17:00 Uhr verfügbar
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Häufige Themen</h2>
            <ul className={style.list}>
              <li><strong>Bestellstatus:</strong> Loggen Sie sich in Ihr Kundenkonto ein oder kontaktieren Sie uns mit Ihrer Bestellnummer</li>
              <li><strong>Rückgaben:</strong> Besuchen Sie unsere Rückgabe-Seite oder kontaktieren Sie returns@myshop.de</li>
              <li><strong>Produktberatung:</strong> Unser Team berät Sie gerne telefonisch oder per E-Mail</li>
              <li><strong>Größenberatung:</strong> Nutzen Sie unseren Größenratgeber oder lassen Sie sich beraten</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Social Media</h2>
            <p className={style.paragraph}>
              Folgen Sie uns auf unseren Social Media Kanälen für die neuesten Updates, Angebote und Produktneuheiten:
            </p>
            <ul className={style.list}>
              <li>Facebook: @MyShopOfficial</li>
              <li>Instagram: @myshop_store</li>
              <li>Twitter: @MyShop</li>
              <li>YouTube: MyShop Channel</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactContainer;