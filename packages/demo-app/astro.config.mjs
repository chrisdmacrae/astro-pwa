import { defineConfig } from 'astro/config';
import { spaIntegration } from 'astro-pwa';
import react from "@astrojs/react";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [spaIntegration(), react(), tailwind({
    applyBaseStyles: false
  })],
  // output: "server",
  // adapter: node({
  //   mode: "standalone"
  // })
});
