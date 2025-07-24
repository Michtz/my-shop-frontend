'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const FAQContainer: React.FC = () => {
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
          Häufig gestellte Fragen (FAQ)
        </h1>
        
        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Bestellung & Bezahlung</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie kann ich eine Bestellung aufgeben?</h3>
              <p className={style.paragraph}>
                Wählen Sie die gewünschten Produkte aus, legen Sie sie in den Warenkorb und folgen Sie den Schritten zur Kasse. Sie benötigen ein Kundenkonto, um eine Bestellung abzuschließen.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Welche Zahlungsmethoden werden akzeptiert?</h3>
              <p className={style.paragraph}>
                Wir akzeptieren folgende Zahlungsmethoden:
              </p>
              <ul className={style.list}>
                <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Sofortüberweisung</li>
                <li>Banküberweisung (Vorkasse)</li>
                <li>Rechnung (für Stammkunden)</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Kann ich meine Bestellung ändern oder stornieren?</h3>
              <p className={style.paragraph}>
                Bestellungen können nur vor dem Versand geändert oder storniert werden. Kontaktieren Sie uns so schnell wie möglich unter +49 (0) 123 456789 oder service@myshop.de.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Versand & Lieferung</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie lange dauert die Lieferung?</h3>
              <p className={style.paragraph}>
                Die Standardlieferzeit beträgt 3-5 Werktage innerhalb Deutschlands. Expressversand ist innerhalb von 1-2 Werktagen möglich.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie hoch sind die Versandkosten?</h3>
              <p className={style.paragraph}>
                Der Versand innerhalb Deutschlands kostet 4,95 EUR. Ab einem Bestellwert von 50 EUR ist der Versand kostenlos.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Kann ich den Status meiner Bestellung verfolgen?</h3>
              <p className={style.paragraph}>
                Ja, nach dem Versand erhalten Sie eine E-Mail mit der Sendungsnummer. Mit dieser können Sie Ihre Sendung online verfolgen.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Rückgabe & Umtausch</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Kann ich Artikel zurückgeben?</h3>
              <p className={style.paragraph}>
                Ja, Sie haben 14 Tage Widerrufsrecht ab Erhalt der Ware. Die Artikel müssen sich im ursprünglichen Zustand befinden.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wer trägt die Kosten für die Rücksendung?</h3>
              <p className={style.paragraph}>
                Die Rücksendekosten trägt grundsätzlich der Kunde, außer bei mangelhafter Ware oder wenn wir einen Fehler gemacht haben.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie lange dauert die Erstattung?</h3>
              <p className={style.paragraph}>
                Nach Erhalt und Prüfung der Rücksendung erstatten wir den Betrag innerhalb von 14 Tagen über die ursprüngliche Zahlungsmethode.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kundenkonto & Service</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Muss ich ein Kundenkonto erstellen?</h3>
              <p className={style.paragraph}>
                Ja, für eine Bestellung benötigen Sie ein Kundenkonto. Dies ermöglicht es Ihnen, Ihre Bestellungen zu verwalten und von exklusiven Angeboten zu profitieren.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie kann ich mein Passwort zurücksetzen?</h3>
              <p className={style.paragraph}>
                Klicken Sie auf der Anmeldeseite auf "Passwort vergessen" und geben Sie Ihre E-Mail-Adresse ein. Sie erhalten dann eine E-Mail mit Anweisungen.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie kann ich den Newsletter abbestellen?</h3>
              <p className={style.paragraph}>
                Sie können sich jederzeit über den Abmelde-Link in jeder Newsletter-E-Mail oder in Ihrem Kundenkonto abmelden.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Produkte & Größen</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wie finde ich die richtige Größe?</h3>
              <p className={style.paragraph}>
                Nutzen Sie unseren detaillierten Größenratgeber, der bei jedem Produkt verfügbar ist. Bei Fragen beraten wir Sie gerne persönlich.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Sind die Produktbilder farbecht?</h3>
              <p className={style.paragraph}>
                Wir bemühen uns um eine möglichst realistische Darstellung. Aufgrund unterschiedlicher Bildschirmeinstellungen können leichte Farbabweichungen auftreten.
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Wann sind ausverkaufte Artikel wieder verfügbar?</h3>
              <p className={style.paragraph}>
                Die Verfügbarkeit variiert je nach Artikel. Nutzen Sie die "Benachrichtigen"-Funktion, um informiert zu werden, sobald der Artikel wieder verfügbar ist.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Weitere Fragen?</h2>
            <p className={style.paragraph}>
              Haben Sie eine Frage, die hier nicht beantwortet wurde? Kontaktieren Sie uns gerne:
            </p>
            <ul className={style.list}>
              <li><strong>Telefon:</strong> +49 (0) 123 456789</li>
              <li><strong>E-Mail:</strong> service@myshop.de</li>
              <li><strong>Live-Chat:</strong> Montag - Freitag, 9:00 - 17:00 Uhr</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FAQContainer;