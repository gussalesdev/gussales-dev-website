import fonts from '@/libs/ui/core/fonts';
import type { Metadata } from 'next';
import MainHeader from '@/common/components/main-header';
import '@/common/styles/globals.css';

export const metadata: Metadata = {
  title: 'Software Engineer | Javascript Specialist - Gus!',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`dark ${fonts.className} pt-14`}>
        <MainHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
