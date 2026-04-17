import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata = {
  title: "SSINSTRUMENTS",
  description: "SSInstruments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
