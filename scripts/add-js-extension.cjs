const fs = require("fs");
const path = require("path");

const srcDir = path.join(process.cwd(), "src");

function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".ts")) {
      continue;
    }

    let content = fs.readFileSync(fullPath, "utf8");

    content = content.replace(
      /from\s+["'](\.{1,2}\/[^"']+)["']/g,
      (match, importPath) => {
        if (
          importPath.endsWith(".js") ||
          importPath.endsWith(".json") ||
          importPath.endsWith(".css")
        ) {
          return match;
        }

        return match.replace(importPath, `${importPath}.js`);
      }
    );

    content = content.replace(
      /import\s*\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g,
      (match, importPath) => {
        if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
          return match;
        }

        return match.replace(importPath, `${importPath}.js`);
      }
    );

    fs.writeFileSync(fullPath, content);
    console.log(`Updated: ${path.relative(process.cwd(), fullPath)}`);
  }
}

processDirectory(srcDir);

console.log("\nDone!");
