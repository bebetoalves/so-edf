<template>
  <main class="flex flex-col space-y-12">
    <div class="bg-blue-900 h-12 border-b-2 border-yellow-500 shadow-md"></div>

    <div class="flex flex-col items-center space-y-4">
      <img src="./assets/ufc.png" class="h-44" alt="Logo UFC" />

      <div class="text-center text-gray-900">
        <h3 class="font-display font-bold text-5xl">Sistemas Operacionais</h3>
        <h2 class="font-display text-3xl font-light">Simulador de Escalonamento</h2>
      </div>
    </div>

    <div class="w-2/5 mx-auto overflow-hidden bg-white p-4 rounded-lg shadow-lg">
      <div
        class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
      >
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mx-auto h-12 w-12 text-gray-300"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <div class="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              for="file-upload"
              class="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>Selecione um arquivo</span>
              <input
                id="file-upload"
                type="file"
                class="sr-only"
                accept=".txt"
                @change="handleFileUpload"
              />
            </label>
            <p class="pl-1">para continuar</p>
          </div>
          <p class="text-xs leading-5 text-gray-600">Somente arquivos de texto</p>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-screen-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Resultado do Escalonamento
                </DialogTitle>

                <div class="mt-4">
                  <SuccessAlert
                    v-if="usageCPU < 1"
                    title="Sucesso!"
                    :message="`O uso da CPU é ${(usageCPU * 100).toFixed(
                      0,
                    )}%, esse sistema é escalonável!`"
                  />
                  <DangerAlert
                    v-if="usageCPU >= 1"
                    title="Erro!"
                    :message="`O uso da CPU é ${(usageCPU * 100).toFixed(
                      0,
                    )}%, esse sistema não é escalonável!`"
                  />
                </div>

                <div class="mt-4">
                  <TimelineChart :data="timeline" />
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    Fechar
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { Task, Timeline } from './types';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue';
  import { calculateScheduling, calculateUsageCPU } from './edf';
  import TimelineChart from './components/Charts/TimelineChart.vue';
  import DangerAlert from './components/Alerts/DangerAlert.vue';
  import SuccessAlert from './components/Alerts/SuccessAlert.vue';

  const timeline = ref<Timeline[]>([]);
  const isOpen = ref(false);
  const usageCPU = ref(0);

  function closeModal() {
    isOpen.value = false;
  }

  function openModal() {
    isOpen.value = true;
  }

  function handleFileUpload(event: Event) {
    const tasks: Task[] = [];
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = event => {
        const contents = event.target?.result as string;

        contents.split(/\r?\n/).forEach((line, index) => {
          let [p, c, d] = line.trimStart().trimEnd().split(/\s+/);

          const period = parseInt(p);
          const capacity = parseInt(c);
          const deadline = parseInt(d);

          if (period && capacity && deadline) {
            let task = {
              name: `Tarefa ${index}`,
              capacity: capacity,
              deadline: deadline,
              period: period,
              current: {
                capacity: capacity,
                deadline: deadline,
              },
            };

            tasks.push(task);
          }
        });

        timeline.value = calculateScheduling(tasks);
        usageCPU.value = calculateUsageCPU(tasks);

        if (timeline.value.length > 0) {
          openModal();
        }
      };
      reader.readAsText(file);
    }
  }
</script>

<style scoped></style>
