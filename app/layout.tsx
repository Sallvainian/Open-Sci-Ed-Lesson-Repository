import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Science Ed Lesson Repository',
  description: 'Science lesson planning and resource management',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
