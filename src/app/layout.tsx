import type { Metadata } from "next";
import { Inter, Mrs_Saint_Delafield } from "next/font/google";
import { BackgroundProvider } from "@/components/background-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const bootScript = `(function(){try{if(location.pathname!=="/")return;var d=document.documentElement;if(!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches)return;var m=window.CSS&&CSS.supports&&(CSS.supports("mask-image","linear-gradient(#000,#000)")||CSS.supports("-webkit-mask-image","linear-gradient(#000,#000)"));d.classList.add(m?"rh-anim":"rh-anim-fade");if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){d.classList.add("rh-begin")},function(){d.classList.add("rh-begin")})}else{d.classList.add("rh-begin")}}catch(e){}})()`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <BackgroundProvider>
          <AuthProvider>{children}</AuthProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
