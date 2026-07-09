import { type Config } from "prettier"

import type { PluginOptions } from "prettier-plugin-tailwindcss"

const config: Config & PluginOptions = {
  // Standard Prettier options
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,

  // Plugins
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],

  // Tailwind CSS plugin options
  tailwindFunctions: ["cn", "cva"],
}

export default config
