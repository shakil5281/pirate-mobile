import { readFile } from "fs/promises";
import path from "path";

export async function readJsonFromData(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath);
  const file = await readFile(absolutePath, "utf8");
  return JSON.parse(file);
}
