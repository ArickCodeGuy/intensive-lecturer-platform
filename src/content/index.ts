import { module1 } from './module-1';
import type { LectureModule } from './schema';

const module2: LectureModule = {
  id: 'module-2',
  title: 'Module 2: Exceptions, I/O, Algorithms, Collections',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  topics: [],
  isAvailable: false,
  lockedReason: 'Недоступно',
  summary: 'Исключения, потоки ввода-вывода, сериализация, Big O, сортировки, generics и коллекции.',
};

const module3: LectureModule = {
  id: 'module-3',
  title: 'Module 3: SOLID, Patterns, Git, Maven/Gradle',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  topics: [],
  isAvailable: false,
  lockedReason: 'Недоступно',
  summary: 'SOLID, паттерны, Git-flow, merge/rebase/cherry-pick, этапы сборки и управление зависимостями.',
};

const module4: LectureModule = {
  id: 'module-4',
  title: 'Module 4: Multithreading and java.util.concurrent',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  topics: [],
  isAvailable: false,
  lockedReason: 'Недоступно',
  summary: 'Потоки, volatile, race/deadlock/livelock, executors, future/completablefuture, синхронизаторы.',
};

const module5: LectureModule = {
  id: 'module-5',
  title: 'Module 5: Team Project and Final Presentation',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  topics: [],
  isAvailable: false,
  lockedReason: 'Недоступно',
  summary: 'Командная разработка, совместный проект и финальная защита решения.',
};

module1.isAvailable = true;
module1.summary = 'Core Java: JVM, память, ООП, модификаторы, String, equals/hashCode и базовые собес-вопросы.';

export const modules: LectureModule[] = [module1, module2, module3, module4, module5];
