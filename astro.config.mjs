// @ts-check
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://astrolinky.netlify.app/",
  integrations: [db(), tailwind({applyBaseStyles: false}), vue(), icon()],
  output: 'server',
  adapter: netlify()
});