const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [path.resolve(__dirname, '../src/cli.ts')],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: path.join(distDir, 'cli.js'),
  external: ['fs', 'path', 'url'], // Native modules usually external
  logLevel: 'info',
};

if (watch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  });
} else {
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
