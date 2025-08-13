import { type Metadata } from "next";
import { Geist, Titillium_Web, Bungee_Shade } from "next/font/google";
import { Providers } from "../components/providers";
import NextTopLoader from "nextjs-toploader";
import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-titillium",
});

const bungeeShade = Bungee_Shade({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FarMix - Ricerca Farmaci AIFA",
  description:
    "Ricerca farmaci dalle Liste di Trasparenza AIFA con storico prezzi e monitoraggio preferiti",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${geist.variable} ${titillium.variable} ${bungeeShade.variable}`}>
      <body className="font-titillium">
        <Providers>
          <NextTopLoader showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
