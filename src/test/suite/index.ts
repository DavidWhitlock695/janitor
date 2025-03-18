import Mocha from "mocha";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function run(): void {
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
  });

  const testDir = path.join(__dirname, ".");

  // Add each .test.js file to the mocha instance
  require("fs")
    .readdirSync(testDir)
    .filter((file: string) => {
      return file.endsWith(".test.js");
    })
    .forEach((file: string) => {
      mocha.addFile(path.join(testDir, file));
    });

  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
  });
}
