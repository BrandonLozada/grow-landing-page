// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { SITE } from "./src/consts";

import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: SITE.CANONICAL_URL,
  output: "static",
  adapter: netlify({ imageCDN: false }),

  build: {
    inlineStylesheets: "always",
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "DMSans",
      cssVariable: "--font-dm-sans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/DMSans.woff2"],
            weight: "normal",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  integrations: [sitemap(), favicons()],

  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "object-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "img-src 'self' data:",
        "media-src 'self'",
        "font-src 'self' data:",
        "frame-src 'self' https://www.google.com/",
        "worker-src 'self'",
        "manifest-src 'none'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: ["'self'", "'unsafe-hashes'"],
        hashes: [
          "sha256-WUDfWmQP7MHmJVPG87eP2N5ZE7RjDV9+6B/uKHMlSAE=",
          "sha256-P+wlFJoxzaX+ilJ24YqyBBK/sG4spb5yZWdYMQspG1I=",
          "sha256-UI6m4fBliGqfCKOZ9qe8Jk7vapco4kY9asvtzmDNHtI=",
          "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
          "sha256-kdaXPEOwTw3zyiuCzGv1vpohcW9SqOWq8k6gy2OWgtI=",
        ],
      },
    },
  },
});
