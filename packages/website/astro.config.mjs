import { defineConfig } from 'astro/config';
import { pwaIntegration } from 'astro-pwa';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";
// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [pwaIntegration(), react(), tailwind({
    applyBaseStyles: false
  })],
  output: "server",
  adapter: vercel()
});
