'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const SizeGuideContainer: React.FC = () => {
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
          Größenratgeber
        </h1>
        
        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Die richtige Größe finden</h2>
            <p className={style.paragraph}>
              Die Wahl der richtigen Größe ist entscheidend für Ihren Tragekomfort. Unser Größenratgeber hilft Ihnen dabei, die perfekte Passform zu finden. Bitte beachten Sie, dass Größen je nach Hersteller und Produktkategorie variieren können.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>So messen Sie richtig</h2>
            <p className={style.paragraph}>
              <strong>Wichtige Tipps für genaue Messungen:</strong>
            </p>
            <ul className={style.list}>
              <li>Messen Sie am besten in Unterwäsche</li>
              <li>Verwenden Sie ein flexibles Maßband</li>
              <li>Messen Sie nicht zu locker und nicht zu fest</li>
              <li>Lassen Sie sich von einer zweiten Person helfen</li>
              <li>Messen Sie abends, da der Körper über den Tag anschwillt</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Oberbekleidung - Damen</h2>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem'
            }}>
              <h3 className={style.sectionTitle}>Messpunkte</h3>
              <ul className={style.list}>
                <li><strong>Brustumfang:</strong> Unter den Armen, an der stärksten Stelle der Brust</li>
                <li><strong>Taillenumfang:</strong> An der schmalsten Stelle der Taille</li>
                <li><strong>Hüftumfang:</strong> An der stärksten Stelle der Hüfte</li>
              </ul>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Größe</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brustumfang (cm)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Taillenumfang (cm)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hüftumfang (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>XS</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>82-86</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>62-66</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>86-90</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>S</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>86-90</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>66-70</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>90-94</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>M</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>90-94</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>70-74</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>94-98</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>L</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>94-98</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>74-78</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>98-102</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>XL</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>98-102</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>78-82</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>102-106</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Oberbekleidung - Herren</h2>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem'
            }}>
              <h3 className={style.sectionTitle}>Messpunkte</h3>
              <ul className={style.list}>
                <li><strong>Brustumfang:</strong> Unter den Armen, an der stärksten Stelle der Brust</li>
                <li><strong>Taillenumfang:</strong> In Höhe des Bauchnabels</li>
                <li><strong>Halsumfang:</strong> Am Halsansatz (für Hemden)</li>
              </ul>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Größe</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brustumfang (cm)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Taillenumfang (cm)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Halsumfang (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>S</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>88-92</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>76-80</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>37-38</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>M</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>92-96</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>80-84</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>39-40</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>L</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>96-100</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>84-88</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>41-42</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>XL</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>100-104</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>88-92</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>43-44</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>XXL</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>104-108</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>92-96</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>45-46</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Schuhgrößen</h2>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              backgroundColor: '#f9f9f9',
              marginBottom: '1rem'
            }}>
              <h3 className={style.sectionTitle}>Fußlänge messen</h3>
              <p className={style.paragraph}>
                Stellen Sie sich barfuß auf ein Blatt Papier und zeichnen Sie Ihren Fuß nach. Messen Sie die Länge vom längsten Zeh bis zur Ferse.
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>EU-Größe</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fußlänge (cm)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>UK-Größe</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>US-Größe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>37</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>23.0</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>4</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>6</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>38</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>23.5</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>5</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>7</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>39</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>24.0</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>6</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>8</td>
                </tr>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>40</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>24.5</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>7</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>9</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>41</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>25.0</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>8</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>10</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Passform-Tipps</h2>
            
            <div className={style.section}>
              <h3 className={style.sectionTitle}>🔍 Bei Unsicherheit</h3>
              <ul className={style.list}>
                <li>Wählen Sie im Zweifel die größere Größe</li>
                <li>Beachten Sie die Produktbeschreibung (fällt größer/kleiner aus)</li>
                <li>Lesen Sie Kundenbewertungen zur Passform</li>
                <li>Nutzen Sie unser 14-tägiges Rückgaberecht</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>📞 Persönliche Beratung</h3>
              <p className={style.paragraph}>
                Unser Kundenservice berät Sie gerne bei der Größenwahl:
              </p>
              <ul className={style.list}>
                <li><strong>Telefon:</strong> +49 (0) 123 456789</li>
                <li><strong>E-Mail:</strong> service@myshop.de</li>
                <li><strong>Live-Chat:</strong> Mo-Fr 9:00-17:00 Uhr</li>
              </ul>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Internationale Größen</h2>
            <p className={style.paragraph}>
              Bitte beachten Sie, dass sich Größenangaben zwischen verschiedenen Ländern unterscheiden können. Orientieren Sie sich daher immer an den Zentimeter-Angaben in unseren Größentabellen.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SizeGuideContainer;