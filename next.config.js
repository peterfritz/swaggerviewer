/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => ([
    {
      source: '/deploy',
      destination: 'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpeterfritz%2Fswaggerviewer&demo-title=Swagger%20Viewer&demo-url=https%3A%2F%2Fswaggerviewer.ptr.red%2F',
      permanent: true,
    },
  ]),
};

module.exports = nextConfig;
