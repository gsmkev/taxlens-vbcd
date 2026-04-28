import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Enable WASM support for Orama/Transformers.js
  },
  webpack: (config, { isServer }) => {
    // Enable WASM
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Exclude heavy AI libs from server bundle
    if (isServer) {
      config.externals = [...(config.externals || []), 'onnxruntime-node'];
    }

    return config;
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        // Allow SharedArrayBuffer for WebGPU/WASM threading
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        // Strict CSP — allows WebAssembly and WebGPU, blocks external scripts
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://*.kinde.com https://*.neon.tech",
            "worker-src 'self' blob:",
            "wasm-unsafe-eval 'self'",
          ].join('; '),
        },
      ],
    },
  ],
};

export default nextConfig;
