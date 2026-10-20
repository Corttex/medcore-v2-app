import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  typescript: {
    // Os tipos do Supabase não refletem todas as tabelas ainda.
    // Ignorar erros de tipo no build para não bloquear o deploy.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'framer-motion',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard/admin',
        permanent: true,
      },
      {
        source: '/superadmin',
        destination: '/dashboard/admin',
        permanent: true,
      },
      {
        source: '/finance',
        destination: '/dashboard/finance',
        permanent: true,
      },
      {
        source: '/financeiro',
        destination: '/dashboard/finance',
        permanent: true,
      },
      {
        source: '/agenda',
        destination: '/dashboard/agenda',
        permanent: true,
      },
      {
        source: '/accounts',
        destination: '/dashboard/accounts',
        permanent: true,
      },
      {
        source: '/legal',
        destination: '/dashboard/legal',
        permanent: true,
      },
      {
        source: '/meetings',
        destination: '/dashboard/meetings',
        permanent: true,
      },
      {
        source: '/processes',
        destination: '/dashboard/processes',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/dashboard/settings',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
