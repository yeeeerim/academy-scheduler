import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../static/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata = {
  title: '메인 ∙ 윈터스쿨',
  description: '거인의발자국 윈터스쿨',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/favicon/light.png',
        href: '/images/favicon/light.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/favicon/dark.png',
        href: '/images/favicon/dark.png',
      },
    ],
  },
  openGraph: {
    title: '메인 ∙ 윈터스쿨',
    description: '거인의발자국 윈터스쿨',
    url: 'https://giant-edu.com',
    type: 'website',
    images: [
      {
        url: '/images/logo/color_2.png',
        width: 1200,
        height: 630,
        alt: '거인의발자국 윈터스쿨',
      },
    ],
    locale: 'ko_KR',
    siteName: '거인의발자국 윈터스쿨',
  },
  verification: {
    google: '<meta name="google-site-verification" content="Cb4WlWqeG_CqyFx9EOibkcgMuHdLFXhWXNdDtDEMqQA" />',
    other: { 'naver-site-verification': '<meta name="naver-site-verification" content="f50bed7d59be840cb992246e0e0e5265bd05b1a3" />' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* <body className={`${pretendard.className} antialiased`}> */}
      <body>
        <Toaster position="bottom-center" />
        <Analytics />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
