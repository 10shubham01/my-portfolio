import fs from "node:fs";
import path from "node:path";

import { DEV_UTILS, type DevUtil } from "./dev-utils-data";

export type { DevUtil } from "./dev-utils-data";
export { DEV_UTILS, DEV_UTILS_REPO, getDevUtilHref } from "./dev-utils-data";

export type DevUtilWithCode = DevUtil & {
  code: string;
};

const UTILS_SOURCE_DIR = path.join(process.cwd(), "content", "utils");

function readUtilSource(id: string) {
  const sourcePath = path.join(UTILS_SOURCE_DIR, `${id}.source`);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Util source not found: ${id}`);
  }

  return fs.readFileSync(sourcePath, "utf8").trimEnd();
}

export function getAllDevUtils(): DevUtilWithCode[] {
  return DEV_UTILS.map((util) => ({
    ...util,
    code: readUtilSource(util.id),
  }));
}

export function getDevUtilById(id: string): DevUtilWithCode {
  const util = DEV_UTILS.find((entry) => entry.id === id);

  if (!util) {
    throw new Error(`Util not found: ${id}`);
  }

  return {
    ...util,
    code: readUtilSource(id),
  };
}
