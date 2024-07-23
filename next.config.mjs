/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            // {
            //     source: '/authentication',
            //     has: [
            //         {
            //             type: 'cookie',
            //             key: 'accessToken',
            //         },
            //         {
            //             type: 'cookie',
            //             key: 'refreshToken',
            //         },
            //     ],
            //     permanent: false,
            //     destination: '/dashboard',
            // },
            {
                source: '/((?!api|_next/static|_next/image|favicon.ico|authentication|register|assets).*)',
                missing: [
                    {
                        type: 'cookie',
                        key: 'accessToken',
                    },
                ],
                permanent: false,
                destination: '/authentication',
            }
        ];
    }
};

export default nextConfig;