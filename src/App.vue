<template>
  <div class="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-gray-900">
    <div class="flex flex-1 flex-col items-center justify-center">
      <img src="./assets/logo.png" alt="Vue logo" />
      <h3 class="text-5xl font-extrabold text-gray-900 dark:text-slate-50">Vite Minimale</h3>
      <span class="mt-2 text-gray-500 dark:text-slate-400">
        Vite + Vue + TypeScript + ESLint + Prettier + Husky + lint-staged
      </span>
    </div>

    <div class="flex justify-center py-14">
      <ul class="flex divide-x-2 divide-slate-200 dark:divide-slate-800">
        <li v-for="link in sites" :key="link.title" class="px-4">
          <a
            class="text-slate-500 transition-colors text-sm hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300"
            :href="link.url"
            target="_blank"
          >
            {{ link.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Site {
    title: string;
    url: string;
  }

  const sites: Site[] = [
    {
      title: 'Vite',
      url: 'https://vitejs.dev/',
    },
    {
      title: 'Vue',
      url: 'https://vuejs.org/',
    },
    {
      title: 'TypeScript',
      url: 'https://www.typescriptlang.org/',
    },
    {
      title: 'ESLint',
      url: 'https://eslint.org/',
    },
    {
      title: 'Prettier',
      url: 'https://prettier.io/',
    },
    {
      title: 'Husky',
      url: 'https://github.com/typicode/husky',
    },
    {
      title: 'lint-staged',
      url: 'https://github.com/okonet/lint-staged',
    },
  ];
</script>

<style scoped></style>
