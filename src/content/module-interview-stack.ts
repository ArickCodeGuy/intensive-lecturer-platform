import type { LectureModule } from './schema';
import { topic } from './module-1';

const SPRING_LINKS = [
  {
    title: 'Spring Framework — документация',
    url: 'https://docs.spring.io/spring-framework/reference/',
    description: 'Официально про IoC, beans, контекст и интеграции.',
  },
  {
    title: 'Spring — guides',
    url: 'https://spring.io/guides',
    description: 'Короткие практические гайды.',
  },
  {
    title: 'Baeldung — Spring',
    url: 'https://www.baeldung.com/spring-tutorial',
    description: 'Статьи по Core и типовым собес-вопросам.',
  },
];

const BOOT_LINKS = [
  {
    title: 'Spring Boot — reference',
    url: 'https://docs.spring.io/spring-boot/reference/',
    description: 'Автоконфигурация, свойства, Actuator.',
  },
  {
    title: 'Spring Boot — externalized config',
    url: 'https://docs.spring.io/spring-boot/reference/features/external-config.html',
    description: 'Иерархия источников конфигурации.',
  },
  {
    title: 'Spring Boot Actuator',
    url: 'https://docs.spring.io/spring-boot/reference/actuator/index.html',
    description: 'Эндпоинты health, metrics, настройка exposure.',
  },
];

const SQL_LINKS = [
  {
    title: 'PostgreSQL — документация SQL',
    url: 'https://www.postgresql.org/docs/current/sql.html',
    description: 'Синтаксис запросов и команд.',
  },
  {
    title: 'Use The Index, Luke!',
    url: 'https://use-the-index-luke.com/',
    description: 'Индексы и планы выполнения простым языком.',
  },
  {
    title: 'MySQL — EXPLAIN',
    url: 'https://dev.mysql.com/doc/refman/8.0/en/explain-output.html',
    description: 'Как читать план запроса.',
  },
];

const NOSQL_LINKS = [
  {
    title: 'MongoDB — docs',
    url: 'https://www.mongodb.com/docs/',
    description: 'Документная модель, индексы, репликация.',
  },
  {
    title: 'Apache Cassandra — architecture',
    url: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/',
    description: 'Партиционирование и консистентность.',
  },
  {
    title: 'AWS — NoSQL design',
    url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html',
    description: 'Паттерны моделирования под доступ к данным.',
  },
];

const HTTP_LINKS = [
  {
    title: 'MDN — HTTP',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    description: 'Методы, заголовки, коды ответа.',
  },
  {
    title: 'RFC 9110 — HTTP Semantics',
    url: 'https://www.rfc-editor.org/rfc/rfc9110.html',
    description: 'Нормативная семантика методов и кэширования.',
  },
  {
    title: 'OWASP — API Security',
    url: 'https://owasp.org/www-project-api-security/',
    description: 'Риски и чеклист для REST/HTTP API.',
  },
];

