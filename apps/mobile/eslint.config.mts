import { defineConfig } from "eslint/config";

import { baseConfig } from "@todo/eslint-config/base";
import { reactConfig } from "@todo/eslint-config/react";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
