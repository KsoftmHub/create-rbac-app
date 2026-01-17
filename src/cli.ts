#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import minimist from 'minimist';
import prompts from 'prompts';
import { red, green, bold, yellow } from 'kolorist';
import { MeebonCrypto } from '@meebon/meebon-crypto';

async function init() {
  console.log(bold(green('\n🚀 Welcome to the RBAC/ABAC App Scaffolder!\n')));

  const cwd = process.cwd();
  const argv = minimist(process.argv.slice(2));

  let targetDir = argv._[0];
  let projectName = targetDir;

  const result = await prompts([
    {
      type: targetDir ? null : 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-rbac-app',
      onState: (state) => {
        targetDir = state.value.trim() || 'my-rbac-app'
        projectName = targetDir;
      }
    },
    {
      type: argv.template ? null : 'select',
      name: 'template',
      message: 'Select a template:',
      choices: [
        { title: 'React (Vite + TS + RBAC)', value: 'template-react' },
        { title: 'API (NestJS + Prisma + RBAC)', value: 'template-api' },
      ],
      initial: 0,
    }
  ], {
    onCancel: () => {
      console.log(red('✖') + ' Operation cancelled');
      process.exit(1);
    }
  });

  const template = argv.template || result.template;
  const root = path.join(cwd, targetDir);

  if (fs.existsSync(root)) {
    // Basic check for existence, might want to ask to overwrite in real app
    console.log(red(`\nDirectory ${targetDir} already exists. Please choose a different name or delete it.`));
    process.exit(1);
  }


  console.log(`\nScaffolding project in ${root}...`);

  await fs.ensureDir(root);

  const templateDir = path.resolve(__dirname, '../templates', template);

  if (!fs.existsSync(templateDir)) {
    console.error(red(`\nError: Template directory not found at ${templateDir}`));
    process.exit(1);
  }

  try {
    await copy(templateDir, root);

    const pkgPath = path.join(root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // --- Smart Key Generation ---
    console.log(yellow(`\n🔐 Generating Secure RSA Keys (via @meebon/meebon-crypto)...`));
    const keys = MeebonCrypto.generateKeyPair(); // Default 3072 bits
    const { publicKey, privateKey } = keys;

    let envContent = '';
    if (template === 'template-react') {
      envContent = `VITE_API_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"\n`;
      await fs.writeFile(path.join(root, '.env'), envContent);
      console.log(green(`✅ .env created with VITE_API_PUBLIC_KEY`));
    } else if (template === 'template-api') {
      envContent = `API_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"\nAPI_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"\n`;
      await fs.writeFile(path.join(root, '.env'), envContent);
      console.log(green(`✅ .env created with API_PRIVATE_KEY and API_PUBLIC_KEY`));
    }

    console.log(bold('\n🔑  SAVE THESE KEYS FOR THE OTHER APP!  🔑'));
    console.log(yellow('------------------------------------------------'));
    console.log(bold('Public Key:'));
    console.log(publicKey);
    console.log(bold('\nPrivate Key:'));
    console.log(privateKey);
    console.log(yellow('------------------------------------------------'));
    // ----------------------------

  } catch (err) {
    console.error(red(`\nError copying template: ${err}`));
    process.exit(1);
  }

  console.log(green(`\nDone. Now run:\n`));
  console.log(`  cd ${targetDir}`);
  console.log(`  npm install`);
  console.log(`  npm run dev\n`);
}

async function copy(src: string, dest: string) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await copyDir(src, dest);
  } else {
    await fs.copy(src, dest);
  }
}

async function copyDir(srcDir: string, destDir: string) {
  await fs.ensureDir(destDir);
  const files = await fs.readdir(srcDir);
  for (const file of files) {
    if (file === 'node_modules') continue;

    const srcFile = path.resolve(srcDir, file);

    // Rename _gitignore to .gitignore
    const destFile = path.resolve(destDir, file === '_gitignore' ? '.gitignore' : file);

    await copy(srcFile, destFile);
  }
}

init().catch((e) => {
  console.error(e);
});
