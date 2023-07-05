import { lcm } from '../math';
import { Task, Timeline } from '../types';

function calculateHyperPeriod(tasks: Task[]): number {
  return tasks.reduce((acc, task) => lcm(acc, task.period), 1);
}

function calculateUsageCPU(tasks: Task[]): number {
  let usage = 0;

  tasks.forEach(task => {
    usage = usage + task.capacity / task.period;
  });

  return usage;
}

function calculateScheduling(tasks: Task[]) {
  const timeline: Timeline[] = [];

  for (let timer = 0; timer < calculateHyperPeriod(tasks); timer++) {
    const leftTasks = tasks.filter(task => task.current.capacity > 0);

    if (leftTasks.length > 0) {
      const activeTask = leftTasks.sort((a, b) => a.current.deadline - b.current.deadline)[0];

      activeTask.current.capacity--;

      if (
        timer > 0 &&
        timeline[timeline.length - 1].task === activeTask &&
        timeline[timeline.length - 1].end === timer
      ) {
        timeline[timeline.length - 1].end = timer + 1;
        timeline[timeline.length - 1].length++;
      } else {
        timeline.push({ task: activeTask, start: timer, end: timer + 1, length: 1 });
      }
    }

    const arrived = tasks.filter(task => (timer + 1) % task.period === 0);

    arrived.forEach(task => {
      task.current.capacity = task.capacity;
      task.current.deadline = task.deadline + timer + 2;
    });
  }

  return timeline;
}

export { calculateScheduling, calculateHyperPeriod, calculateUsageCPU };
