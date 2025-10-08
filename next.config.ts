// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // <--- This is necessary for Capacitor
    images: {
        unoptimized: true, // Recommended for static/Capacitor builds
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hvozenqnulekdgxpphfb.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default nextConfig;