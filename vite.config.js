import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'html_progress_report';
  const base = command === 'serve' ? '/' : (process.env.BASE_PATH ?? `/${repositoryName}/`);

  return {
    base,
  };
});
