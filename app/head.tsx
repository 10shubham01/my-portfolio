

export default function Head() {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>Shubham Gupta - Frontend Developer | Web Developer | Full Stack Developer | React Expert</title>
      <meta name="title" content="Shubham Gupta - Frontend Developer | Web Developer | Full Stack Developer | React Expert" />
      <meta name="description" content="Shubham Gupta is a Senior Software Engineer and expert Frontend Developer specializing in React, Next.js, Vue.js, and TypeScript. Professional web developer with 4+ years experience building modern web applications." />
      <meta name="keywords" content="Shubham Gupta, Frontend Developer, Web Developer, Full Stack Developer, React Developer, Next.js Developer, Vue.js Developer, TypeScript Developer, JavaScript Developer, Software Engineer, Web Development, Frontend Development, Hire Developer, India" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Shubham Gupta" />
      <meta name="copyright" content="Shubham Gupta" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="theme-color" content="#000000" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.shubhamgupta.dev/" />
      <meta property="og:title" content="Shubham Gupta - Expert Frontend Developer & Full Stack Engineer" />
      <meta property="og:description" content="Professional Frontend Developer with expertise in React, Next.js, Vue.js, and TypeScript. 4+ years building modern web applications. Available for hire." />
      <meta property="og:image" content="https://www.shubhamgupta.dev/images/profile.jpeg" />
      <meta property="og:site_name" content="Shubham Gupta Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.shubhamgupta.dev/" />
      <meta property="twitter:title" content="Shubham Gupta - Frontend Developer | Web Developer | Full Stack Engineer" />
      <meta property="twitter:description" content="Expert Frontend Developer specializing in React, Next.js, Vue.js, and TypeScript. Building modern web applications with 4+ years experience." />
      <meta property="twitter:image" content="https://www.shubhamgupta.dev/images/profile.jpeg" />
      <meta property="twitter:creator" content="@shubhamgupta" />
      <meta property="twitter:site" content="@shubhamgupta" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Shubham Gupta Portfolio" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://www.shubhamgupta.dev/" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="https://github.com" />
      <link rel="dns-prefetch" href="https://www.linkedin.com" />
      <link rel="dns-prefetch" href="https://peerlist.io" />
      
      {/* Additional Meta for Search Engines */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      
      {/* Business/Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Shubham Gupta Web Development Services",
            "description": "Professional web development services including frontend development, React development, and full-stack solutions",
            "url": "https://www.shubhamgupta.dev",
            "logo": "https://www.shubhamgupta.dev/images/profile.jpeg",
            "image": "https://www.shubhamgupta.dev/images/profile.jpeg",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "India"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "shubhamedu.01@gmail.com",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://github.com/10shubham01",
              "https://www.linkedin.com/in/shubhamgupta001/"
            ],
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 20.5937,
                "longitude": 78.9629
              },
              "geoRadius": "5000"
            },
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Web Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Frontend Development",
                    "description": "React, Next.js, Vue.js development services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Full Stack Development",
                    "description": "Complete web application development"
                  }
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
