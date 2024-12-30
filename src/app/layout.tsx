'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <ThemeRegistry>
          <SWRProvider>{children}</SWRProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
