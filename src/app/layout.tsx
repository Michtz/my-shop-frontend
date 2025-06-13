'use client';
import ThemeRegistry from '@/providers/ThemeRegistry';
import SWRProvider from '@/providers/SWRProvider';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/hooks/TranslationHook';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <TranslationProvider>
            <FeedbackProvider>
              <SWRProvider>{children}</SWRProvider>
            </FeedbackProvider>
          </TranslationProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
