import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://helmirfansah.com',
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough'
  })
});
