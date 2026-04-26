// Reads data/things.yml and writes src/generated/things.gen.ts so the browser bundle can import the parsed data without shipping js-yaml at runtime.

import FS from 'fs';
import Path from 'path';
import YAML from 'js-yaml';

const projectRoot = Path.resolve(__dirname, '..', '..');
const ymlPath = Path.join(projectRoot, 'data', 'things.yml');
const outDir = Path.join(projectRoot, 'src', 'generated');
const outPath = Path.join(outDir, 'things.gen.ts');

const ymlString = FS.readFileSync(ymlPath, 'utf-8');
const parsed = YAML.load(ymlString);

const out =
    `// AUTO-GENERATED from data/things.yml — do not edit\n` +
    `export const THINGS = ${JSON.stringify(parsed, null, 4)};\n`;

FS.mkdirSync(outDir, { recursive: true });
FS.writeFileSync(outPath, out, 'utf-8');

console.log(`Wrote ${Path.relative(projectRoot, outPath)}`);
