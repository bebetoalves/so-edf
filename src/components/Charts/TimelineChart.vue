<template>
  <div class="border border-gray-100 rounded-lg bg-gray-50/30 p-2">
    <apexchart type="rangeBar" height="350" :options="options" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
  import { Timeline } from '../../types';

  interface Props {
    data: Timeline[];
  }

  const props = defineProps<Props>();

  const groupedData: { [key: string]: { name: string; data: { x: string; y: number[] }[] } } = {};

  props.data.forEach(t => {
    if (!groupedData[t.task.name]) {
      groupedData[t.task.name] = {
        name: t.task.name,
        data: props.data.map(i => {
          return {
            x: i.task.name,
            y: i.task.name === t.task.name ? [i.start, i.end] : [],
          };
        }),
      };
    }
  });

  let series = Object.values(groupedData);

  let options = {
    chart: {
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    legend: {
      position: 'top',
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 10,
    },
    dataLabels: {
      enabled: true,
    }
  };
</script>
