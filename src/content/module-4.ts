import type { LectureModule } from './schema';
import { topic } from './module-1';

const MODULE4_LINKS = [
  {
    title: 'Java Concurrency (Oracle)',
    url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
    description: 'База по потокам, синхронизации, видимости памяти и примитивам конкурентности.',
  },
  {
    title: 'java.util.concurrent (JDK API)',
    url: 'https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/package-summary.html',
    description: 'Официальная документация по executors, futures, locks, atomic и синхронизаторам.',
  },
  {
    title: 'JEP 266: More Concurrency Updates',
    url: 'https://openjdk.org/jeps/266',
    description: 'Контекст по развитию CompletableFuture и реактивных компонентов в Java.',
  },
];

export const module4: LectureModule = {
  id: 'module-4',
  title: 'Module 4: Multithreading and java.util.concurrent',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  isAvailable: true,
  summary:
    'Многопоточность в Java: создание и состояния потоков, volatile, race/deadlock/livelock, java.util.concurrent, atomic, lock, executors, future/completablefuture и синхронизаторы.',
  topics: [
    topic({
      id: 'mt-intro',
      title: 'Многопоточность: зачем она нужна и где чаще всего ломается',
      simpleDefinitionOverride:
        'Многопоточность нужна, чтобы приложение могло делать несколько задач одновременно, лучше использовать CPU и не блокироваться на I/O.',
      quickAnswer:
        'Плюс многопоточности — производительность и отзывчивость. Минус — сложность: гонки, зависания, ошибки видимости памяти и сложная диагностика под нагрузкой.',
      explainBrief: [
        'Главная цель — параллельность там, где это действительно даёт выигрыш, а не “всё запускать в потоках”.',
        'Многопоточность не «ускоряет всё», а только независимые части работы.',
        'CPU-bound задачи обычно масштабируются через ограниченный пул потоков по числу ядер.',
        'I/O-bound задачи часто выигрывают от большего числа воркеров, но только с лимитами и backpressure.',
        'Простой ориентир: если одна задача “считает цифры” (суммы, группировки, сортировки), а другая в это время ждёт диск/сеть, их можно выполнять параллельно.',
        'Если шаг B зависит от результата шага A, такие шаги выполняют последовательно.',
        'Shared state — это общие изменяемые данные (например, общий баланс, кэш, счётчик), к которым одновременно обращаются несколько потоков.',
        'Без контроля доступа к shared state даже “правильный” алгоритм даёт случайные баги: потерю обновлений, гонки и недетерминированный результат.',
        'Защищают shared state синхронизацией: lock/synchronized, атомиками или отказом от общего изменяемого состояния.',
        'Плохой признак — когда потоки добавили, а latency и стабильность стали хуже из-за contention и лишнего переключения контекста.',
        'Мини-проверка перед распараллеливанием: найти узкое место, проверить независимость задач, ограничить пул и сравнить метрики до/после.',
        'Частые провалы: добавить “побольше потоков” без анализа, оставить общий mutable-state без синхронизации и забыть shutdown у пула.',
      ],
      interviewFocus: [
        {
          question: 'Когда многопоточность реально помогает, а когда только усложняет систему?',
          expectedAnswer:
            'Помогает, когда задачи не мешают друг другу. Например, один поток “считает цифры” (суммы, группировки, сортировки), а второй ждёт диск или сеть — такие вещи можно делать одновременно. Вредит, когда одна задача зависит от результата другой или когда оба потока одновременно лезут в одни и те же данные.',
        },
        {
          question: 'Какие риски по умолчанию появляются в многопоточном коде?',
          expectedAnswer:
            'Race condition, deadlock, livelock, starvation, ошибки видимости и недетерминированные падения, которые сложно воспроизвести локально.',
        },
        {
          question: 'Приведи пример, когда распараллеливание не нужно делать сразу.',
          expectedAnswer:
            'Когда шаги зависимы (например, сначала получить токен, потом с ним делать запрос) или когда оба потока постоянно меняют один и тот же shared state без продуманной синхронизации.',
        },
      ],
      codeExample: {
        title: 'Контраст: последовательно и через пул',
        language: 'java',
        snippet: `ExecutorService pool = Executors.newFixedThreadPool(4);
List<Callable<String>> tasks = List.of(
    () -> load("users"),
    () -> load("orders"),
    () -> load("payments")
);
List<Future<String>> futures = pool.invokeAll(tasks);
for (Future<String> future : futures) {
    System.out.println(future.get());
}
pool.shutdown();`,
        walkthrough: [
          'Независимые задачи выполняются параллельно в фиксированном пуле, а не через бесконтрольный запуск потоков.',
          'Размер пула ограничен, что защищает систему от неконтролируемого роста числа потоков.',
          '`Future` позволяет контролировать результат каждой задачи и корректно обработать ошибки вместо “тихих” падений в фоне.',
          '`pool.shutdown()` обязателен, иначе приложение может удерживать живые рабочие потоки дольше нужного.',
        ],
        commonPitfall: 'Создать “много потоков” без лимитов и без анализа, где реально узкое место.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'CPU-bound', meaning: 'Задачи, упирающиеся в вычисления и загрузку процессора.' },
        { term: 'I/O-bound', meaning: 'Задачи, которые большую часть времени ждут сеть, диск или внешние сервисы.' },
        {
          term: 'Shared state',
          meaning:
            'Общие изменяемые данные, доступные нескольким потокам одновременно. Без синхронизации приводят к гонкам и случайному результату.',
        },
        { term: 'Contention', meaning: 'Конкуренция потоков за общий ресурс: lock, CPU, очередь, память.' },
        { term: 'Race condition', meaning: 'Ситуация, когда итог зависит от случайного порядка выполнения потоков.' },
        { term: 'Deadlock', meaning: 'Потоки заблокировали друг друга и не могут продолжить выполнение.' },
        { term: 'Livelock', meaning: 'Потоки активны, но бесконечно мешают друг другу без полезного прогресса.' },
        { term: 'Starvation', meaning: 'Поток долго не получает CPU/lock и фактически не продвигается.' },
        { term: 'Visibility', meaning: 'Видимость изменений между потоками: один записал, другой гарантированно увидел.' },
        { term: 'Latency', meaning: 'Время выполнения одной операции от запроса до результата.' },
        { term: 'Throughput', meaning: 'Сколько операций система обрабатывает за единицу времени.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-creating-threads',
      title: 'Способы создания потоков: Thread, Runnable, Callable, ExecutorService',
      simpleDefinitionOverride:
        'Поток можно создать напрямую через Thread, но в production обычно используют ExecutorService и задачи Runnable/Callable.',
      quickAnswer:
        'Thread подходит для простых примеров. В реальной системе лучше ExecutorService: он управляет жизненным циклом воркеров, очередью задач, лимитами и завершением.',
      explainBrief: [
        'Thread — самый прямой способ: создаёте и запускаете поток вручную, сами отвечаете за его жизненный цикл.',
        'Runnable — форма задачи без возвращаемого результата; часто используется для fire-and-forget действий.',
        'Callable — форма задачи с результатом и checked exception; результат получают через `Future`.',
        'Thread напрямую даёт низкоуровневый контроль, но плохо масштабируется: сложно управлять лимитами, очередями и остановкой.',
        'ExecutorService отделяет “что выполнить” (Runnable/Callable) от “как управлять потоками” (пул, очередь, shutdown).',
        'Graceful shutdown нужен, чтобы сервис остановился предсказуемо: новые задачи не принимаются, текущие корректно завершаются, ресурсы не “протекают”.',
        'Без корректной остановки пула можно потерять часть обработки, получить зависшее завершение приложения и “висящие” рабочие потоки.',
        'Практический стандарт: бизнес-логику оформляют как Runnable/Callable и отправляют в ExecutorService.',
      ],
      interviewFocus: [
        {
          question: 'Почему в enterprise-коде редко создают потоки через new Thread()?',
          expectedAnswer:
            'Потому что direct Thread плохо управляется: нет централизованного контроля лимитов, очередей, graceful shutdown и метрик. ExecutorService решает эти задачи системно.',
        },
      ],
      codeExample: {
        title: 'Thread, Runnable, Callable и ExecutorService: как выглядит в коде',
        language: 'java',
        snippet: `// 1) Thread: ручной запуск потока
Thread thread = new Thread(() -> System.out.println("Thread: run"));
thread.start();
thread.join();

// 2) Runnable: задача без результата
Runnable runnableTask = () -> System.out.println("Runnable: no result");
runnableTask.run(); // синхронный вызов в текущем потоке

// 3) Callable: задача с результатом и checked exception
Callable<Integer> callableTask = () -> {
    if (System.currentTimeMillis() < 0) {
        throw new Exception("never happens");
    }
    return 42;
};
FutureTask<Integer> futureTask = new FutureTask<>(callableTask);
new Thread(futureTask).start();
Integer directCallableResult = futureTask.get();

// 4) ExecutorService: промышленный способ управления потоками
ExecutorService pool = Executors.newFixedThreadPool(2);
pool.submit(() -> System.out.println("Executor + Runnable"));
Future<Integer> future = pool.submit(() -> 100); // Callable через submit
Integer pooledResult = future.get();

// 5) Graceful shutdown: корректная остановка пула
pool.shutdown();
if (!pool.awaitTermination(5, TimeUnit.SECONDS)) {
    pool.shutdownNow();
}`,
        walkthrough: [
          'Thread показывает базовый механизм, но не даёт масштабируемого управления большим числом задач.',
          'Runnable не возвращает значение, поэтому подходит для действий без результата.',
          'Callable возвращает значение и пробрасывает checked exception в `Future.get()`.',
          'ExecutorService централизует управление потоками и обычно является основным вариантом в реальном проекте.',
          'Graceful shutdown сначала даёт задачам шанс завершиться нормально, и только потом применяет жёсткую остановку.',
        ],
        commonPitfall:
          'Забыть корректно остановить пул (`shutdown`/`shutdownNow`): задачи могут зависнуть в очереди, а приложение будет дольше завершаться.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'Thread', meaning: 'Отдельный поток выполнения с ручным запуском через `start()`.' },
        { term: 'Runnable', meaning: 'Функциональный интерфейс задачи без результата.' },
        { term: 'Callable', meaning: 'Интерфейс задачи с результатом и checked exceptions.' },
        { term: 'Future', meaning: 'Обёртка для отложенного результата асинхронной задачи.' },
        { term: 'ExecutorService', meaning: 'API управления пулом потоков и очередью задач.' },
        {
          term: 'Graceful shutdown',
          meaning:
            'Пошаговая остановка пула: сначала `shutdown()` (не принимать новые задачи), затем ожидание `awaitTermination(...)`, и только при таймауте — `shutdownNow()`. Нужен для предсказуемого завершения без потери контроля над задачами.',
        },
        {
          term: 'Daemon thread',
          meaning:
            'Фоновый поток. Если в приложении остались только daemon-потоки, JVM может завершиться и остановить их вместе с процессом.',
        },
        {
          term: 'Non-daemon thread',
          meaning:
            'Обычный рабочий поток. Пока жив хотя бы один non-daemon поток, JVM обычно продолжает работать и не завершает приложение.',
        },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-thread-states',
      title: 'Виды состояний потоков в Java',
      simpleDefinitionOverride:
        'Основные состояния Thread: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.',
      quickAnswer:
        'Состояния потока показывают, что он сейчас делает: готов к запуску, выполняется, ждёт lock/сигнал/таймаут или завершён. Это ключ к диагностике зависаний.',
      explainBrief: [
        'NEW — поток создан, но ещё не запущен.',
        'RUNNABLE — готов к выполнению или выполняется планировщиком.',
        'BLOCKED — ждёт монитор/lock, занятый другим потоком.',
        'WAITING/TIMED_WAITING — добровольно ждёт сигнал или время.',
        'TERMINATED — выполнение завершено окончательно.',
      ],
      interviewFocus: [
        {
          question: 'Какие состояния чаще всего важны при продовом инциденте?',
          expectedAnswer:
            'Обычно смотрят BLOCKED и WAITING/TIMED_WAITING: это помогает быстро понять, где lock contention, где циклическое ожидание и кто держит ресурс.',
        },
      ],
      codeExample: {
        title: 'Пример перехода в TIMED_WAITING',
        language: 'java',
        snippet: `Thread t = new Thread(() -> {
    try {
        Thread.sleep(500);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});
System.out.println(t.getState()); // NEW
t.start();
System.out.println(t.getState()); // RUNNABLE/TIMED_WAITING
t.join();
System.out.println(t.getState()); // TERMINATED`,
        walkthrough: [
          'По getState() видно, как поток проходит жизненный цикл.',
          'В бою состояние анализируют через thread dump, а не одиночным println.',
        ],
        commonPitfall: 'Считать RUNNABLE = “реально исполняется на CPU прямо сейчас”.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        {
          term: 'Dump',
          meaning:
            'Диагностический “снимок” состояния JVM или приложения в конкретный момент времени. Нужен, чтобы разбирать зависания, утечки памяти и просадки производительности.',
        },
        {
          term: 'Thread dump',
          meaning:
            'Снимок всех потоков JVM с их состояниями и стеком вызовов. Используют для поиска deadlock, долгих блокировок и зависших потоков.',
        },
        {
          term: 'Heap dump',
          meaning: 'Снимок объектов в памяти (heap). Используют для анализа утечек памяти и избыточного потребления RAM.',
        },
        { term: 'RUNNABLE', meaning: 'Поток готов к выполнению или уже исполняется планировщиком.' },
        { term: 'BLOCKED', meaning: 'Поток ждёт освобождения монитора/lock.' },
        { term: 'WAITING', meaning: 'Поток ждёт внешнего сигнала без таймаута.' },
        { term: 'TIMED_WAITING', meaning: 'Поток ждёт событие/ресурс ограниченное время.' },
        { term: 'TERMINATED', meaning: 'Поток завершил работу и больше не выполняется.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-volatile',
      title: 'Ключевое слово volatile: видимость, но не атомарность',
      simpleDefinitionOverride:
        'volatile простыми словами: если один поток поменял значение, другие потоки увидят это новое значение. Для `i++` и других составных операций используют `Atomic*` (для простых счётчиков) или `synchronized`/`Lock` (для критических секций из нескольких шагов).',
      quickAnswer:
        'Чаще всего `volatile` ставят на булевый флаг состояния (`работаем = true/false`), чтобы один поток выставил флаг, а другие его увидели. Как только есть счётчик (`counter++`) или обновление общего состояния из нескольких шагов — нужен `AtomicInteger` (для простого счётчика) или `synchronized`/`Lock` (для критической секции).',
      explainBrief: [
        'volatile запрещает потоку использовать устаревшее локальное значение поля.',
        'Операция i++ состоит из чтения, изменения и записи — volatile не делает её безопасной.',
        'Для stop-флагов volatile обычно достаточно: один пишет, другие читают.',
        'При сложной инвариантной логике volatile не заменяет синхронизацию.',
      ],
      interviewFocus: [
        {
          question: 'Почему volatile не спасает счётчик от гонок?',
          expectedAnswer:
            'Потому что видимость не равна атомарности: два потока могут прочитать одно и то же значение и записать конфликтующий результат.',
        },
      ],
      codeExample: {
        title: 'volatile stop-flag',
        language: 'java',
        snippet: `class Worker {
    private volatile boolean running = true;

    void stop() {
        running = false;
    }

    void loop() {
        while (running) {
            doWork();
        }
    }
}`,
        walkthrough: [
          'volatile гарантирует, что поток увидит обновлённый флаг running.',
          'Такой паттерн работает для простого сигнала “остановись”, но не для атомарных вычислений.',
        ],
        commonPitfall: 'Использовать volatile как универсальный заменитель lock/synchronized.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'Visibility', meaning: 'Гарантия, что запись одного потока станет видна другим.' },
        { term: 'Atomicity', meaning: 'Неделимость операции: она выполняется как единое действие.' },
        {
          term: 'Read-modify-write',
          meaning:
            'Составная операция из трёх шагов: прочитать значение, изменить его и записать обратно (пример: `i++`). Без синхронизации может ломаться в многопоточности.',
        },
        { term: 'Happens-before', meaning: 'Отношение порядка в JMM, гарантирующее наблюдаемость изменений.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-race-deadlock-livelock',
      title: 'Race condition, deadlock и livelock: как отличать и предотвращать',
      simpleDefinitionOverride:
        'Race condition — когда итог “прыгает” от запуска к запуску из-за одновременного доступа к общим данным. Deadlock — потоки взаимно ждут друг друга и встают навсегда. Livelock — потоки не стоят, но бесконечно “уступают” и не доводят работу до результата.',
      quickAnswer:
        'Чтобы не ловить продовые зависания: уменьшайте общий изменяемый state, захватывайте lock в одном и том же порядке во всём коде, держите критические секции короткими, добавляйте таймауты и обязательно смотрите thread dump при инцидентах.',
      explainBrief: [
        'Race condition часто проявляется как “иногда не воспроизводится локально, но ломает прод”.',
        'Deadlock возникает, когда потоки удерживают ресурсы и циклически ждут друг друга.',
        'Livelock похож на deadlock внешне, но потоки крутятся и уступают друг другу бесконечно.',
        'Lock ordering: во всём коде захватывайте несколько lock в одном и том же порядке (например, сначала `accountLock`, потом `auditLock`) — это резко снижает риск deadlock.',
        'Короткие критические секции: под lock держите только то, что действительно нужно защитить, а медленные операции (I/O, HTTP, sleep) выносите наружу.',
        'tryLock с timeout: вместо вечного ожидания lock используйте ограниченное ожидание и fallback (повторить позже/вернуть ошибку/перевести в очередь).',
        'Thread dump мониторинг: при зависаниях снимайте dump и смотрите, какие потоки в `BLOCKED`/`WAITING`, кто держит lock и где образовался цикл ожидания.',
      ],
      interviewFocus: [
        {
          question: 'Как за 5 минут отличить deadlock от livelock?',
          expectedAnswer:
            'При deadlock потоки обычно застряли в BLOCKED и не двигаются. При livelock есть постоянная активность/ретраи, но бизнес-прогресса нет.',
        },
      ],
      codeExample: {
        title: 'Deadlock из-за разного порядка lock и фикс через lock ordering',
        language: 'java',
        snippet: `Object accountLock = new Object();
Object auditLock = new Object();

// 1) Проблема: разный порядок захвата lock -> deadlock
Thread t1 = new Thread(() -> {
    synchronized (accountLock) {
        sleep(100);
        synchronized (auditLock) {
            work();
        }
    }
});

Thread t2 = new Thread(() -> {
    synchronized (auditLock) {
        sleep(100);
        synchronized (accountLock) {
            work();
        }
    }
});

// 2) Решение: единый порядок lock во всех потоках
Thread safe = new Thread(() -> {
    synchronized (accountLock) {
        synchronized (auditLock) {
            work();
        }
    }
});`,
        walkthrough: [
          'В проблемном варианте поток 1 держит `accountLock` и ждёт `auditLock`, а поток 2 держит `auditLock` и ждёт `accountLock`.',
          'Оба потока ждут друг друга, поэтому прогресс останавливается: это deadlock.',
          'В решении все потоки захватывают lock одинаково: сначала `accountLock`, потом `auditLock`.',
          'Единый порядок убирает круговое ожидание и резко снижает вероятность deadlock.',
        ],
        commonPitfall: 'Диагностировать race только по логам приложения без thread dump и метрик блокировок.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'Race condition', meaning: 'Ошибка из-за неконтролируемого параллельного доступа к общему состоянию.' },
        { term: 'Deadlock', meaning: 'Взаимная блокировка потоков без возможности продолжения.' },
        { term: 'Livelock', meaning: 'Потоки активны, но не двигают бизнес-операцию вперёд.' },
        { term: 'Starvation', meaning: 'Поток постоянно обделён ресурсом и долго не получает шанс на выполнение.' },
        { term: 'Lock ordering', meaning: 'Единый порядок захвата lock, который снижает риск deadlock.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'juc-overview',
      title: 'Пакет java.util.concurrent: что в нём и зачем',
      simpleDefinitionOverride:
        'java.util.concurrent — это “готовый набор деталей” для многопоточности в Java: пулы потоков, очереди, lock, атомики, future и синхронизаторы. Смысл в том, чтобы не писать хрупкую синхронизацию вручную.',
      quickAnswer:
        'Когда в приложении несколько потоков, стартовать лучше с `java.util.concurrent`: `ExecutorService` для запуска задач, `BlockingQueue` для обмена между потоками, `ConcurrentHashMap` для общих данных, `Atomic*` для счётчиков, `Lock/Semaphore/CountDownLatch` для координации. Без этого обычно получают гонки, зависания и “самописный” сложный код.',
      explainBrief: [
        'Пакет даёт готовые решения для типовых проблем конкурентности без ручного управления низкоуровневыми деталями.',
        'Если задача “выполни в фоне” — обычно берут `ExecutorService`, а не `new Thread()` на каждый запрос.',
        'Если потоки обмениваются работой — берут `BlockingQueue`, чтобы не городить вручную `wait/notify`.',
        'Если есть общий счётчик — берут `AtomicInteger`, если критическая секция из нескольких шагов — `Lock`/`synchronized`.',
        'Если нужно координировать этапы группы потоков — используют синхронизаторы (`CountDownLatch`, `CyclicBarrier`, `Semaphore`).',
        'Ключевая идея — выбирать минимально достаточный примитив под задачу.',
        'Чем меньше ручной синхронизации, тем предсказуемее поведение под нагрузкой.',
      ],
      interviewFocus: [
        {
          question: 'Почему в современном Java-коде лучше стартовать с java.util.concurrent?',
          expectedAnswer:
            'Потому что примитивы j.u.c. хорошо протестированы и закрывают основные сценарии безопаснее и понятнее, чем ручная реализация синхронизации.',
        },
      ],
      codeExample: {
        title: 'ConcurrentHashMap как базовый примитив',
        language: 'java',
        snippet: `ConcurrentHashMap<String, Integer> counters = new ConcurrentHashMap<>();
counters.merge("orders", 1, Integer::sum);
counters.merge("orders", 1, Integer::sum);
System.out.println(counters.get("orders"));`,
        walkthrough: [
          'ConcurrentHashMap даёт потокобезопасные операции без глобальной блокировки всей структуры.',
          'merge снижает риск read-modify-write гонок при инкременте счётчиков.',
        ],
        commonPitfall: 'Использовать synchronized вокруг всего приложения вместо выбора конкретного j.u.c. примитива.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'Concurrent collection', meaning: 'Коллекция, безопасная для параллельного доступа.' },
        {
          term: 'BlockingQueue',
          meaning:
            'Очередь, где операции могут “подождать” автоматически: `take()` ждёт, пока появится элемент, а `put()` ждёт, если очередь заполнена. “Blocking” = поток не крутится в пустом цикле, а блокируется до нужного события.',
        },
        {
          term: 'Producer-consumer',
          meaning:
            'Схема “производитель-потребитель”: одни потоки кладут задачи в очередь, другие забирают и обрабатывают. BlockingQueue упрощает эту схему без ручного `wait/notify`.',
        },
        {
          term: 'До BlockingQueue',
          meaning:
            'Раньше часто писали вручную: обычная очередь + `synchronized` + `wait/notify` + свои флаги. Это было сложнее, чаще приводило к гонкам, пропущенным сигналам и зависаниям.',
        },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'mt-atomic-lock',
      title: 'Atomic и Lock: когда что выбирать',
      simpleDefinitionOverride:
        'Atomic-примитивы — это быстрый и простой способ безопасно менять одно значение из нескольких потоков (счётчик, флаг, последовательность). Lock нужен, когда операция состоит из нескольких связанных шагов и их надо выполнить как единое целое без вмешательства других потоков.',
      quickAnswer:
        'Правило выбора: один простой общий параметр (`counter`, `flag`, id) — обычно `Atomic*`. Несколько зависимых действий (например, списать баланс + записать аудит) — `Lock`/`synchronized`. `Lock` также берут, когда нужны `tryLock`, таймаут, interruptible-lock или fairness.',
      explainBrief: [
        'Atomic хорошо работает, когда нужно безопасно изменить одно значение: увеличить счётчик, переключить флаг, выдать следующий номер.',
        'Atomic обычно быстрее и проще, потому что не требует явного lock/unlock и хорошо читается в коротких сценариях.',
        'Atomic начинает “не хватать”, когда операция состоит из нескольких шагов, которые должны быть единым целым.',
        'Пример: “списать баланс + записать аудит + обновить лимит” — если это делать без общей блокировки, состояние может разъехаться.',
        'ReentrantLock даёт гибкость: `tryLock`, таймауты ожидания, interruptible-lock и справедливость очереди.',
        'Lock требует дисциплины: обязательно `unlock()` в `finally`, иначе под нагрузкой можно получить зависания.',
        'Практика: для простого счётчика берут `AtomicInteger`, для бизнес-операции из нескольких зависимых шагов — `Lock`/`synchronized`.',
      ],
      interviewFocus: [
        {
          question: 'Почему AtomicInteger не всегда заменяет lock?',
          expectedAnswer:
            'Потому что Atomic решает отдельные атомарные операции, но не гарантирует целостность сложной бизнес-операции из нескольких шагов.',
        },
      ],
      codeExample: {
        title: 'Atomic для счётчика и Lock для критической секции',
        language: 'java',
        snippet: `AtomicInteger sequence = new AtomicInteger(0);
Lock lock = new ReentrantLock();

int next = sequence.incrementAndGet();

lock.lock();
try {
    updateAccountAndAudit();
} finally {
    lock.unlock();
}`,
        walkthrough: [
          'incrementAndGet атомарно обновляет счётчик без явного lock.',
          'Для связанной операции обновления двух сущностей нужен lock на критическую секцию.',
        ],
        commonPitfall: 'Забыть unlock в finally и получить случайные зависания под нагрузкой.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        {
          term: 'CAS',
          meaning:
            'Compare-And-Set: атомарная операция “сравнил и заменил”. Если текущее значение равно ожидаемому — замена проходит, если нет — нет. На CAS построены `Atomic*`, поэтому можно безопасно обновлять простые значения без тяжёлой блокировки.',
        },
        {
          term: 'ReentrantLock',
          meaning:
            'Явная блокировка, которую один и тот же поток может захватить повторно (reentrant). Нужна, когда кроме взаимного исключения нужны расширенные возможности: `tryLock`, таймаут ожидания, interruptible-lock и fairness.',
        },
        {
          term: 'Mutex',
          meaning:
            'Mutual exclusion (взаимное исключение): в критическую секцию в один момент времени может зайти только один поток. В Java роль mutex обычно выполняют `synchronized` или `Lock`.',
        },
        { term: 'Critical section', meaning: 'Участок кода, который должен выполняться взаимно-исключающе.' },
        { term: 'Fairness', meaning: 'Справедливость lock: более ранние ожидающие потоки получают приоритет.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-executors',
      title: 'Executors: правильная работа с пулами потоков',
      simpleDefinitionOverride:
        'Executor framework — это “диспетчер задач”: он решает, сколько потоков реально работает, куда складываются новые задачи и что делать при перегрузе. Нужен, чтобы система не разваливалась от бесконтрольного `new Thread()`.',
      quickAnswer:
        'Рабочий executor — это не “любые дефолты”, а осознанная конфигурация: размер пула, ёмкость очереди, поведение при переполнении (rejection policy) и корректное завершение (`shutdown` + `awaitTermination`). Иначе на нагрузке получите рост задержек, очередь “в бесконечность” и нестабильные остановки сервиса.',
      explainBrief: [
        'newFixedThreadPool хорош для предсказуемой нагрузки и ограничения конкуренции.',
        'Cached pool может агрессивно расти и опасен без контроля.',
        'ScheduledExecutorService нужен для периодических и отложенных задач.',
        'ThreadPoolExecutor даёт полный контроль над параметрами и политикой отказа.',
        'На практике важно держать баланс: слишком маленький пул тормозит обработку, слишком большой увеличивает contention и переключения контекста.',
        'Очередь без лимита часто маскирует проблему: сервис “жив”, но время ожидания задач растёт до неприемлемого уровня.',
        'При перегрузе rejection policy должна быть осознанной: либо замедлить входящий поток, либо явно отклонить задачу, но не молча терять контроль.',
      ],
      interviewFocus: [
        {
          question: 'Какая типичная продовая ошибка при работе с executors?',
          expectedAnswer:
            'Неограниченная очередь или неверный размер пула, из-за чего задачи копятся, растёт latency, а система “жива”, но не успевает обрабатывать поток запросов.',
        },
      ],
      codeExample: {
        title: 'ThreadPoolExecutor с явной политикой отказа',
        language: 'java',
        snippet: `ThreadPoolExecutor executor = new ThreadPoolExecutor(
    4,
    8,
    60L,
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100),
    new ThreadPoolExecutor.CallerRunsPolicy()
);`,
        walkthrough: [
          'Очередь ограничена, поэтому система не уходит в бесконечное накопление задач.',
          'CallerRunsPolicy даёт backpressure: при перегрузе часть задач выполняется вызывающим потоком.',
        ],
        commonPitfall: 'Использовать дефолтные executors без понимания их очередей и поведения под нагрузкой.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        {
          term: 'Backpressure',
          meaning:
            'Механизм “притормозить вход”, когда система перегружена. Идея простая: лучше обработать меньше, но стабильно, чем принять всё и упасть по таймаутам.',
        },
        {
          term: 'Rejection policy',
          meaning:
            'Правило, что делать с новой задачей при переполненных пуле и очереди: отклонить, выполнить в вызывающем потоке, отбросить старую и т.д. Это влияет на поведение системы под пиком.',
        },
        {
          term: 'Graceful shutdown',
          meaning:
            'Пошаговая остановка: не принимать новые задачи, дать текущим завершиться, по таймауту — жёсткая остановка. Нужна, чтобы не терять контроль над завершением сервиса.',
        },
        {
          term: 'CallerRunsPolicy',
          meaning:
            'Политика отказа, где переполненную задачу выполняет поток-инициатор. Это естественно замедляет источник нагрузки и работает как простой backpressure.',
        },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'mt-future-completablefuture',
      title: 'Future и CompletableFuture: работа с асинхронным результатом',
      simpleDefinitionOverride:
        'Future — это “обещание результата” фоновой задачи: задача ещё выполняется, а результат заберёте позже. CompletableFuture — расширение этой идеи: можно строить цепочки шагов, объединять несколько async операций и централизованно обрабатывать ошибки.',
      quickAnswer:
        'Если нужен просто один результат из фоновой задачи — достаточно Future. Если нужно “сначала загрузить пользователя, потом заказы, потом собрать ответ, а ошибку обработать в одном месте” — используйте CompletableFuture. Он убирает “лес get() и try/catch” и делает сценарий читаемым как пайплайн.',
      explainBrief: [
        'Future.get() блокирует поток до результата, поэтому при длинной цепочке легко получить “ступенчатые” блокировки.',
        'CompletableFuture позволяет описать шаги декларативно: преобразование (`thenApply`), плоская связка async шагов (`thenCompose`), объединение нескольких задач (`allOf`).',
        'Композиция означает, что вы собираете несколько async операций в один сценарий: данные из шага A идут в шаг B, результат B — в шаг C.',
        'Ошибки обрабатывают централизованно (`exceptionally`, `handle`), а не размазывают `try/catch` по каждому вызову.',
        'Важно задавать executor явно, чтобы управлять пулом потоков и не перегружать общий ForkJoinPool.',
      ],
      interviewFocus: [
        {
          question: 'Почему CompletableFuture обычно предпочтительнее Future?',
          expectedAnswer:
            'Потому что позволяет строить цепочки асинхронной обработки, объединять результаты и централизованно обрабатывать ошибки, а не блокироваться после каждого шага.',
        },
      ],
      codeExample: {
        title: 'Композиция async шагов + объединение + fallback',
        language: 'java',
        snippet: `ExecutorService pool = Executors.newFixedThreadPool(4);

CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(
    () -> loadUser("42"), pool
);

CompletableFuture<List<Order>> ordersFuture = userFuture.thenCompose(
    user -> CompletableFuture.supplyAsync(() -> loadOrders(user), pool)
);

CompletableFuture<List<Payment>> paymentsFuture = userFuture.thenCompose(
    user -> CompletableFuture.supplyAsync(() -> loadPayments(user), pool)
);

CompletableFuture<String> resultFuture = CompletableFuture
    .allOf(ordersFuture, paymentsFuture)
    .thenApply(v -> "orders=" + ordersFuture.join().size()
        + ", payments=" + paymentsFuture.join().size())
    .exceptionally(error -> "fallback-response");

System.out.println(resultFuture.join());
pool.shutdown();`,
        walkthrough: [
          '`thenCompose` связывает зависимые шаги без вложенных `Future<Future<...>>`.',
          '`allOf` ждёт завершения нескольких независимых async задач и даёт точку объединения результата.',
          '`exceptionally` задаёт fallback-ответ, если любой шаг в цепочке упал с ошибкой.',
          'Явный `ExecutorService` делает выполнение предсказуемым и управляемым под нагрузкой.',
        ],
        commonPitfall: 'Строить CompletableFuture-цепочку, но внутри постоянно вызывать blocking get().',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        {
          term: 'Future',
          meaning:
            'Контейнер результата фоновой задачи. Результат может быть ещё не готов; получение через `get()` обычно блокирует поток.',
        },
        {
          term: 'CompletableFuture',
          meaning:
            'Расширенный Future для построения цепочек async шагов, объединения результатов и централизованной обработки ошибок.',
        },
        { term: 'Composition', meaning: 'Склейка нескольких async операций в единый сценарий обработки данных.' },
        { term: 'thenCompose', meaning: 'Связка зависимых async шагов, где следующий шаг тоже возвращает CompletableFuture.' },
        { term: 'allOf', meaning: 'Ожидание завершения нескольких CompletableFuture перед шагом объединения результата.' },
        { term: 'exceptionally', meaning: 'Fallback-ветка при ошибке: позволяет вернуть запасной результат.' },
        { term: 'join', meaning: 'Получение результата CompletableFuture без checked exception (ошибка заворачивается в runtime).' },
        { term: 'Async', meaning: 'Асинхронное выполнение: задача не блокирует текущий поток ожиданием результата.' },
      ],
      estimatedMinutes: 7,
    }),
    topic({
      id: 'mt-synchronizers',
      title: 'Синхронизаторы: CountDownLatch, CyclicBarrier, Semaphore, Phaser',
      simpleDefinitionOverride:
        'Синхронизаторы координируют потоки по правилам старта, ожидания и ограничения параллелизма.',
      quickAnswer:
        'CountDownLatch — дождаться завершения N задач. CyclicBarrier — синхронизировать этапы группы потоков. Semaphore — ограничить одновременный доступ к ресурсу.',
      explainBrief: [
        'CountDownLatch одноразовый: счётчик до нуля и проход.',
        'CyclicBarrier многоразовый: потоки встречаются в барьере на каждом цикле.',
        'Semaphore ограничивает число одновременных “разрешений” к ресурсу.',
        'Phaser удобен для сложных многофазных сценариев.',
        'Синхронизаторы читаются проще и безопаснее, чем самодельная координация через wait/notify.',
      ],
      interviewFocus: [
        {
          question: 'Когда выбрать Semaphore вместо Lock?',
          expectedAnswer:
            'Когда нужно не взаимное исключение одного потока, а ограничение числа параллельных доступов к ресурсу, например не более 10 запросов к внешнему API.',
        },
      ],
      codeExample: {
        title: 'Ограничение параллелизма через Semaphore',
        language: 'java',
        snippet: `Semaphore semaphore = new Semaphore(10);
executor.submit(() -> {
    semaphore.acquire();
    try {
        callExternalService();
    } finally {
        semaphore.release();
    }
});`,
        walkthrough: [
          'Semaphore задаёт верхнюю границу одновременных операций.',
          'release в finally обязателен, иначе разрешения “утекут” и система застынет.',
        ],
        commonPitfall: 'Путать задачи координации потоков с задачами взаимного исключения и выбирать неподходящий примитив.',
      },
      usefulLinksOverride: MODULE4_LINKS,
      glossary: [
        { term: 'CountDownLatch', meaning: 'Синхронизатор ожидания завершения заданного числа событий.' },
        { term: 'CyclicBarrier', meaning: 'Барьер, на котором группа потоков ждёт друг друга на этапе.' },
        { term: 'Semaphore', meaning: 'Синхронизатор ограничения числа одновременных доступов.' },
        { term: 'Phaser', meaning: 'Синхронизатор для многофазных этапов, где состав участников может меняться.' },
      ],
      estimatedMinutes: 6,
    }),
  ],
};
