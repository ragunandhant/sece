import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/Components/Footer";
import { Suspense } from 'react';
import { Poppins } from "next/font/google";
import Script from 'next/script';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "sece.live",
  description: "An open-source platform for sharing your thoughts and ideas in a anonymous way",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`w-screen h-screen p-3 flex flex-col ${poppins.className}`}>
        <Toaster />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="01e3c181-d450-4e08-9f7a-c8f4883cc076"></Script>
        <Script id="microsoft-clarity-analytics">
          {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "nre6oinp7h");
          `}
        </Script>
        <Suspense fallback={<div>Loading...</div>}>
        <section className="flex-grow flex flex-col xl:mx-56 md:mx-24 sm:mx-8 mx-1">
          {children}
        </section>
        <section className="flex  justify-center  ">
          <Footer />
        </section>
        </Suspense>
      </body>
    </html>
  );
}
