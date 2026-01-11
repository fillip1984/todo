import { defineConfig } from "eslint/config";

import { baseConfig } from "@todo/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
