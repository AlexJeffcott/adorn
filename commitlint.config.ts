import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["ci", "docs", "fix", "revert", "feat", "wip"]],
  },
};

module.exports = Configuration;
