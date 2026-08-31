/** @type {import('postcss-load-config').Config} */
import legacyChromium from './postcss-legacy-chromium.mjs'

export default {
  plugins: ['@tailwindcss/postcss', legacyChromium()],
}
