import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';

import react from "@astrojs/react";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  build: {
    assets: 'examples/'
  },
  integrations: [pwaIntegration(), react(), vue(), tailwind({
    applyBaseStyles: false
  })],
  output: "server",
  adapter: vercel({ analytics: true }) // node({ mode: "standalone" })
});
