import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["[RELEASE]", "docs", "fix", "feat", "wip"]],
  },
};

module.exports = Configuration;
