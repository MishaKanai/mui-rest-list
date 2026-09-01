/**
 * tsc emits ES modules with extensionless relative specifiers ("./Pagination/Actions"), which
 * bundlers resolve but Node's ESM loader rejects. Rewrite them to real paths and mark the
 * directory as ESM, so lib-esm/ is loadable by anything that reads the "import" condition.
 *
 * Kept deliberately identical in approach to the same script in
 * react-json-schema-form-builder, which carries the same fork of this packaging fix.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'lib-esm');

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith('.js')) yield p;
  }
}

// `from './x'`, `import './x'`, `import('./x')`. tsc keeps the source's quote style, so both
// quote characters have to be handled; a specifier is always a string in one of these positions.
const SPECIFIER = /(\bfrom\s*|\bimport\s*|\bimport\(\s*)(['"])(\.[^'"]*)\2/g;

let rewritten = 0;
for (const file of walk(root)) {
  const dir = path.dirname(file);
  const next = fs.readFileSync(file, 'utf8').replace(SPECIFIER, (match, keyword, quote, spec) => {
    if (path.extname(spec)) return match;
    const resolved = path.resolve(dir, spec);
    const target = fs.existsSync(`${resolved}.js`)
      ? `${spec}.js`
      : fs.existsSync(path.join(resolved, 'index.js'))
        ? `${spec}/index.js`
        : null;
    if (!target) throw new Error(`${file}: cannot resolve ${spec}`);
    rewritten += 1;
    return `${keyword}${quote}${target}${quote}`;
  });
  fs.writeFileSync(file, next);
}

fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
console.log(`finalizeEsmBuild: rewrote ${rewritten} relative specifiers, wrote lib-esm/package.json`);
