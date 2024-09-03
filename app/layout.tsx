import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'jotai';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MagiClaw",
  description: "Next Gen Universal Action Embodiment Interface",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
