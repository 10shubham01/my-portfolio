/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.shubhamgupta.dev',
  generateRobotsTxt: true, 
  sitemapSize: 7000, 
  changefreq: 'weekly',
  priority: 0.9,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.shubhamgupta.dev/server-sitemap.xml', // Add dynamic sitemaps if any
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/_next/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/*', '/_next/*'],
        crawlDelay: 1,
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for different pages
    let priority = config.priority;
    let changefreq = config.changefreq;
    
    if (path === '/') {
      priority = 1.0; // Highest priority for homepage
      changefreq = 'daily';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
