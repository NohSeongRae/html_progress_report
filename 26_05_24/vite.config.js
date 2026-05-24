import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.BASE_PATH ?? (repositoryName ? `/${repositoryName}/` : '/');

export default defineConfig({
  base,
});
