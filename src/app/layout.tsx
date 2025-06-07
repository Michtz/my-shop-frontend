'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <SWRProvider>{children}</SWRProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
