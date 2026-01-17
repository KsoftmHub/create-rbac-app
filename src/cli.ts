#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import minimist from 'minimist';
import prompts from 'prompts';
import { red, green, bold } from 'kolorist';

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
      type: 'select',
      name: 'template',
      message: 'Select a template:',
      choices: [
        { title: 'React (Vite + TS + RBAC)', value: 'template-react' },
        { title: 'API (Next.js + Prisma + RBAC)', value: 'template-api' },
      ],
      initial: 0,
    }
  ], {
    onCancel: () => {
      console.log(red('✖') + ' Operation cancelled');
      process.exit(1);
    }
  });

  const { template } = result;
  const root = path.join(cwd, targetDir);

  if (fs.existsSync(root)) {
    // Basic check for existence, might want to ask to overwrite in real app
    console.log(red(`\nDirectory ${targetDir} already exists. Please choose a different name or delete it.`));
    process.exit(1);
  }

  console.log(`\nScaffolding project in ${root}...`);

  // TODO: improved scaffolding logic (copying generic templates)
  // For now we will just create the dir to prove it works

  await fs.ensureDir(root);

  const templateDir = path.resolve(__dirname, '../templates', template);

  if (!fs.existsSync(templateDir)) {
    console.error(red(`\nError: Template directory not found at ${templateDir}`));
    process.exit(1);
  }

  try {
    await fs.copy(templateDir, root, {
      filter: (src) => {
        return !src.includes('node_modules');
      }
    });

    const gitignore = path.join(root, '_gitignore');
    if (fs.existsSync(gitignore)) {
      fs.renameSync(gitignore, path.join(root, '.gitignore'));
    }

    const pkgPath = path.join(root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

  } catch (err) {
    console.error(red(`\nError copying template: ${err}`));
    process.exit(1);
  }

  console.log(green(`\nDone. Now run:\n`));
  console.log(`  cd ${targetDir}`);
  console.log(`  npm install`);
  console.log(`  npm run dev\n`);
}

init().catch((e) => {
  console.error(e);
});
