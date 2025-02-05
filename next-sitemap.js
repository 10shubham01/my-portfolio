/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.shubhamgupta.dev',
  generateRobotsTxt: true, 
  sitemapSize: 7000, 
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.shubhamgupta.dev/server-sitemap.xml', // Add dynamic sitemaps if any
    ],
  },
};
