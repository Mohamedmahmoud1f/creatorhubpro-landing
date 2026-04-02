import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorHubPro | حوّل محتواك إلى آلة تجذب العملاء",
  description: "مش مجرد مونتاج فيديو… نظام متكامل يساعدك تنشر محتوى احترافي وتحوّل المشاهدين إلى عملاء",
  keywords: ["مونتاج فيديو", "تعديل فيديو", "صانع محتوى", "نمو محتوى"],
  openGraph: {
    title: "CreatorHubPro | حوّل محتواك إلى آلة تجذب العملاء",
    description: "نظام متكامل يجمع بين المونتاج الاحترافي والتوجيه الاستراتيجي",
    type: "website",
  },
  icons: { icon: "/brand/2-transparent.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

        {/* FontAwesome */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" />

        {/* Local Styles */}
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>

        {/* Meta Pixel (Facebook) */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1713073476328013');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Noscript fallback for Meta Pixel */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1713073476328013&ev=PageView&noscript=1"
          />
        </noscript>
        {children}

        {/* Microsoft Clarity Tracking */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vnj9kl6scb");`}
        </Script>
      </body>
    </html>
  );
}