import type { Metadata } from "next";
import { Inter, Mrs_Saint_Delafield } from "next/font/google";
import { BackgroundProvider } from "@/components/background-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mrsSaintDelafield = Mrs_Saint_Delafield({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rabbit Hole",
  description:
    "The dating app whose core currency is verified real-world dates, not swipes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mrsSaintDelafield.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundProvider>{children}</BackgroundProvider>
      </body>
    </html>
  );
}