export const moduleInterviewStack: LectureModule = {
  id: 'interview-stack',
  interviewSectionKicker: 'Spring, SQL, NoSQL, REST',
  title: 'Интервью: Spring, данные и REST',
  targetDurationMinutes: 180,
  audienceLevel: 'Стажёр / junior',
  isAvailable: true,
  summary:
    'Тридцать одна тема по Spring Core и Boot, реляционным и NoSQL базам, HTTP и REST: в каждой — простое объяснение сути, ключевые термины и ориентиры для ответа на собеседовании.',
  topics: [
    // Spring Core (5)
    topic({
      id: 'int-stack-sc-01',
      title: 'Spring Core: IoC и DI в Java-приложении',
      simpleDefinitionOverride:
        'Spring Core даёт IoC-контейнер: он создаёт beans и подставляет зависимости, чтобы бизнес-классы не разрастались `new` по всему коду.',
      quickAnswer:
        'Регистрирую компоненты и зависимости (аннотации/Java-config), ApplicationContext строит граф и внедряет зависимости — предпочтительно через конструктор.',
      explainBrief: [
        'Контейнер управляет жизненным циклом beans и scope.',
        'DI через конструктор делает зависимости явными и тестируемыми.',
        'Несколько реализаций одного типа разруливают @Primary/@Qualifier/профили.',
        'Сами beans объявляют аннотациями (@Component/@Service/@Repository) или через @Configuration + @Bean.',
        'Контекст собирает граф зависимостей на старте и может проксировать beans для AOP (например транзакций).',
        'DI снижает связанность: сервис зависит от интерфейса, а не от конкретной реализации.',
      ],
      extraKeyPoints: [
        'На собесе полезно нарисовать цепочку: Controller → Service → Repository как beans.',
        'Циклы по конструктору — сигнал пересмотреть границы модулей.',
      ],
      interviewFocus: [
        {
          question:
            'Как можно использовать Spring Core для реализации инверсии управления (IoC) и внедрения зависимостей (DI) в Java приложениях?',
          expectedAnswer:
            'Описываю beans через @Component/@Service/@Configuration+@Bean или XML; контейнер ApplicationContext при старте создаёт объекты и внедряет зависимости по типу/имени. IoC — контейнер управляет созданием и связями; DI — зависимости приходят извне (лучше конструктор). В тестах подменяю реализации или поднимаю тестовый контекст.',
        },
      ],
      codeExample: {
        title: 'Constructor injection',
        language: 'java',
        snippet: `@Service\nclass OrderService {\n  private final OrderRepository repo;\n  OrderService(OrderRepository repo) { this.repo = repo; }\n}`,
        walkthrough: ['Зависимость не создаётся внутри сервиса — её даёт контейнер.'],
        commonPitfall: 'Прятать обязательные зависимости в field injection без понимания последствий.',
      },
      usefulLinksOverride: SPRING_LINKS,
      glossary: [
        { term: 'IoC', meaning: 'Контейнер управляет созданием и связями объектов вместо ручного new везде.' },
        { term: 'DI', meaning: 'Зависимости передаются объекту снаружи (конструктор/сеттер/поле).' },
        { term: 'Bean', meaning: 'Объект, жизненным циклом которого управляет Spring-контейнер.' },
        { term: 'Qualifier', meaning: 'Уточняет, какой именно bean выбрать, если реализаций несколько.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sc-02',
      title: 'Spring Core: концепции и расширяемость',
      simpleDefinitionOverride:
        'Spring Core связывает beans, конфигурацию, жизненный цикл и точки расширения (события, AOP) в одну согласованную модель приложения.',
      quickAnswer:
        'Ключевое: контейнер, определения beans, wiring, scope, lifecycle/post-processors. Это даёт подменять реализации и подключать модули без ломки ядра.',
      explainBrief: [
        'Конфигурация описывает граф; контекст его материализует.',
        'Интерфейсы + beans позволяют менять реализации.',
        'Профили и условные beans изолируют окружения.',
        'Lifecycle hooks (init/destroy) и post-processors дают точки расширения без правок бизнес-кода.',
        'События контекста позволяют реагировать на старт/остановку или доменные события в пределах приложения.',
        'AOP добавляет сквозное поведение через прокси, не засоряя методы вручную.',
      ],
      extraKeyPoints: [
        'AOP — для сквозной логики (логирование, транзакции), не для «всего подряд».',
      ],
      interviewFocus: [
        {
          question:
            'Какие основные концепции и функциональности входят в состав Spring Core и как они взаимодействуют для обеспечения гибкости и расширяемости приложений?',
          expectedAnswer:
            'IoC-контейнер, определение и создание beans, внедрение зависимостей, scope и lifecycle, события контекста, работа с Environment/ресурсами, основы AOP. Вместе: конфигурация задаёт граф → контекст создаёт beans → зависимости связываются → при необходимости применяются прокси/аспекты → приложение зависит от абстракций, реализации подменяются.',
        },
      ],
      codeExample: {
        title: '@Bean для стороннего класса',
        language: 'java',
        snippet: `@Configuration\nclass AppCfg {\n  @Bean ObjectMapper mapper() { return new ObjectMapper(); }\n}`,
        walkthrough: ['@Bean — фабрика объекта, который не помечен @Component.'],
        commonPitfall: 'Путать @Component (класс) и @Bean (метод в @Configuration).',
      },
      usefulLinksOverride: SPRING_LINKS,
      glossary: [
        { term: 'ApplicationContext', meaning: 'Расширенный IoC-контейнер Spring с событиями и окружением.' },
        { term: 'Scope', meaning: 'Область жизни bean (singleton, prototype, request и т.д.).' },
        { term: 'BeanPostProcessor', meaning: 'Хук, который может модифицировать bean до/после инициализации.' },
        { term: 'AOP', meaning: 'Подход для сквозной логики (например транзакции/логирование) через прокси и аспекты.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sc-03',
      title: 'Spring Core: преимущества перед другими подходами',
      simpleDefinitionOverride:
        'Spring Core стандартизирует DI и даёт мост к огромной экосистеме модулей — это главный практический выигрыш в enterprise Java.',
      quickAnswer:
        'Плюсы: зрелая экосистема, предсказуемые паттерны, тестируемость, интеграции. Минусы честно называю: нужно понимать контейнер, иначе «магия».',
      explainBrief: [
        'Меньше самописной инфраструктуры вокруг зависимостей.',
        'Единый стиль в команде и в индустрии.',
        'Сильная документация и сообщество.',
        'Легче тестировать: зависимости подменяются, слои изолируются, есть зрелые test utilities.',
        'Интеграции «из коробки» (web/data/security) снижают время до первого рабочего результата.',
        'Большая цена входа — только если не понимать контейнер; но это окупается на проектах с ростом.',
      ],
      extraKeyPoints: ['Сравниваю не «Spring vs всё», а Spring vs голый код/другой DI-контейнер по задаче.'],
      interviewFocus: [
        {
          question:
            'Какие преимущества предоставляет Spring Core в сравнении с другими фреймворками для разработки приложений на Java?',
          expectedAnswer:
            'Де-факто стандарт в enterprise, огромная экосистема (Data, Security, интеграции), зрелые паттерны DI, удобство тестирования и сопровождения, хорошая документация. В сравнении с самописными фабриками — меньше шаблонного кода и больше совместимости библиотек.',
        },
      ],
      codeExample: {
        title: 'Контракт + две реализации',
        language: 'java',
        snippet: `interface Notifier { void send(String m); }\n@Service @Primary class EmailNotifier implements Notifier {}\n@Service class SmsNotifier implements Notifier {}`,
        walkthrough: ['@Primary выбирает реализацию по умолчанию при конфликте типов.'],
        commonPitfall: 'Две реализации без @Primary/@Qualifier — ошибка ambiguous dependency.',
      },
      usefulLinksOverride: SPRING_LINKS,
      glossary: [
        { term: '@Primary', meaning: 'Помечает предпочтительную реализацию при нескольких beans одного типа.' },
        { term: '@Qualifier', meaning: 'Выбирает конкретный bean по имени/квалификатору при конфликте типов.' },
        { term: 'Inversion of Control', meaning: 'Управление созданием и связями объектов вынесено в контейнер.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sc-04',
      title: 'Spring Core: Dependency Injection (знакомство)',
      simpleDefinitionOverride:
        'Dependency Injection — зависимости приходят извне; Spring делает это через контейнер и аннотации/конфигурацию.',
      quickAnswer:
        'Три вида: конструктор (лучше), сеттер, поле. Смысл — класс не создаёт зависимости сам и проще подменяется в тестах.',
      explainBrief: [
        'Интерфейс задаёт контракт, реализация — bean.',
        'Конструктор делает зависимости обязательными.',
        'Сеттер-инъекция подходит для опциональных зависимостей, но усложняет гарантии и тестирование.',
        'Инъекция в поле скрывает зависимости и затрудняет создание объекта вне контейнера.',
        'DI облегчает mock/stub в тестах и снижает связанность модулей.',
      ],
      extraKeyPoints: ['Разница между DI и Service Locator: влияние на тестируемость и связность кода.'],
      interviewFocus: [
        {
          question: 'Знакомство с основными концепциями Spring Core, такими как Dependency Injection.',
          expectedAnswer:
            'DI — объект получает зависимости снаружи. В Spring контейнер создаёт beans и внедряет зависимости. Предпочитаю конструктор: зависимости видны в API класса и проще писать тесты.',
        },
      ],
      codeExample: {
        title: 'Три способа (схема)',
        language: 'text',
        snippet: `constructor(UserRepository repo)\nsetMailSender(...)\n@Autowired private Audit audit // field`,
        walkthrough: ['На собесе обосновываю выбор конструктора.'],
        commonPitfall: 'Делать всё через поля «для краткости» и терять прозрачность.',
      },
      usefulLinksOverride: SPRING_LINKS,
      glossary: [
        { term: '@Autowired', meaning: 'Помечает точку внедрения зависимости Spring-ом.' },
        { term: 'Constructor injection', meaning: 'Внедрение через конструктор — предпочтительный способ для обязательных зависимостей.' },
        { term: 'Service Locator', meaning: 'Антипод DI: объект сам ищет зависимости в реестре, что ухудшает тестируемость.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sc-05',
      title: 'Spring Framework: базовое понимание',
      simpleDefinitionOverride:
        'Spring Framework — модульная платформа для Java: в центре IoC/DI, вокруг — веб, данные, безопасность и интеграции.',
      quickAnswer:
        'Минимум: beans, контекст, конфигурация, типовой слой Controller/Service/Repository и как это запускается.',
      explainBrief: [
        'Core — контейнер; Boot часто используется как способ старта, но Core — основа.',
        'Приложение = граф beans + конфигурация.',
        'Модули Spring закрывают типовые задачи: Web (MVC), Data (JPA), Security, Integration.',
        'Конвенция слоёв (controller/service/repository) помогает отделять ответственность и писать тесты.',
        'Spring решает инфраструктурные вопросы: транзакции, валидация, конфигурация, наблюдаемость (через экосистему).',
      ],
      extraKeyPoints: ['Разница Spring Framework и Spring Boot: Boot даёт быстрый старт и автоконфигурацию поверх Framework.'],
      interviewFocus: [
        {
          question: 'Базовое понимание Spring Framework.',
          expectedAnswer:
            'Spring — экосистема для enterprise Java. В основе IoC/DI-контейнер, который управляет beans. Поверх — модули Web, Data, Security. Типично: контроллер вызывает сервис, сервис — репозиторий; всё связывается контейнером.',
        },
      ],
      codeExample: {
        title: 'Слои',
        language: 'java',
        snippet: `@RestController class UserApi { }\n@Service class UserService { }\n@Repository interface UserRepo extends JpaRepository<User,Long> {}`,
        walkthrough: ['Каждый слой — отдельная ответственность и отдельный bean.'],
        commonPitfall: 'Запихивать SQL и бизнес-правила в контроллер.',
      },
      usefulLinksOverride: SPRING_LINKS,
      glossary: [
        { term: 'Bean', meaning: 'Объект, жизненным циклом которого управляет Spring.' },
        { term: 'Dependency injection', meaning: 'Паттерн, где зависимости передаются объекту извне.' },
        { term: 'Spring Boot', meaning: 'Надстройка для быстрого старта: стартеры, автоконфигурация, внешняя конфигурация.' },
      ],
      estimatedMinutes: 5,
    }),

    // --- Spring Boot (7) ---
    topic({
      id: 'int-stack-sb-01',
      title: 'Spring Boot: внешние источники конфигурации',
      simpleDefinitionOverride:
        'Внешняя конфигурация — настройки вне кода: файлы, переменные окружения, аргументы запуска, иногда централизованный config server.',
      quickAnswer:
        'Использую application.yml + профили + env vars; секреты не в git. Понимаю, что у источников есть приоритет.',
      explainBrief: [
        'В Docker/Kubernetes конфиг чаще идёт через env и volume.',
        'Один и тот же jar может работать в dev/prod с разными env.',
        'Профили позволяют разделять настройки окружений (dev/test/prod) без копипаста.',
        'Есть иерархия источников: аргументы запуска и env обычно переопределяют файлы.',
        'Секреты держат вне репозитория: env/secret store/vault, а не в application.yml.',
        'Для сложных настроек удобнее @ConfigurationProperties, чем россыпь @Value.',
      ],
      extraKeyPoints: ['Приоритеты источников конфигурации: аргументы запуска/env обычно переопределяют файлы.'],
      interviewFocus: [
        {
          question: 'Возможность работы с внешними источниками конфигурации.',
          expectedAnswer:
            'Настраиваю приложение через application.yml, application-{profile}.yml, переменные окружения и аргументы запуска. Секреты храню вне репозитория (env/vault). Понимаю, что значения можно переопределять снаружи без пересборки.',
        },
      ],
      codeExample: {
        title: 'Плейсхолдер из env',
        language: 'text',
        snippet: `spring:\n  datasource:\n    url: \${DB_URL}`,
        walkthrough: ['DB_URL задаётся в окружении при деплое.'],
        commonPitfall: 'Коммитить пароли в yaml.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Externalized configuration', meaning: 'Настройки вынесены из кода во внешние источники.' },
        { term: 'Profile', meaning: 'Набор настроек и (опционально) beans для конкретного окружения.' },
        { term: 'Property source', meaning: 'Источник свойств: файл, env, аргументы, системные properties и т.д.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sb-02',
      title: 'Spring Boot Actuator',
      simpleDefinitionOverride:
        'Actuator добавляет production-эндпоинты: health, metrics, info — для мониторинга и интеграции с k8s/Prometheus.',
      quickAnswer:
        'Подключаю starter-actuator, включаю только нужные endpoints, защищаю доступ, настраиваю health для пробы.',
      explainBrief: [
        'В проде сужаю exposure и включаю security.',
        'liveness/readiness — отдельные настройки под Kubernetes.',
        'Health — база для мониторинга и автоматических рестартов в оркестраторах.',
        'Metrics можно отдавать в Prometheus, чтобы строить графики и алерты.',
        'Часть эндпоинтов чувствительны (/env, /beans) — их обычно не экспонируют наружу.',
        'Actuator часто живёт на отдельном management port или за внутренней сетью.',
      ],
      extraKeyPoints: ['Чувствительные endpoints Actuator (например /env, /beans) обычно не экспонируют наружу.'],
      interviewFocus: [
        {
          question: 'Умение использовать Spring Boot Actuator для мониторинга и управления.',
          expectedAnswer:
            'Подключаю spring-boot-starter-actuator, настраиваю management.endpoints.web.exposure, включаю health/metrics/prometheus по необходимости, защищаю actuator Spring Security. Для Kubernetes настраиваю пробы на health.',
        },
      ],
      codeExample: {
        title: 'Ограничить exposure',
        language: 'text',
        snippet: `management:\n  endpoints:\n    web:\n      exposure:\n        include: health, prometheus`,
        walkthrough: ['Наружу только то, что реально нужно.'],
        commonPitfall: 'Открыть все endpoints в интернет без аутентификации.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Actuator', meaning: 'Модуль наблюдаемости и служебных HTTP/JMX endpoints.' },
        { term: 'Health', meaning: 'Состояние приложения и зависимостей (БД, брокер и т.д.).' },
        { term: 'Metrics', meaning: 'Числовые метрики (latency, rps, memory) для мониторинга.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sb-03',
      title: 'Spring Boot: опыт настройки приложения',
      simpleDefinitionOverride:
        'Настройка Boot-приложения — это профили, datasource, логирование, порт, безопасность, CORS, пулы, actuator — в контексте окружения.',
      quickAnswer:
        'Рассказываю конкретно: какие файлы, какие env, как делил dev/prod, как подключал БД и логи.',
      explainBrief: [
        'Важно разделять конфигурацию по профилям.',
        'Миграции схемы (Flyway/Liquibase) — часть «настройки» данных.',
        'Datasource: URL, пул соединений, таймауты, max pool size под нагрузку.',
        'Логи: уровни, формат, request-id, маскирование секретов.',
        'Сеть: CORS, таймауты клиента/сервера, лимиты размера запроса/ответа.',
        'Наблюдаемость: actuator exposure, алерты, readiness/liveness для k8s.',
      ],
      extraKeyPoints: ['Не путаю build-time (Maven) и runtime (env) настройки.'],
      interviewFocus: [
        {
          question: 'Опыт в настройке приложений на Spring Boot.',
          expectedAnswer:
            'Настраивал профили dev/prod, datasource и пул соединений, уровни логирования, server.port и management port, CORS и таймауты, actuator exposure. Секреты выносил в env/secret store. При необходимости подключал миграции БД.',
        },
      ],
      codeExample: {
        title: 'Профиль prod',
        language: 'text',
        snippet: `spring:\n  profiles:\n    active: prod`,
        walkthrough: ['Активный профиль выбирает набор настроек.'],
        commonPitfall: 'Один огромный yaml без разделения окружений.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Profile', meaning: 'Именованный набор настроек и beans (dev, prod, test).' },
        { term: 'Flyway/Liquibase', meaning: 'Инструменты миграций схемы БД: версия, порядок, откаты.' },
        { term: 'HikariCP', meaning: 'Популярный пул соединений JDBC по умолчанию в Spring Boot.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sb-04',
      title: 'Spring Boot: стартеры и свойства (глубже)',
      simpleDefinitionOverride:
        'Стартеры группируют зависимости и триггерят автоконфигурацию; свойства управляют поведением через единый механизм binding.',
      quickAnswer:
        'Знаю spring-boot-starter-web/jdbc/data-jpa/actuator; свойства spring.datasource.*, server.*; @ConfigurationProperties для типобезопасных настроек.',
      explainBrief: [
        'Стартеры снижают конфликты версий и упрощают подключение сценария одной зависимостью.',
        'Автоконфигурации активируются по classpath и свойствам — не нужно вручную писать «всё».',
        'Свойства поддерживают relaxed binding и разные источники (yaml, env, args) с приоритетами.',
        '@ConfigurationProperties удобнее для групп настроек и валидации (например @Validated).',
        'IDE подсказывает ключи благодаря metadata, но важно понимать, что за ними стоит.',
      ],
      extraKeyPoints: ['Роль `spring-boot-autoconfigure`: условные конфигурации, которые подключаются автоматически.'],
      interviewFocus: [
        {
          question: 'Глубокие знания функций Spring Boot, включая стартеры и свойства.',
          expectedAnswer:
            'Стартеры подтягивают согласованный набор зависимостей и включают автоконфигурации. Поведение задаётся properties/yaml; для больших блоков настроек использую @ConfigurationProperties. Знаю, где смотреть доступные ключи и как переопределять beans.',
        },
      ],
      codeExample: {
        title: '@ConfigurationProperties',
        language: 'java',
        snippet: `@ConfigurationProperties(prefix = "app")\nclass AppProps {\n  private String region;\n}`,
        walkthrough: ['Биндит app.region из конфигурации в поле.'],
        commonPitfall: 'Разбрасывать @Value по коду вместо одного класса настроек.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Starter', meaning: 'Зависимость «всё для сценария» + совместимые транзитивные библиотеки.' },
        { term: 'Autoconfigure', meaning: 'Набор конфигураций, которые Boot подключает автоматически по условиям.' },
        { term: '@ConfigurationProperties', meaning: 'Типобезопасный биндинг настроек из конфигурации в POJO.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sb-05',
      title: 'Spring Boot: простое приложение',
      simpleDefinitionOverride:
        'Минимальное Boot-приложение — main + @SpringBootApplication + нужный starter (например web) + один контроллер.',
      quickAnswer:
        'Подключаю starter-web, пишу точку входа и @RestController, запускаю jar, проверяю HTTP.',
      explainBrief: [
        'Executable jar — типичный артефакт: приложение запускается одной командой.',
        'Starter-web добавляет встроенный сервер и базовую web-инфраструктуру.',
        'Контроллеры — точки входа, сервисы — бизнес-логика, репозитории — доступ к данным.',
        'Конфиг хранится в application.yml и переопределяется профилями/env при деплое.',
        'Проверяю, что сервис отвечает, и вижу логи старта (порт, контекст, бинды).',
      ],
      extraKeyPoints: ['Показываю curl на GET /health или /hello.'],
      interviewFocus: [
        {
          question: 'Возможность создания простого приложения на Spring Boot.',
          expectedAnswer:
            'Добавляю spring-boot-starter-web, создаю класс с @SpringBootApplication и main, добавляю @RestController с GET endpoint, настраиваю порт при необходимости, запускаю через java -jar или IDE.',
        },
      ],
      codeExample: {
        title: 'Минимум',
        language: 'java',
        snippet: `@SpringBootApplication\npublic class DemoApp {\n  public static void main(String[] args) {\n    SpringApplication.run(DemoApp.class, args);\n  }\n}`,
        walkthrough: ['SpringApplication.run поднимает контекст и встроенный сервер.'],
        commonPitfall: 'Забыть зависимость starter-web и не понять, почему нет HTTP.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: '@SpringBootApplication', meaning: 'Точка входа: конфигурация + автоконфигурация + component scan.' },
        { term: 'Starter', meaning: 'Готовый набор зависимостей для сценария (web, data-jpa, actuator).' },
        { term: 'Executable jar', meaning: 'Самодостаточный jar с встроенным сервером и зависимостями.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sb-06',
      title: 'Spring Boot: автоконфигурация и convention over configuration',
      simpleDefinitionOverride:
        'Автоконфигурация подключает beans по условиям classpath; convention over configuration даёт разумные дефолты, которые можно переопределить.',
      quickAnswer:
        'Понимаю @ConditionalOn* и идею «дефолт работает, пока не объявил свой bean». Не боюсь переопределять явно, когда нужно.',
      explainBrief: [
        'Автоконфиг не отменяет понимания Spring Core.',
        'Дефолты экономят время, но их надо знать.',
        'Механика строится на @ConditionalOnClass/@ConditionalOnProperty/@ConditionalOnMissingBean и похожих условиях.',
        'Переопределение обычно простое: объявил свой bean или поставил свойство — дефолт сменился.',
        'При проблемах полезно включить debug отчёт о том, какие автоконфигурации сработали.',
        'Конвенции ускоряют старт, но «магия» исчезает, когда понимаешь условия и порядок.',
      ],
      extraKeyPoints: ['@ConditionalOnMissingBean защищает пользовательские beans.'],
      interviewFocus: [
        {
          question: 'Знакомство с автоконфигурацией и принципами конвенции перед конфигурацией.',
          expectedAnswer:
            'Boot подключает автоконфигурации при наличии классов на classpath и отсутствии пользовательских beans. Convention over configuration — разумные дефолты (порт, error handling), которые переопределяются properties и своими @Bean.',
        },
      ],
      codeExample: {
        title: 'Переопределение дефолта',
        language: 'text',
        snippet: `server:\n  port: 8081`,
        walkthrough: ['Свойство меняет дефолт без Java-кода.'],
        commonPitfall: 'Копировать XML-стиль «всё явно» и терять смысл Boot.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Auto-configuration', meaning: 'Условные конфигурации, подключаемые Boot автоматически.' },
        { term: '@ConditionalOnMissingBean', meaning: 'Условие: автоконфиг применится только если пользователь не объявил свой bean.' },
        { term: 'Convention over configuration', meaning: 'Дефолты «по соглашениям», которые можно переопределить настройками.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sb-07',
      title: 'Spring Boot: роль и упрощение разработки',
      simpleDefinitionOverride:
        'Spring Boot снижает порог входа: стартеры, автоконфиг, executable jar и единый способ конфигурации поверх Spring Framework.',
      quickAnswer:
        'Boot не заменяет Core — он ускоряет старт и стандартизирует «скелет» сервиса.',
      explainBrief: [
        'Меньше ручной настройки инфраструктуры.',
        'Проще onboarding в команде.',
        'Стартеры и BOM управляют зависимостями и версионностью, снижая конфликтность.',
        'Автоконфиг ускоряет создание сервиса: web, data, security подключаются предсказуемо.',
        'Внешняя конфигурация и профили упрощают деплой в разные окружения без пересборки.',
        'Actuator и типовые интеграции дают базовую наблюдаемость и эксплуатацию.',
      ],
      extraKeyPoints: ['Если поведение “непонятно”, помогает отчёт об автоконфигурации и понимание условий (@ConditionalOn*).'],
      interviewFocus: [
        {
          question: 'Базовое понимание Spring Boot и его роли в упрощении разработки приложений.',
          expectedAnswer:
            'Spring Boot упрощает создание standalone-приложений: стартеры, автоконфигурация, встроенный сервер, единый формат настроек. Это ускоряет разработку и стандартизирует проекты, оставаясь на Spring Framework как основе.',
        },
      ],
      codeExample: {
        title: 'Зависимость в pom (идея)',
        language: 'text',
        snippet: `spring-boot-starter-web`,
        walkthrough: ['Одна координата тянет типовой набор для REST.'],
        commonPitfall: 'Думать, что Boot — отдельный язык, а не надстройка над Spring.',
      },
      usefulLinksOverride: BOOT_LINKS,
      glossary: [
        { term: 'Spring Boot', meaning: 'Надстройка над Spring Framework для быстрого старта и дефолтов.' },
        { term: 'BOM', meaning: 'Bill of Materials: согласованный набор версий зависимостей.' },
        { term: 'Actuator', meaning: 'Набор production-эндпоинтов для health/metrics и управления.' },
      ],
      estimatedMinutes: 5,
    }),

    // --- SQL (7) ---
    topic({
      id: 'int-stack-sql-01',
      title: 'SQL: проектирование и нормализация под приложение',
      simpleDefinitionOverride:
        'Проектирование БД под приложение — это сущности, связи, ограничения и индексы под реальные запросы, а не «таблицы как получится».',
      quickAnswer:
        'Собираю модель из требований, нормализую базово, добавляю FK/UNIQUE/CHECK, продумываю индексы и миграции.',
      explainBrief: [
        'Начинаю с требований и сценариев: какие операции и отчёты нужны, какие объёмы данных ожидаются.',
        'Нормализация (обычно до 3NF) убирает дубли и аномалии обновления; справочники выношу отдельно.',
        'Связи 1:N и M:N задаю через FK и таблицы-связки, а не через списки id в строках.',
        'Ограничения (NOT NULL, UNIQUE, CHECK, FK) фиксируют инварианты и ловят ошибки ближе к данным.',
        'Индексы проектирую под ключевые запросы (WHERE/JOIN/ORDER BY), помня, что они замедляют запись.',
        'Схему меняю миграциями (Flyway/Liquibase), а не ручными правками в проде.',
      ],
      extraKeyPoints: ['Согласую схему с командами API и аналитикой.'],
      interviewFocus: [
        {
          question: 'Возможность проектировать и нормализовать базы данных для конкретных приложений.',
          expectedAnswer:
            'Выделяю сущности и связи из требований, проектирую таблицы с PK/FK, нормализую для устранения дублирования и аномалий обновления, добавляю ограничения целостности и индексы под ключевые запросы. Планирую миграции (Flyway/Liquibase).',
        },
      ],
      codeExample: {
        title: 'Связь M:N',
        language: 'text',
        snippet: `users(id) — user_roles(user_id, role_id) — roles(id)`,
        walkthrough: ['Связка хранит пары many-to-many.'],
        commonPitfall: 'Хранить списки id в строке через запятую.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'PK', meaning: 'Первичный ключ — уникальный идентификатор строки.' },
        { term: 'FK', meaning: 'Внешний ключ — ссылочная целостность между таблицами.' },
        { term: '3NF', meaning: 'Нормальная форма, где неключевые поля не зависят друг от друга транзитивно.' },
        { term: 'UNIQUE', meaning: 'Ограничение уникальности значений (или комбинации колонок).' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sql-02',
      title: 'SQL: транзакции и ACID',
      simpleDefinitionOverride:
        'Транзакция группирует операции в атомарную единицу; ACID описывает гарантии, которые ожидают от СУБД.',
      quickAnswer:
        'ACID: атомарность, согласованность, изоляция, долговечность. Границы транзакции задаю под бизнес-операцию.',
      explainBrief: [
        'ACID задаёт ожидания: атомарность, согласованность, изоляция, долговечность.',
        'Границы транзакции — это границы бизнес-операции, а не «весь запрос пользователя».',
        'Уровни изоляции влияют на аномалии чтения (dirty/non-repeatable/phantom) и на блокировки.',
        'Дедлоки возможны при конкуренции: помогает порядок доступа к ресурсам и ретраи на уровне сервиса.',
        'Длинные транзакции вредят производительности: держат блокировки и увеличивают вероятность конфликтов.',
        'Транзакцию не держат открытой во время внешних HTTP/IO-вызовов.',
      ],
      extraKeyPoints: ['Не держу транзакцию открытой на время внешнего HTTP.'],
      interviewFocus: [
        {
          question: 'Профессионализм в управлении транзакциями и свойствами ACID.',
          expectedAnswer:
            'Объясняю ACID на примере перевода денег. Задаю границы транзакции, выбираю уровень изоляции с пониманием компромиссов, обрабатываю дедлоки и избегаю длинных транзакций. В Spring связываю это с @Transactional, но суть — у СУБД.',
        },
      ],
      codeExample: {
        title: 'Логическая схема',
        language: 'text',
        snippet: `BEGIN; UPDATE accounts ...; UPDATE accounts ...; COMMIT;`,
        walkthrough: ['При ошибке — ROLLBACK, данные остаются согласованными.'],
        commonPitfall: 'Делать частичные обновления без транзакции.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'Transaction', meaning: 'Группа операций, выполняемых как единое целое (commit/rollback).' },
        { term: 'ACID', meaning: 'Свойства транзакций: атомарность, согласованность, изоляция, долговечность.' },
        { term: 'Isolation level', meaning: 'Настройка, которая определяет видимость изменений между конкурентными транзакциями.' },
        { term: 'Deadlock', meaning: 'Взаимная блокировка транзакций: каждая ждёт ресурс, удерживаемый другой.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sql-03',
      title: 'SQL: сложные запросы, JOIN и подзапросы',
      simpleDefinitionOverride:
        'Сложный SQL — это JOIN нескольких таблиц, фильтрация, агрегации, подзапросы/CTE и оконные функции там, где уместно.',
      quickAnswer:
        'Пишу JOIN осознанно (INNER/LEFT), использую EXISTS, GROUP BY/HAVING, по необходимости CTE.',
      explainBrief: [
        'JOIN использую осознанно: INNER для совпадений, LEFT когда важны строки «без пары».',
        'Агрегации: GROUP BY и HAVING (WHERE — до группировки, HAVING — после).',
        'EXISTS подходит для проверок существования без лишних данных.',
        'CTE (WITH) повышает читаемость и помогает разложить запрос на шаги.',
        'Коррелированные подзапросы могут быть дорогими — смотрю план и при необходимости переписываю в JOIN.',
        'Следить за дубликатами после JOIN и правильной группировкой — частая причина багов в отчётах.',
      ],
      extraKeyPoints: ['Как читать EXPLAIN: какие операции дорогие и где ожидать индекс/скан.'],
      interviewFocus: [
        {
          question: 'Опыт написания сложных SQL-запросов, объединений и подзапросов.',
          expectedAnswer:
            'Пишу многостоловые JOIN, использую подзапросы и CTE для читаемости, агрегации с GROUP BY/HAVING, EXISTS для проверок существования. Понимаю влияние на план и когда переписать подзапрос в JOIN.',
        },
      ],
      codeExample: {
        title: 'LEFT JOIN + агрегация',
        language: 'text',
        snippet: `SELECT u.id, COUNT(o.id) c\nFROM users u\nLEFT JOIN orders o ON o.user_id=u.id\nGROUP BY u.id;`,
        walkthrough: ['LEFT сохраняет пользователей без заказов.'],
        commonPitfall: 'Путать INNER и LEFT и «терять» строки.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'JOIN', meaning: 'Объединение строк из разных таблиц по условию.' },
        { term: 'LEFT JOIN', meaning: 'Сохраняет строки из левой таблицы даже без совпадений справа.' },
        { term: 'CTE', meaning: 'WITH — именованный подзапрос для читаемости (и иногда оптимизации).' },
        { term: 'EXISTS', meaning: 'Проверка существования строк, часто эффективнее, чем COUNT(*).' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sql-04',
      title: 'SQL: проектирование и оптимизация РСУБД',
      simpleDefinitionOverride:
        'Оптимизация начинается с реальных запросов и плана выполнения; индексы и типы данных — инструменты, а не самоцель.',
      quickAnswer:
        'Смотрю EXPLAIN, добавляю индексы под фильтры и JOIN, контролирую кардинальность, избегаю лишних full scan.',
      explainBrief: [
        'Оптимизация начинается с измерений: EXPLAIN/ANALYZE, latency, частота запросов.',
        'Индексируют колонки из WHERE/JOIN/ORDER BY, но понимают цену: запись и размер диска растут.',
        'Составной индекс зависит от порядка колонок и того, как строятся фильтры.',
        'Функции и преобразования в WHERE могут «убить» использование индекса.',
        'Статистика и кардинальность влияют на план; при перекосах помогают VACUUM/ANALYZE/обновление статистики (по СУБД).',
        'Партиционирование и денормализация — крайние инструменты под большие объёмы и конкретные паттерны чтения.',
      ],
      extraKeyPoints: ['Партиционирование — для очень больших таблиц по осмысленному ключу.'],
      interviewFocus: [
        {
          question: 'Глубокие знания принципов проектирования и оптимизации реляционных баз данных.',
          expectedAnswer:
            'Проектирую схему под доступы приложения, выбираю ключи и индексы, анализирую план (EXPLAIN), работаю со статистикой, избегаю антипаттернов вроде функций на индексированных колонках в WHERE. Балансирую нормализацию и производительность чтения.',
        },
      ],
      codeExample: {
        title: 'Индекс под фильтр',
        language: 'text',
        snippet: `CREATE INDEX idx_orders_user ON orders(user_id);`,
        walkthrough: ['Ускоряет выборки по user_id.'],
        commonPitfall: 'Индексировать всё «на всякий случай».',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'EXPLAIN', meaning: 'План выполнения запроса в СУБД.' },
        { term: 'Index', meaning: 'Структура данных для ускорения поиска/сортировки по колонкам.' },
        { term: 'Cardinality', meaning: 'Количество уникальных значений/распределение данных в колонке.' },
        { term: 'Full scan', meaning: 'Чтение всей таблицы вместо использования индекса.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-sql-05',
      title: 'SQL: CRUD',
      simpleDefinitionOverride:
        'CRUD — четыре базовые операции над строками таблиц через INSERT/SELECT/UPDATE/DELETE.',
      quickAnswer:
        'INSERT с явными колонками, SELECT с WHERE, UPDATE/DELETE только с WHERE, понимаю идемпотентность там, где нужна.',
      explainBrief: [
        'Create: INSERT с явными колонками, обработка UNIQUE/FK ошибок.',
        'Read: SELECT с WHERE и LIMIT; избегаю SELECT * без причины.',
        'Update/Delete делаю только с WHERE, часто через PK.',
        'UPSERT/MERGE/ON CONFLICT зависят от диалекта и требуют уникального ключа.',
        'Согласую операции с транзакциями: несколько шагов — в одной транзакции.',
        'Понимаю идемпотентность на уровне API и её связь с UPDATE/PUT.',
      ],
      extraKeyPoints: ['В API важно согласовать транзакции с операциями БД.'],
      interviewFocus: [
        {
          question: 'Возможность выполнять базовые операции CRUD (Create, Read, Update, Delete) с использованием SQL.',
          expectedAnswer:
            'Делаю INSERT с перечислением колонок, SELECT с фильтрами, UPDATE и DELETE с WHERE. Понимаю ограничения и ошибки нарушения FK/UNIQUE. При необходимости использую UPSERT/MERGE по возможностям СУБД.',
        },
      ],
      codeExample: {
        title: 'Безопасный UPDATE',
        language: 'text',
        snippet: `UPDATE users SET active=false WHERE id=42;`,
        walkthrough: ['WHERE ограничивает область изменения.'],
        commonPitfall: 'UPDATE без WHERE.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'DML', meaning: 'Data Manipulation Language: SELECT/INSERT/UPDATE/DELETE.' },
        { term: 'DDL', meaning: 'Data Definition Language: CREATE/ALTER/DROP для схемы.' },
        { term: 'UPSERT', meaning: 'Операция «insert или update», если запись уже существует (в разных СУБД по-разному).' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sql-06',
      title: 'SQL: таблицы, запросы, базовая нормализация',
      simpleDefinitionOverride:
        'Таблица — строки и столбцы; запросы выбирают и соединяют данные; нормализация убирает дубли и странные зависимости.',
      quickAnswer:
        'Понимаю PK/FK, 1NF–3NF на уровне «зачем», умею простые JOIN и GROUP BY.',
      explainBrief: [
        'Таблица — сущность, строки — записи, столбцы — атрибуты; ключи задают идентичность и связи.',
        'Запросы делают фильтрацию (WHERE), сортировку (ORDER BY), агрегации (GROUP BY).',
        '1NF: значения атомарны, нет повторяющихся групп в одной строке.',
        '2NF/3NF на практике — про вынос зависимых данных и справочников, чтобы не плодить дубли.',
        'Нормализация уменьшает аномалии обновления и упрощает целостность.',
        'Денормализация допустима, если выигрываем в чтении и контролируем согласованность.',
      ],
      extraKeyPoints: ['Нормализация — инструмент, не культ.'],
      interviewFocus: [
        {
          question: 'Знакомство с основными концепциями, такими как таблицы, запросы и базовая нормализация.',
          expectedAnswer:
            'Таблицы хранят сущности, SQL-запросы читают и изменяют данные. Базовая нормализация помогает убрать дублирование и аномалии обновления: вынос справочников, корректные ключи, связи через FK.',
        },
      ],
      codeExample: {
        title: 'Вынос справочника',
        language: 'text',
        snippet: `countries(id,name)\nusers(id, country_id)`,
        walkthrough: ['Страна не дублируется строкой в каждом user.'],
        commonPitfall: 'Дублировать одно и то же текстовое поле везде.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: '1NF', meaning: 'Первая нормальная форма — без повторяющихся групп в строке.' },
        { term: 'NULL', meaning: 'Отсутствующее значение; требует аккуратности в сравнениях и агрегатах.' },
        { term: 'GROUP BY', meaning: 'Группировка строк для агрегирования (COUNT/SUM и т.д.).' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-sql-07',
      title: 'SQL и реляционные БД: базовое понимание',
      simpleDefinitionOverride:
        'Реляционная БД хранит данные в таблицах со связями; SQL — язык запросов к этим данным.',
      quickAnswer:
        'Минимум: таблица/строка/столбец, PK, простой SELECT, понимание роли СУБД.',
      explainBrief: [
        'Реляционная модель: таблицы, ключи, связи, ограничения целостности.',
        'SQL — язык для чтения и изменения данных, плюс управление схемой (DDL).',
        'СУБД обеспечивает конкурентный доступ, блокировки/изоляцию и транзакции.',
        'Ограничения (FK/UNIQUE/NOT NULL) — защита инвариантов на уровне данных.',
        'NULL ведёт себя не как «0/пусто»: сравнения требуют IS NULL/IS NOT NULL.',
        'Понимание плана и индексов критично, когда данные растут.',
      ],
      extraKeyPoints: ['Разница DDL и DML: схема (CREATE/ALTER) vs работа с данными (SELECT/INSERT/UPDATE/DELETE).'],
      interviewFocus: [
        {
          question: 'Базовое понимание реляционных баз данных и SQL.',
          expectedAnswer:
            'Данные в таблицах, между ними связи через ключи. SQL используется для выборки и изменения данных. СУБД гарантирует целостность ограничениями и поддерживает транзакции.',
        },
      ],
      codeExample: {
        title: 'Простейший SELECT',
        language: 'text',
        snippet: `SELECT * FROM products WHERE price < 100;`,
        walkthrough: ['WHERE фильтрует строки.'],
        commonPitfall: 'SELECT * в проде без необходимости.',
      },
      usefulLinksOverride: SQL_LINKS,
      glossary: [
        { term: 'RDBMS', meaning: 'Реляционная СУБД, которая хранит данные в таблицах со связями и поддерживает SQL.' },
        { term: 'PK', meaning: 'Первичный ключ — уникально идентифицирует строку.' },
        { term: 'Constraint', meaning: 'Ограничение целостности (NOT NULL, UNIQUE, FK, CHECK).' },
      ],
      estimatedMinutes: 5,
    }),

    // --- NoSQL (7) ---
    topic({
      id: 'int-stack-nosql-01',
      title: 'NoSQL: консистентность',
      simpleDefinitionOverride:
        'В распределённых NoSQL консистентность часто компромисс: задержки репликации, quorum, идемпотентность и версии.',
      quickAnswer:
        'Проектирую с учётом повторов сообщений, устаревших чтений и условных записей; при необходимости выбираю более строгие режимы чтения/записи.',
      explainBrief: [
        'В распределённых системах возможны задержки репликации: чтение может временно видеть старые данные.',
        'Тюнингуем консистентность: quorum/read/write concern или аналоги в конкретной СУБД.',
        'Идемпотентные операции и ключи идемпотентности защищают от повторной доставки и ретраев.',
        'Версии документов, CAS и условные обновления помогают избегать lost update при гонках.',
        'Важно различать «read your writes» и eventual consistency: это разные гарантии.',
        'Критичные инварианты иногда выносят в более строгую модель (SQL/транзакции) или проектируют вокруг событий.',
      ],
      extraKeyPoints: ['Чтение «своей» записи — отдельная тема при репликации.'],
      interviewFocus: [
        {
          question: 'Возможность решать проблемы, связанные с консистентностью в NoSQL базах данных.',
          expectedAnswer:
            'Использую идемпотентные ключи, версии/CAS, настройки quorum, учитываю replication lag. Проектирую операции так, чтобы временно устаревшее чтение и повтор доставки не ломали инварианты.',
        },
      ],
      codeExample: {
        title: 'Idempotency-Key',
        language: 'text',
        snippet: `POST /payments\nIdempotency-Key: 7c2f...`,
        walkthrough: ['Повтор запроса с тем же ключом не должен продублировать списание.'],
        commonPitfall: 'Считать, что «запись всегда сразу видна на всех репликах».',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'Quorum', meaning: 'Согласование записи/чтения между репликами (сколько узлов должно подтвердить).' },
        { term: 'Replication lag', meaning: 'Задержка распространения записи на реплики; источник «устаревших чтений».' },
        { term: 'CAS', meaning: 'Compare-and-set: обновление только если версия/условие совпало.' },
        { term: 'Eventual consistency', meaning: 'Со временем реплики сходятся, но мгновенной согласованности может не быть.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-nosql-02',
      title: 'NoSQL: масштабируемость и гибкость',
      simpleDefinitionOverride:
        'NoSQL часто выбирают за горизонтальное масштабирование и гибкую схему данных под быстрые итерации продукта.',
      quickAnswer:
        'Шардирование, репликация, эластичное расширение кластера; гибкость схемы требует дисциплины версий.',
      explainBrief: [
        'Горизонтальное масштабирование: шардирование/партиционирование распределяет нагрузку по узлам.',
        'Репликация повышает доступность и даёт масштаб чтения (с оговорками по консистентности).',
        'Гибкая схема ускоряет изменения модели, но требует дисциплины версий и миграций данных.',
        'Ключи партиционирования должны распределять нагрузку — иначе появляются hot partitions/keys.',
        'Мониторю latency, размер партиций, рост индексов и нагрузку на compaction (где применимо).',
        'Часто выбирают NoSQL под конкретный паттерн доступа, а не «вместо SQL» целиком.',
      ],
      extraKeyPoints: ['Polyglot persistence: SQL + NoSQL в одном продукте — нормально.'],
      interviewFocus: [
        {
          question: 'Профессионализм в использовании функций NoSQL баз данных для масштабируемости и гибкости.',
          expectedAnswer:
            'Использую шардирование/репликацию, TTL, индексы, выбор модели под нагрузку. Понимаю trade-offs: больше масштаб и гибкость — сложнее строгая консистентность и миграции данных.',
        },
      ],
      codeExample: {
        title: 'Равномерный shard key',
        language: 'text',
        snippet: `userId (хорошо) vs country=US (плохо для hot spot)`,
        walkthrough: ['Ключ должен распределять запись/чтение.'],
        commonPitfall: 'Неудачный partition key → hot partition.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'Sharding', meaning: 'Разнесение данных по узлам по ключу.' },
        { term: 'Shard key', meaning: 'Ключ, по которому данные распределяются по шардам/партициям.' },
        { term: 'Hot key', meaning: 'Ключ, на который приходится непропорционально много запросов/записей.' },
        { term: 'Schema evolution', meaning: 'Эволюция схемы: совместимость версий документов/записей при изменениях.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-nosql-03',
      title: 'NoSQL: проектирование и моделирование',
      simpleDefinitionOverride:
        'Моделирование в NoSQL начинается с access patterns: какие запросы должны быть быстрыми и какие ключи это обеспечивают.',
      quickAnswer:
        'Проектирую ключи партиционирования, структуру документа, денормализацию и ссылки; избегаю бесконечных вложенных массивов.',
      explainBrief: [
        'Начинаю с access patterns: что читаем чаще всего, по каким ключам, какие диапазоны.',
        'Проектирую partition key/primary key так, чтобы запросы попадали в одну партицию и были предсказуемы.',
        'Часто денормализуют ради одного быстрого чтения — это нормально, но нужно управлять обновлениями.',
        'Вторичные индексы и запросы «как в SQL» могут быть дорогими — проверяю ограничения конкретной БД.',
        'Согласованность между агрегатами решают событиями, сагами и идемпотентными обработчиками.',
        'Думаю о росте: размер документов, списков, партиций, TTL и стратегиях архивации.',
      ],
      extraKeyPoints: ['Не проектирую NoSQL «как реляционку с JOIN».'],
      interviewFocus: [
        {
          question: 'Опыт проектирования и моделирования данных для NoSQL баз данных.',
          expectedAnswer:
            'Собираю требования по чтению/записи, выбираю тип хранилища, проектирую ключи и структуру документов/колонок, планирую индексы и TTL, продумываю рост данных и обновление денормализованных полей.',
        },
      ],
      codeExample: {
        title: 'Документ заказа',
        language: 'text',
        snippet: `{ "orderId":"o1", "items":[...], "total": 120 }`,
        walkthrough: ['Часто кладут данные, читаемые вместе, в один документ.'],
        commonPitfall: 'Огромный массив событий внутри одного документа.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'Access pattern', meaning: 'Типовые сценарии чтения/записи приложения.' },
        { term: 'Partition key', meaning: 'Ключ, определяющий партицию/узел, где лежат данные.' },
        { term: 'Denormalization', meaning: 'Дублирование данных ради быстрого чтения без JOIN.' },
        { term: 'Saga', meaning: 'Оркестрация/хореография шагов для согласованности между сервисами/агрегатами.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-nosql-04',
      title: 'NoSQL: MongoDB и Cassandra (глубже)',
      simpleDefinitionOverride:
        'MongoDB — документная модель с богатыми запросами; Cassandra — колоночная модель, где запросы жёстко завязаны на partition key.',
      quickAnswer:
        'Mongo: BSON, индексы, replica set. Cassandra: partition/clustering keys, tunable consistency, ограничения cross-partition.',
      explainBrief: [
        'MongoDB удобен для документов и запросов по полям, но нужно понимать индексы и размеры документов.',
        'Cassandra требует проектировать таблицы под конкретные запросы вокруг partition key/clustering key.',
        'Выбор движка — от паттерна данных и нагрузок, а не от «моды» на NoSQL.',
        'Replication lag важен для чтения после записи; консистентность обычно настраиваемая.',
        'Антипаттерн Mongo: запросы без индексов и бесконечные массивы в одном документе.',
        'Антипаттерн Cassandra: запросы без partition key и попытка делать «универсальные таблицы как в SQL».',
      ],
      extraKeyPoints: ['Типичные антипаттерны MongoDB и Cassandra: запросы без индексов, неверный partition key и т.д.'],
      interviewFocus: [
        {
          question: 'Глубокие знания конкретных типов NoSQL баз данных (например, MongoDB, Cassandra).',
          expectedAnswer:
            'MongoDB: документы, индексы, replica set, транзакции с оговорками. Cassandra: модель под partition key, clustering key, настройки consistency, отсутствие «SQL JOIN как в OLTP». Понимаю компромиссы и типичные ошибки проектирования.',
        },
      ],
      codeExample: {
        title: 'Cassandra ключ',
        language: 'text',
        snippet: `PRIMARY KEY ((user_id), order_id)`,
        walkthrough: ['user_id определяет партицию, order_id сортирует внутри.'],
        commonPitfall: 'Запрос без partition key → дорогой full scan.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'BSON', meaning: 'Бинарное представление документов в MongoDB (JSON-подобная структура).' },
        { term: 'Replica set', meaning: 'Набор реплик MongoDB для высокой доступности.' },
        { term: 'Partition key', meaning: 'Ключ партиции в Cassandra: без него запросы становятся дорогими.' },
        { term: 'Tunable consistency', meaning: 'Настраиваемая консистентность чтения/записи (quorum и аналоги).' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-nosql-05',
      title: 'NoSQL: CRUD',
      simpleDefinitionOverride:
        'CRUD в NoSQL реализуется API движка: в документной БД — insert/find/update/delete, в KV — put/get/delete.',
      quickAnswer:
        'Делаю операции атомарно где возможно, использую фильтры и условные обновления при конкуренции.',
      explainBrief: [
        'CRUD-операции отличаются по СУБД, но базовая идея та же: put/get/update/delete.',
        'Предпочитаю атомарные операции (update operators) вместо read-modify-write при конкуренции.',
        'Условные обновления (по версии/условию) защищают от потери изменений.',
        'TTL — часть «удаления» для временных данных (сессии, кеш, одноразовые токены).',
        'Пагинация часто делается через cursor/токены, а не offset на больших объёмах.',
        'Индексы критичны для скорости find; без индекса запрос может «пробежать всё».',
      ],
      extraKeyPoints: ['Семантика операции upsert в конкретной СУБД (конфликты, уникальные ключи, атомарность).'],
      interviewFocus: [
        {
          question: 'Возможность выполнять базовые операции CRUD с использованием NoSQL баз данных.',
          expectedAnswer:
            'Выполняю вставку/чтение/обновление/удаление документов или KV-пар, использую фильтры и индексы, при необходимости TTL. Учитываю конкуренцию и делаю обновления условными, чтобы не потерять изменения.',
        },
      ],
      codeExample: {
        title: 'Mongo updateOne',
        language: 'text',
        snippet: `db.users.updateOne({ _id: \"u1\" }, { $set: { active: true } })`,
        walkthrough: ['Точечное обновление поля документа.'],
        commonPitfall: 'read-modify-write без условий при гонках.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'Upsert', meaning: 'Операция «создать или обновить», если запись уже есть (семантика зависит от движка).' },
        { term: 'TTL', meaning: 'Time-to-live: автоматическое удаление записи после срока.' },
        { term: 'Atomic update', meaning: 'Обновление части записи без чтения всего объекта (операторы $set и аналоги).' },
        { term: 'CAS', meaning: 'Compare-and-set — запись только если версия совпала.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-nosql-06',
      title: 'NoSQL: KV, документы, колонки',
      simpleDefinitionOverride:
        'Три распространённых класса: ключ–значение, документные, широкие колонки — с разной семантикой и запросами.',
      quickAnswer:
        'KV — минимум структуры и максимум скорости; документ — структура + запросы по полям; колоночные — партиции и масштаб.',
      explainBrief: [
        'KV-хранилища хороши для кеша/сессий и быстрых операций по ключу, но почти не дают запросов по полям.',
        'Документные БД удобны, когда данные читаются «пачкой» как агрегат и нужны запросы по нескольким полям.',
        'Wide-column (колоночные) требуют проектировать таблицы под запросы вокруг partition key и масштабирования.',
        'Выбор типа = выбор модели доступа и компромиссов по консистентности/индексации.',
        'Нельзя «натянуть» SQL-привычки на всё: часто нет JOIN или он слишком дорогой.',
        'Графовые БД выделяются отдельно, когда главное — связи и обходы по графу.',
      ],
      extraKeyPoints: ['Графовые БД — отдельный класс для явных связей.'],
      interviewFocus: [
        {
          question: 'Знакомство с хранилищами ключ-значение, документами или столбцами.',
          expectedAnswer:
            'KV хранит пару ключ/значение и хорош для кеша/сессий. Документные хранят структурированные документы и позволяют запросы по полям. Колоночные (wide-column) проектируют данные вокруг partition key для масштабирования.',
        },
      ],
      codeExample: {
        title: 'KV vs документ (словами)',
        language: 'text',
        snippet: `KV: session:123 -> blob\nDocument: { _id, profile:{...} }`,
        walkthrough: ['Документ даёт структуру; KV — скорость и простота.'],
        commonPitfall: 'Хранить «всё в одном JSON в Redis» без стратегии.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'Key-value store', meaning: 'Хранилище, где доступ к данным идёт по ключу (get/put), без сложных запросов.' },
        { term: 'Document store', meaning: 'БД, где основная единица — документ (часто JSON-подобный).' },
        { term: 'Wide-column store', meaning: 'Модель, где данные группируются в партиции; запросы завязаны на ключ партиции.' },
        { term: 'Graph database', meaning: 'БД, оптимизированная под хранение и обход связей (вершины/рёбра).' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-nosql-07',
      title: 'NoSQL: базовое понимание и роль',
      simpleDefinitionOverride:
        'NoSQL — это разные модели хранения под масштаб и паттерны доступа; в современных системах их часто сочетают с SQL.',
      quickAnswer:
        'Объясняю, зачем NoSQL в продукте: кеш, документный профиль, события, граф — и какие компромиссы.',
      explainBrief: [
        'NoSQL закрывает разные сценарии: кеш (KV), каталоги/профили (документы), большие записи событий (wide-column), граф связей.',
        'Часто выигрываем в масштабе и скорости разработки, но платим сложностью консистентности и модели данных.',
        'Polyglot persistence — нормальная практика: разные части системы → разные хранилища.',
        'CAP и eventual consistency — часть разговора: выбираем компромисс под задачу.',
        'Операционка важна: бэкапы, мониторинг, восстановление, рост индексов и стоимость хранения.',
        'Версионирование схемы документов и совместимость форматов — обязательны при развитии продукта.',
      ],
      extraKeyPoints: ['Не заявляю «NoSQL всегда лучше SQL».'],
      interviewFocus: [
        {
          question: 'Базовое понимание NoSQL баз данных и их роли в современных приложениях.',
          expectedAnswer:
            'NoSQL покрывает сценарии, где важны масштаб, гибкая схема или специфические access patterns. В проде часто комбинируют SQL и NoSQL. Важно понимать модель данных и консистентность конкретного движка.',
        },
      ],
      codeExample: {
        title: 'Пример «зачем»',
        language: 'text',
        snippet: `SQL: финансовые проводки\nRedis: сессии\nMongo: каталог`,
        walkthrough: ['Разные части системы — разные хранилища.'],
        commonPitfall: 'Выбрать NoSQL «потому что модно» без требований.',
      },
      usefulLinksOverride: NOSQL_LINKS,
      glossary: [
        { term: 'CAP', meaning: 'Теорема про компромисс между консистентностью, доступностью и устойчивостью к разделению сети.' },
        { term: 'Eventual consistency', meaning: 'Согласованность «со временем»: реплики могут расходиться кратковременно.' },
        { term: 'Polyglot persistence', meaning: 'Несколько типов БД в одной системе под разные задачи.' },
        { term: 'Schema evolution', meaning: 'Совместимое изменение структуры данных/документов между версиями.' },
      ],
      estimatedMinutes: 5,
    }),

    // --- REST (5) ---
    topic({
      id: 'int-stack-rest-01',
      title: 'REST API: кэширование',
      simpleDefinitionOverride:
        'Кэширование REST строится на семантике GET и заголовках Cache-Control, ETag/Last-Modified.',
      quickAnswer:
        'public/private, max-age, no-store; ETag + If-None-Match → 304; для персональных данных — private или no-store.',
      explainBrief: [
        'Кэшировать по смыслу можно только безопасные чтения: обычно это GET (и иногда HEAD).',
        'Cache-Control задаёт политику хранения: public/private, max-age, no-store, must-revalidate.',
        'ETag/Last-Modified позволяют делать условные запросы: если ресурс не менялся — 304 без тела.',
        'Vary важно, когда ответ зависит от заголовков (Accept, Accept-Encoding, Authorization и т.д.).',
        'Инвалидация чаще решается версионированием ресурса (ETag/версия в URL) или коротким TTL.',
        'Персональные ответы и чувствительные данные нельзя кэшировать как public; для них — private/no-store.',
      ],
      extraKeyPoints: [
        'Не кэшировать персональные ответы как public.',
        'Если ответ зависит от авторизации, проверь, что shared cache не отдаст его другому пользователю.',
      ],
      interviewFocus: [
        {
          question: 'Кэширование REST API.',
          expectedAnswer:
            'Настраиваю Cache-Control (public/private, max-age, no-store), использую ETag/Last-Modified и условные GET (If-None-Match) для ответа 304. Для приватных данных указываю private или no-store, чтобы shared cache не хранил ответ.',
        },
      ],
      codeExample: {
        title: '304 Not Modified',
        language: 'text',
        snippet: `If-None-Match: \"v2\"\n→ 304`,
        walkthrough: ['Тело не пересылается, если версия не изменилась.'],
        commonPitfall: 'Пометить персональный JSON как public, кэшируемый.',
      },
      usefulLinksOverride: HTTP_LINKS,
      glossary: [
        { term: 'Cache-Control', meaning: 'Заголовок, который управляет тем, как и где можно кэшировать ответ (браузер, прокси, CDN).' },
        { term: 'ETag', meaning: 'Отпечаток версии ресурса для условных запросов (If-None-Match → 304).' },
        { term: 'Vary', meaning: 'Показывает, от каких заголовков зависит ответ, чтобы кэш различал варианты.' },
        { term: '304 Not Modified', meaning: 'Ответ без тела: ресурс не изменился, можно использовать кэшированное представление.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-rest-02',
      title: 'REST API: безопасность',
      simpleDefinitionOverride:
        'Безопасность REST — TLS, аутентификация, авторизация, валидация, rate limit и безопасные логи.',
      quickAnswer:
        'HTTPS, токены/сессии, роли, OWASP API Top 10, CORS без unsafe звёздочек с credentials.',
      explainBrief: [
        'Всегда TLS (HTTPS) в проде; без него токены и данные утекут в сети.',
        'Аутентификация отвечает на «кто ты», авторизация — «что тебе можно» (роли/скоупы).',
        'Валидация входа и ограничения размера тела/параметров — защита от мусора и DoS.',
        'Rate limiting и защита от brute force важны для публичных API.',
        'CORS настраивают осознанно: нельзя `*` вместе с credentials.',
        'Ошибки и логи не должны раскрывать секреты и внутренние детали (stacktrace, SQL, ключи).',
      ],
      extraKeyPoints: ['mTLS иногда для service-to-service.'],
      interviewFocus: [
        {
          question: 'Безопасность REST APIs.',
          expectedAnswer:
            'Только HTTPS в проде; аутентификация (bearer token/session) и авторизация по ролям/скоупам; валидация входных данных; rate limiting; корректные CORS; не логировать секреты; следовать практикам OWASP API Security.',
        },
      ],
      codeExample: {
        title: 'Секрет не в URL',
        language: 'text',
        snippet: `Плохо: /api?apiKey=...\nЛучше: Authorization: Bearer ...`,
        walkthrough: ['URL часто попадает в access-логи.'],
        commonPitfall: 'CORS: * + credentials.',
      },
      usefulLinksOverride: HTTP_LINKS,
      glossary: [
        { term: 'TLS', meaning: 'Шифрование трафика между клиентом и сервером (HTTPS).' },
        { term: 'OAuth2', meaning: 'Фреймворк делегирования доступа (часто вместе с OIDC для identity).' },
        { term: 'CORS', meaning: 'Политика браузера, которая ограничивает кросс-доменные запросы; сервер управляет заголовками Access-Control-*.' },
        { term: 'Rate limiting', meaning: 'Ограничение количества запросов за интервал времени, чтобы защищаться от злоупотребления.' },
      ],
      estimatedMinutes: 6,
    }),
    topic({
      id: 'int-stack-rest-03',
      title: 'REST: преимущества',
      simpleDefinitionOverride:
        'REST использует стандартный стек HTTP: методы, статусы, кэши — это упрощает интеграции и эксплуатацию.',
      quickAnswer:
        'Кэширование, stateless, прокси/CDN, простая отладка curl-ом, зрелая инфраструктура.',
      explainBrief: [
        'Преимущество — семантика HTTP (методы/статусы/заголовки), а не «JSON сам по себе».',
        'Stateless упрощает горизонтальное масштабирование и балансировку.',
        'Кэширование GET позволяет разгрузить бэкенд через браузер/прокси/CDN.',
        'Инструменты вокруг HTTP зрелые: прокси, rate limit, трассировка, мониторинг, дебаг через curl.',
        'Контракты удобно документировать (OpenAPI), а клиенты можно генерировать.',
      ],
      extraKeyPoints: ['OpenAPI описывает контракт, но не заменяет дизайн ресурсов.'],
      interviewFocus: [
        {
          question: 'Преимущества REST.',
          expectedAnswer:
            'Использует стандартные механизмы HTTP (методы, статусы, заголовки), хорошо кэшируется, проще масштабировать stateless-сервисы, проще мониторить и маршрутизировать через прокси/gateway, широкая поддержка инструментов.',
        },
      ],
      codeExample: {
        title: 'Кэш на GET',
        language: 'text',
        snippet: `GET /products/1\nCache-Control: public, max-age=60`,
        walkthrough: ['Публичные GET можно кэшировать на CDN.'],
        commonPitfall: 'Кэшировать некорректно персональные GET.',
      },
      usefulLinksOverride: HTTP_LINKS,
      glossary: [
        { term: 'Stateless', meaning: 'Сервер не хранит состояние клиента между запросами; всё нужное приходит в запросе.' },
        { term: 'Resource', meaning: 'Сущность, доступная по URI (например, /orders/42), с представлением в JSON/другом формате.' },
        { term: 'CDN', meaning: 'Сеть доставки контента: может кэшировать публичные GET и ускорять отдачу.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-rest-04',
      title: 'HTTP response: основные части',
      simpleDefinitionOverride:
        'HTTP-ответ состоит из статус-кода, набора заголовков и опционального тела с представлением ресурса.',
      quickAnswer:
        'Статус + заголовки (Content-Type, Cache-Control, Location…) + body; для 204 тела нет.',
      explainBrief: [
        'Статус-код говорит класс результата (2xx успех, 3xx редирект, 4xx ошибка клиента, 5xx ошибка сервера).',
        'Заголовки описывают метаданные ответа: тип, кэш, безопасность, cookies, корреляцию (например request-id).',
        'Тело содержит представление ресурса (например JSON) — но не всегда: 204 без тела.',
        'Content-Type и кодировка важны для корректного парсинга на клиенте.',
        'Location используется при 201 Created и редиректах, чтобы указать URI.',
      ],
      extraKeyPoints: ['HTTP/2 и HTTP/3 меняют транспорт, но статусы остаются.'],
      interviewFocus: [
        {
          question: 'Главные части HTTP response.',
          expectedAnswer:
            'Статус-код (2xx/3xx/4xx/5xx), заголовки ответа (например Content-Type, Cache-Control, Location, Set-Cookie) и тело (если применимо). Для 204 No Content тело отсутствует.',
        },
      ],
      codeExample: {
        title: '201 Created',
        language: 'text',
        snippet: `HTTP/1.1 201 Created\nLocation: /orders/42\nContent-Type: application/json`,
        walkthrough: ['Location указывает URI созданного ресурса.'],
        commonPitfall: 'Всегда отвечать 200 с ошибкой внутри JSON.',
      },
      usefulLinksOverride: HTTP_LINKS,
      glossary: [
        { term: 'Status code', meaning: 'Числовой код результата запроса (например 200, 404, 500).' },
        { term: 'Content-Type', meaning: 'Тип содержимого тела ответа (например application/json).' },
        { term: 'Location', meaning: 'Заголовок с URI созданного ресурса при 201 или целью редиректа при 3xx.' },
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-stack-rest-05',
      title: 'RESTful сервисы: HTTP методы',
      simpleDefinitionOverride:
        'Методы HTTP задают намерение над ресурсом: прочитать, создать, заменить, частично обновить, удалить.',
      quickAnswer:
        'GET read, POST create/action, PUT replace, PATCH partial update, DELETE delete; важны идемпотентность и корректные статусы.',
      explainBrief: [
        'GET/HEAD — безопасные методы: не должны менять состояние сервера.',
        'POST обычно создаёт ресурс в коллекции или запускает неидемпотентное действие.',
        'PUT — полная замена ресурса по URI (идемпотентен), PATCH — частичное обновление.',
        'DELETE — удаление (идемпотентен по смыслу, даже если второй раз ничего не удалит).',
        'OPTIONS используется для CORS preflight, а также для обнаружения возможностей endpoint.',
        'Правильные статусы помогают клиенту: 201/204, 400/404/409, 401/403 и т.д.',
      ],
      extraKeyPoints: ['POST не идемпотентен — важно для ретраев (ключи идемпотентности).'],
      interviewFocus: [
        {
          question: 'Использование HTTP методов для RESTful сервисов.',
          expectedAnswer:
            'GET для чтения, POST для создания или неидемпотентных действий, PUT для полной замены ресурса по URI, PATCH для частичного обновления, DELETE для удаления. Статусы согласую с операцией (200/201/204/409 и т.д.).',
        },
      ],
      codeExample: {
        title: 'Идемпотентность',
        language: 'text',
        snippet: `PUT/DELETE: повтор ≈ тот же эффект\nPOST: повтор может создать дубль`,
        walkthrough: ['Для POST нужны защиты от повторной доставки.'],
        commonPitfall: 'Использовать GET для изменения состояния.',
      },
      usefulLinksOverride: HTTP_LINKS,
      glossary: [
        { term: 'Safe method', meaning: 'Метод, который не должен менять состояние (GET/HEAD) — важно для кэшей и ретраев.' },
        { term: 'Idempotent', meaning: 'Повтор запроса не накапливает побочные эффекты сверх одного успеха.' },
        { term: 'PUT vs PATCH', meaning: 'PUT заменяет ресурс целиком, PATCH изменяет часть (по патчу/набору полей).' },
      ],
      estimatedMinutes: 5,
    }),
  ],
};
