import { defineConfig } from 'astro/config';
import { spaIntegration } from './src/lib/spa';

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [spaIntegration(), react(), vue()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});