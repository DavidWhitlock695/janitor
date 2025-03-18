import Mocha from "mocha";
import * as path from "path";
import * as fs from "fs";

export function run(): void {
  // In CommonJS modules, __dirname is available globally
  // No need for fileURLToPath and import.meta

  const mocha = new Mocha({
    ui: "bdd",
    color: true,
  });

  const testDir = path.join(__dirname, ".");

  // Add each .test.js file to the mocha instance
  fs.readdirSync(testDir)
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
