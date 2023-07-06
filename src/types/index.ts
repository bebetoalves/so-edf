interface Current {
  capacity: number;
  deadline: number;
}

interface Task {
  name: string;
  capacity: number;
  deadline: number;
  period: number;
  current: Current;
}

interface Timeline {
  task: Task;
  start: number;
  end: number;
}

export type { Current, Task, Timeline };
