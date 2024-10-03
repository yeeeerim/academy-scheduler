import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "메인 ∙ 거인의발자국",
  description: "거인의발자국",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/favicon/light.png",
        href: "/images/favicon/light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/favicon/dark.png",
        href: "/images/favicon/dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-center" />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
