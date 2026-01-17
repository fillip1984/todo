import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@todo/eslint-config/base";
import { nextjsConfig } from "@todo/eslint-config/nextjs";
import { reactConfig } from "@todo/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**", "src/components/ui/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
