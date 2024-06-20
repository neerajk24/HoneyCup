import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Resolve 'crypto' to 'crypto-browserify'
const cryptoAlias = require.resolve("crypto-browserify");

// Vite configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: cryptoAlias,
    },
  },
});
