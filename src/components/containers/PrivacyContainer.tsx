'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const PrivacyContainer: React.FC = () => {
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
          Datenschutzerklärung
        </h1>
        
        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>1. Datenschutz auf einen Blick</h2>
            <p className={style.paragraph}>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>2. Datenerfassung auf unserer Website</h2>
            <h3 className={style.sectionTitle}>Wer ist verantwortlich für die Datenerfassung?</h3>
            <p className={style.paragraph}>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            
            <h3 className={style.sectionTitle}>Wie erfassen wir Ihre Daten?</h3>
            <p className={style.paragraph}>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben oder bei einer Bestellung angeben.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className={style.sectionTitle}>Datenschutz</h3>
            <p className={style.paragraph}>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>4. Datenerfassung auf unserer Website</h2>
            <h3 className={style.sectionTitle}>Cookies</h3>
            <p className={style.paragraph}>
              Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>5. Ihre Rechte</h2>
            <p className={style.paragraph}>
              Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.
            </p>
            <ul className={style.list}>
              <li>Recht auf Auskunft</li>
              <li>Recht auf Berichtigung</li>
              <li>Recht auf Löschung</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Widerspruchsrecht</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>6. Kontakt</h2>
            <p className={style.paragraph}>
              Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt an die für den Datenschutz verantwortliche Person in unserer Organisation.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyContainer;