// src/utils/systemInfo.ts
import os from "os";

export const systemInfo = {
  platform: os.platform(),
  arch: os.arch(),
  cpus: os.cpus().length,
  uptime: () => os.uptime(),
  hostname: os.hostname(),
};
