import type { LectureModule } from './schema';
type Topic = LectureModule['topics'][number];
type LegacyTopicInput = {
  id: string;
  title: string;
  quickAnswer: string;
  explainBrief: string[];
  interviewFocus: Topic['interviewFocus'];
  codeExample: Topic['codeExample'];
  practiceHint?: {
    task: string;
    timeboxMinutes: number;
    expectedOutcome: string;
    mentorCheck: string;
  };
  lecturerNotes?: string[];
  estimatedMinutes: number;
  priority?: Topic['priority'];
};

function buildUsefulLinks(title: string): Topic['usefulLinks'] {
  const normalized = title.toLowerCase();
  if (normalized.includes('jvm') || normalized.includes('jre') || normalized.includes('jdk')) {
    return [
      {
        title: 'Oracle: JDK Tools',
        url: 'https://docs.oracle.com/javase/8/docs/technotes/tools/',
        description: 'Официальное описание инструментов JDK.',
      },
      {
        title: 'Baeldung: JVM Data Areas',
        url: 'https://www.baeldung.com/java-jvm-run-time-data-areas',
        description: 'Кратко и по делу про runtime-области JVM.',
      },
      {
        title: 'Inside Java',
        url: 'https://inside.java/',
        description: 'Новости и пояснения от команды Java Platform.',
      },
    ];
  }

  if (normalized.includes('string')) {
    return [
      {
        title: 'Oracle String API',
        url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html',
        description: 'Официальное API String и его методы.',
      },
      {
        title: 'Baeldung String Interview',
        url: 'https://www.baeldung.com/java-string-interview-questions',
        description: 'Частые вопросы по String и string pool.',
      },
      {
        title: 'Regex101',
        url: 'https://regex101.com/',
        description: 'Инструмент для проверки regex, полезен для split/replace.',
      },
    ];
  }

  if (normalized.includes('equals') || normalized.includes('object')) {
    return [
      {
        title: 'Oracle Object API',
        url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html',
        description: 'Контракт методов equals/hashCode/toString.',
      },
      {
        title: 'Baeldung equals/hashCode',
        url: 'https://www.baeldung.com/java-equals-hashcode-contracts',
        description: 'Практическое объяснение контракта с примерами.',
      },
      {
        title: 'IntelliJ Generate equals/hashCode',
        url: 'https://www.jetbrains.com/help/idea/generate-equals-and-hashcode-wizard.html',
        description: 'Как быстро и корректно генерировать методы в IDE.',
      },
    ];
  }

  return [
    {
      title: 'Oracle Java Tutorials',
      url: 'https://docs.oracle.com/javase/tutorial/',
      description: 'База по Core Java от официального источника.',
    },
    {
      title: 'Baeldung Java Interview',
      url: 'https://www.baeldung.com/java-interview-questions',
      description: 'Подборка типовых собес-вопросов с ответами.',
    },
    {
      title: 'JetBrains Java Guide',
      url: 'https://www.jetbrains.com/guide/java/',
      description: 'Практические статьи по Java и рабочему процессу.',
    },
  ];
}

function buildKnowledgeBoost(
  title: string,
): { keyPoints: string[]; mistakes: string[]; checks: string[]; traps: string[] } {
  const normalized = title.toLowerCase();

  if (normalized.includes('языки программирования')) {
    return {
      keyPoints: [
        'Классифицируй языки по типизации, модели исполнения и уровню абстракции.',
        'Компилируемые языки проверяют больше на этапе сборки, интерпретируемые — на этапе выполнения.',
        'Для enterprise важны не только скорость разработки, но и предсказуемость сопровождения.',
      ],
      mistakes: [
        'Сравнивать языки по принципу "нравится/не нравится", а не по задачам проекта.',
        'Путать компилируемый язык с "быстрым", а интерпретируемый с "медленным" без контекста.',
      ],
      checks: [
        'Есть понимание, почему Java часто выбирают для долгих проектов.',
      ],
      traps: [
        'Ловушка: "динамическая типизация всегда хуже". Корректно: зависит от контекста задачи.',
      ],
    };
  }

  if (normalized.includes('jvm') || normalized.includes('jre') || normalized.includes('jdk')) {
    return {
      keyPoints: [
        'JVM исполняет байткод и управляет памятью/потоками.',
        'JRE содержит JVM и библиотеки для запуска.',
        'JDK содержит JRE и инструменты разработки (javac и др.).',
      ],
      mistakes: [
        'Путать запуск приложения (JRE/JVM) и сборку проекта (JDK с компилятором javac).',
        'Считать, что для сборки достаточно одной JVM. Как правильно: для сборки нужен JDK, а не только JVM.',
      ],
      checks: [
        'Понятно, где нужен JDK, а где достаточно JRE/runtime.',
        'Понятна цепочка .java -> .class -> JVM.',
      ],
      traps: ['Ловушка: "JRE = JDK". Корректно: JDK шире и включает инструменты разработки.'],
    };
  }

  if (normalized.includes('области памяти') || normalized.includes('memory')) {
    return {
      keyPoints: [
        'Упрощенно: stack — для локальных переменных и вызовов методов.',
        'Heap хранит объекты; ссылки могут лежать в стеке.',
        'Metaspace хранит метаданные классов и заменил PermGen в Java 8.',
      ],
      mistakes: [
        'Говорить "объект хранится в стеке". Обычно в стеке ссылка, объект в heap.',
        'Путать StackOverflowError и OutOfMemoryError.',
      ],
      checks: [
        'Понятно, где лежит локальная переменная, где ссылка и где сам объект.',
        'Понятно, какая ошибка характерна для stack, а какая для heap/metaspace.',
      ],
      traps: ['Ловушка: "String всегда в string pool". Корректно: литералы — в pool, new String — отдельный объект.'],
    };
  }

  if (normalized.includes('class loader')) {
    return {
      keyPoints: [
        'Модель делегирования: сначала родительский загрузчик, потом текущий.',
        'Bootstrap загружает базовые классы платформы.',
        'Platform загружает стандартные модули Java поверх базовых (например, SQL, XML, логирование).',
        'Application loader загружает классы из classpath приложения: это список путей к вашим .class и зависимостям (например, target/classes и jar-файлы из Maven/Gradle).',
      ],
      mistakes: [
        'Игнорировать classpath (список путей, где JVM ищет ваши .class и jar) при разборе ClassNotFoundException и NoClassDefFoundError.',
      ],
      checks: [
        'Понятно, зачем нужна parent delegation с точки зрения безопасности и единообразия загрузки.',
        'На базовом уровне понятны причины ClassNotFoundException и NoClassDefFoundError.',
      ],
      traps: ['Ловушка: "класс всегда загружается текущим loader". Корректно: обычно через делегирование родителю.'],
    };
  }

  if (normalized.includes('equals') || normalized.includes('hashcode')) {
    return {
      keyPoints: [
        'Если equals возвращает true, hashCode должен совпадать.',
        'Нарушение контракта ломает HashMap/HashSet.',
        'Переопределять equals и hashCode нужно парой.',
      ],
      mistakes: [
        'Переопределить equals без hashCode.',
        'Использовать mutable поля в equals/hashCode без понимания последствий.',
      ],
      checks: [
        'Понятно, почему объекты «теряются» в hash-коллекциях при несогласованном hashCode.',
        'Известны свойства корректного equals: рефлексивность, симметрия, транзитивность, консистентность, сравнение с null.',
      ],
      traps: ['Ловушка: "достаточно equals". Корректно: для hash-коллекций нужен и hashCode.'],
    };
  }

  if (normalized === 'string' || normalized.includes('string pool') || normalized.includes('stringbuilder')) {
    return {
      keyPoints: [
        'String immutable: любая модификация возвращает новый объект.',
        'Литерал — текст в двойных кавычках в исходнике. JVM складывает литералы в string pool: один и тот же литерал в программе обычно даёт одну ссылку на один объект (не отдельную копию на каждое вхождение в коде), поэтому `"a" == "a"` чаще true.',
        '`new String("...")` создаёт новый объект в heap; с литералом из пула это разные ссылки, даже если символы совпадают.',
        'Для частых конкатенаций используют StringBuilder.',
      ],
      mistakes: [
        'Ожидать, что concat/replace изменят исходную строку на месте.',
        'Сравнивать строки через == вместо equals.',
      ],
      checks: [
        'Понятна разница между строковым литералом и `new String("...")`.',
        'Понятно, почему StringBuilder выгоднее в циклах, чем конкатенация.',
      ],
      traps: ['Ловушка: "StringBuffer всегда лучше". Корректно: нужен в специфичных потокобезопасных сценариях.'],
    };
  }

  if (normalized.includes('модификатор') || normalized.includes('private') || normalized.includes('public')) {
    return {
      keyPoints: [
        'На уровне top-level класса допустимы public и package-private.',
        'private ограничивает доступ классом, protected добавляет доступ наследникам.',
        'Принцип: минимально необходимая область видимости.',
      ],
      mistakes: ['Делать поля public "для простоты".', 'Неверно трактовать protected как "только наследники".'],
      checks: [
        'Умеем подобрать модификатор под требуемый доступ.',
        'Понятна разница между package-private и protected.',
      ],
      traps: ['Ловушка: "package-private == protected". Корректно: protected дает доступ наследникам из других пакетов.'],
    };
  }

  if (normalized.includes('конструктор') || normalized.includes('super') || normalized.includes('this')) {
    return {
      keyPoints: [
        'super(...) и this(...) должны быть первой строкой конструктора.',
        'Если в классе нет ни одного своего конструктора, компилятор добавляет конструктор без параметров с тем же модификатором доступа, что и класс; внутри него неявно вызывается `super()` родителя без аргументов.',
        '«По умолчанию» здесь значит: без вашей дополнительной логики — только инициализация полей значениями по умолчанию (нули, false, null) и вызов цепочки конструкторов вверх по иерархии.',
        'this(...) используют для цепочки конструкторов внутри класса.',
      ],
      mistakes: [
        'Ставить перед `super(...)` или `this(...)` любой код или присваивания полям экземпляра — компилятор это запрещает.',
        'Путать `this.поле` с `this(...)`: в одном конструкторе нельзя два вызова конструкторов — и `this(...)`, и `super(...)` со скобками (только один из них и только первой строкой). Присваивание `this.department = ...` после `super(...)` — это не вызов конструктора, а работа с полем, так можно.',
      ],
      checks: [],
      traps: ['Ловушка: "super можно вызвать где угодно в конструкторе". Корректно: только первой строкой.'],
    };
  }

  if (normalized.includes('nested') && normalized.includes('inner')) {
    return {
      keyPoints: [
        'Static nested — вспомогательный тип в «пространстве имён» внешнего класса: не держит ссылку на экземпляр Outer, создаётся без готового outer.',
        'Inner (не статический вложенный) — объект всегда привязан к конкретному экземпляру Outer и может использовать его поля/методы как свой контекст.',
      ],
      mistakes: [],
      checks: [],
      traps: [
        'Ловушка: "все вложенные классы одинаковые". Корректно: `static class` и просто `class` внутри Outer — разные правила и стоимость.',
      ],
    };
  }

  if (normalized.includes('абстрактные классы') || normalized.includes('интерфейс')) {
    return {
      keyPoints: [
        'Абстрактный класс может хранить общее состояние и реализацию.',
        'Интерфейс задает контракт; в Java можно реализовать несколько интерфейсов.',
        'Выбор зависит от задачи: общее поведение или общий контракт.',
      ],
      mistakes: ['Пытаться хранить экземплярное состояние в интерфейсе.', 'Использовать абстрактный класс без реальной общей логики.'],
      checks: [
        'Умеем обосновать выбор interface или abstract class.',
        'Понятно ограничение single inheritance для классов.',
      ],
      traps: ['Ловушка: "интерфейс всегда лучше". Корректно: не всегда, зависит от модели предметной области.'],
    };
  }

  if (normalized.includes('изменяем') || normalized.includes('неизменяем')) {
    return {
      keyPoints: [
        'Immutable-класс: private final поля, без сеттеров, полная инициализация в конструкторе.',
        'final class защищает от наследования с потенциальной мутацией.',
        'Для mutable-полей нужны defensive copies.',
      ],
      mistakes: ['Возвращать наружу внутренний mutable объект напрямую.', 'Считать, что final на ссылке делает объект immutable.'],
      checks: [
        'Известны базовые правила immutable-класса (final, без сеттеров, копии коллекций).',
        'Понятно, зачем immutable проще в многопоточности.',
      ],
      traps: ['Ловушка: "final List делает объект неизменяемым". Корректно: неизменяема ссылка, не содержимое списка.'],
    };
  }

  if (
    normalized.includes('связывание') &&
    (normalized.includes('статическ') || normalized.includes('динамическ'))
  ) {
    return {
      keyPoints: [],
      mistakes: [
        'Считать, что static-метод ведёт себя как override: вызов идёт по типу ссылки, «переопределение» static — это hiding.',
        'Ждать полиморфизм у полей: доступ к полю разрешается по типу объявления ссылки, не по классу реального объекта.',
      ],
      checks: [],
      traps: [
        'Ловушка: перегрузка (overload) и переопределение (override). Перегрузку выбирает компилятор по сигнатуре; override у instance-методов — виртуальный вызов по фактическому классу в runtime.',
      ],
    };
  }

  if (normalized.includes('наследование') || normalized.includes('ассоциация') || normalized.includes('переопределение')) {
    return {
      keyPoints: [
        'Наследование — отношение is-a, композиция/ассоциация — has-a.',
        'Переопределение дает полиморфизм и динамический dispatch.',
        'Static/final/private методы связываются статически, virtual методы — динамически.',
      ],
      mistakes: ['Использовать наследование ради повторного кода вместо композиции.', 'Путать override и overload.'],
      checks: [
        'Понятно, почему композицию часто предпочитают наследованию.',
        'Понятно, как фактический тип объекта влияет на вызов переопределенного метода.',
      ],
      traps: ['Ловушка: "static методы тоже переопределяются". Корректно: они скрываются, а не override.'],
    };
  }

  return {
    keyPoints: [],
    mistakes: [],
    checks: [],
    traps: [],
  };
}

function normalizeLine(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function uniqueLines(values: string[]): string[] {
  const visited = new Set<string>();
  return values.filter((item) => {
    const key = normalizeLine(item);
    if (visited.has(key)) {
      return false;
    }
    visited.add(key);
    return true;
  });
}

function clarifyTerminology(text: string): string {
  return text
    .replace(
      /\bparent delegation\b/gi,
      'parent delegation (сначала класс ищет родительский загрузчик, потом текущий)',
    )
    .replace(
      /\bcompile-time\b/gi,
      'compile-time (этап компиляции, когда код еще не запущен)',
    )
    .replace(
      /\bruntime\b/gi,
      'runtime (этап выполнения, когда приложение уже работает)',
    );
}

const simpleDefinitionsByTopicId: Record<string, string> = {
  'languages-overview':
    'Язык программирования — это формальный способ описать алгоритм для компьютера; языки обычно делят по трансляции, уровню абстракции и типизации. Java — отдельный интересный случай: исходник компилируется в байткод для JVM, а уже на машине JIT может превращать горячий код в нативный.',
  'jvm-jre-jdk':
    'JVM исполняет Java-байткод, JRE дает окружение для запуска, а JDK добавляет инструменты разработки (компилятор и утилиты).',
  'memory-areas':
    'Память JVM условно делят на области: stack для вызовов и локальных переменных, heap для объектов, metaspace для метаданных классов.',
  'classes-objects':
    'Класс описывает структуру и поведение, а объект — конкретный экземпляр этого класса с собственным состоянием.',
  'class-structure':
    'Структура класса — это набор полей, конструкторов и методов, через которые класс хранит состояние и выполняет логику.',
  fields:
    'Поля — это переменные класса, которые хранят состояние объекта или общее состояние класса, если поле static.',
  constructors:
    'Конструктор подготавливает объект к работе и задает ему валидное начальное состояние в момент создания.',
  'methods-overloading':
    'Метод — именованное поведение класса или объекта: список параметров, тело, при необходимости возвращаемый тип (у конструктора тип возвращаемого значения не задают). Для перегрузки компилятор смотрит на имя и типы параметров; один только другой возвращаемый тип новой перегрузкой не считается. Перегрузка — несколько методов с одним именем и разными списками параметров.',
  'init-blocks':
    'Блоки инициализации выполняют код при создании класса или объекта, когда этой логики недостаточно в полях и конструкторах.',
  'class-object':
    'Class — это объект с информацией о типе во время выполнения: имя класса, его поля, методы и конструкторы.',
  'class-loaders':
    'Загрузчики классов — это механизм JVM, который по шагам ищет класс и загружает его в память перед выполнением кода.',
  'modifiers-overview':
    'Модификаторы в Java задают правила: кто видит класс или метод, можно ли наследовать и можно ли менять состояние.',
  'static-final-abstract':
    'static связывает член с классом, final запрещает изменение или расширение, abstract задает неполную реализацию для наследников.',
  'access-modifiers':
    'Модификаторы доступа определяют, кто может видеть и вызывать член класса: только класс, пакет, наследники или весь код.',
  'property-setting':
    'Значения полей задают разными способами: конструктор (сразу валидный объект), сеттеры (меняют после создания), builder (много опциональных полей по имени), иногда статическую фабрику `of`/`create`. Выбор зависит от числа полей, обязательности, нужны ли неизменяемость и промежуточные «недособранные» состояния.',
  'abstract-vs-interface':
    'Интерфейс описывает контракт поведения, а абстрактный класс дополнительно может содержать общее состояние и базовую логику.',
  'mutable-immutable':
    'Изменяемый объект можно менять после создания, неизменяемый — нельзя, что упрощает безопасность и предсказуемость кода.',
  'inner-nested':
    'В Java вложенный класс (nested) объявляют внутри другого класса. Статический вложенный (`static class`) — отдельный тип, не привязанный к экземпляру внешнего класса. Не статический вложенный (inner class) — всегда привязан к конкретному объекту внешнего класса и неявно хранит на него ссылку.',
  'local-anonymous':
    'Локальные и анонимные классы нужны для короткой логики рядом с местом использования, без отдельного файла класса.',
  'object-class':
    'Object — корень иерархии типов в Java: любой класс неявно наследует Object и получает базовые методы (`equals`, `hashCode`, `toString`, `getClass` и др.). Ссылка типа `Object` может указывать на любой экземпляр; фактический класс смотрят через `getClass()` или `instanceof`.',
  'object-methods':
    'У `java.lang.Object` объявлены методы, которые есть у любого объекта: `getClass()`, `hashCode()`, `equals(Object)`, `toString()`, `clone()`, `finalize()` (устарел, с Java 9 помечен как deprecated for removal), `notify()`, `notifyAll()`, `wait()`, `wait(long)`, `wait(long, int)`. По назначению их обычно группируют: класс и сравнение (`getClass`, `hashCode`, `equals`), строка для логов (`toString`), копия объекта (`clone`), ожидание и пробуждение на мониторе этого объекта (`wait*` / `notify*`).',
  'equals-hashcode':
    'equals определяет логическое равенство объектов, а hashCode нужен, чтобы хэш-коллекции находили эти объекты без ошибок.',
  'clone-method':
    'В `Object` объявлен `protected Object clone() throws CloneNotSupportedException`. Реализация по умолчанию создаёт новый объект того же класса и копирует поля поверхностно (shallow): примитивы дублируются, ссылочные поля копируются как ссылки — вложенные объекты остаются общими с оригиналом, пока явно не сделать глубокое копирование (deep copy). Чтобы `super.clone()` не бросал `CloneNotSupportedException`, класс помечают маркерным интерфейсом `Cloneable` (у него нет методов). В наследнике `clone()` обычно переопределяют: `super.clone()`, затем при необходимости вручную дублируют вложенные изменяемые поля. В новом коде `clone` часто обходят из‑за хрупкости в иерархиях, checked-исключения и путаницы shallow/deep — предпочитают конструктор копирования, фабрику `copyOf` или mapper.',
  'oop-principles':
    'ООП — способ строить программу из объектов с ролями и ответственностью; обычно выделяют четыре опоры: инкапсуляция, абстракция, наследование и полиморфизм.',
  'inheritance-association':
    'Наследование выражает отношение "является", а ассоциация и композиция — отношение "использует" или "состоит из".',
  'method-overriding':
    'Переопределение позволяет наследнику изменить поведение родительского метода, сохранив тот же контракт вызова.',
  binding:
    'Связывание (binding) — это ответ на вопрос: «какой именно метод или поле сработает в этой строке кода?» Раннее (статическое) решение принимает компилятор по типу ссылки; позднее (динамическое) — для обычных instance-методов с override JVM при вызове смотрит на фактический класс объекта.',
  wrappers:
    'Wrapper-классы дают объектную форму примитивов, чтобы работать с коллекциями, generics и объектными API. При автоупаковке литерала в `Integer` вызывается `Integer.valueOf(int)`: для диапазона по умолчанию -128..127 JVM обычно возвращает уже созданные объекты из кеша, поэтому `==` между двумя `Integer` с одним и тем же значением из этого диапазона может дать true, а вне диапазона — почти всегда false; надёжно сравнивать значения через `equals`.',
  'string-class':
    'String — неизменяемый класс строк в Java: каждое изменение создает новую строку, а исходная не меняется.',
  'string-pool':
    'String pool — механизм интернирования строковых литералов: один и тот же текст в кавычках в коде обычно даёт одну ссылку на один объект `String`, а не много одинаковых объектов. Сами объекты `String` живут в heap; в HotSpot с Java 7 и пул литералов размещается в heap (до того часть реализаций держала его в PermGen).',
  'string-api':
    'String API — набор методов для поиска, разбиения, обрезки и замены текста в строках.',
  'string-builder-buffer':
    'StringBuilder и StringBuffer позволяют эффективно собирать строку по частям без создания лишних промежуточных объектов.',
};

function topic(input: LegacyTopicInput): Topic {
  const knowledge = buildKnowledgeBoost(input.title);
  const commonMistakes = uniqueLines(
    [input.codeExample.commonPitfall, ...knowledge.mistakes].filter((line) => line.trim().length > 0),
  );
  const finalCommonMistakes = uniqueLines(commonMistakes);

  const keyPoints = uniqueLines([
    ...knowledge.keyPoints,
  ]);

  const clarifiedQuickAnswer = clarifyTerminology(input.quickAnswer);
  const clarifiedExplainBrief = input.explainBrief.map((item) => clarifyTerminology(item));
  const clarifiedInterviewFocus = input.interviewFocus.map((item) => ({
    question: clarifyTerminology(item.question),
    expectedAnswer: clarifyTerminology(item.expectedAnswer),
  }));

  const selfCheck: string[] = [];

  const interviewTraps = uniqueLines([
    'Отвечают определением из учебника без примера из практики.',
    'Путают compile-time и runtime поведение (compile-time — проверка на этапе компиляции, runtime — поведение во время выполнения).',
    'Не различают "как работает" и "когда применять".',
    ...knowledge.traps,
  ]);

  const simpleDefinitionRaw = simpleDefinitionsByTopicId[input.id] ?? `${input.title} — ${input.explainBrief[0] ?? input.quickAnswer}`;
  const simpleDefinition = clarifyTerminology(simpleDefinitionRaw);

  return {
    id: input.id,
    title: input.title,
    priority: input.priority ?? 'core',
    simpleDefinition,
    quickAnswer: clarifiedQuickAnswer,
    explainBrief: clarifiedExplainBrief,
    keyPoints,
    commonMistakes: finalCommonMistakes,
    selfCheck,
    interviewFocus: clarifiedInterviewFocus,
    interviewTraps,
    codeExample: input.codeExample,
    usefulLinks: buildUsefulLinks(input.title),
    estimatedMinutes: input.estimatedMinutes,
  };
}

export const module1: LectureModule = {
  id: 'module-1',
  title: 'Module 1: Core Java Fundamentals',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  topics: [
    topic({
      id: 'languages-overview',
      title: 'Какие языки программирования бывают',
      quickAnswer:
        'Языки классифицируют по трансляции, уровню абстракции и типизации. Java — «гибрид»: компиляция в байткод + исполнение на JVM с JIT и сборкой мусора.',
      explainBrief: [
        'По трансляции: компилируемые (C, C++) и интерпретируемые (Python, JavaScript).',
        'По уровню абстракции: низкоуровневые (машинные/ассемблер) и высокоуровневые (Java, Python, Ruby).',
        'По типизации: статическая (Java, C#) и динамическая (JavaScript, Python).',
        'Также выделяют общецелевые, специализированные, визуальные и эзотерические языки.',
        'Java: `javac` переводит `.java` в байткод `.class`; JVM на старте может интерпретировать, а горячие участки JIT-компилятор превращает в машинный код — поэтому «компилируемая или интерпретируемая?» для Java ответ двусложный.',
        'Идея «написал один раз — запускай где угодно» опирается на JVM: один и тот же байткод на разных ОС, если стоит подходящая версия JVM (на практике всё равно проверяют версию Java и нативные зависимости).',
        'Вокруг JVM выросла экосистема: Kotlin, Scala, Groovy компилируются или работают на той же виртуальной машине; в enterprise важны LTS-релизы Java (долгая поддержка) и совместимость байткода между версиями.',
      ],
      interviewFocus: [
        {
          question: 'Что выигрывает проект от статической типизации?',
          expectedAnswer: 'Безопасный рефакторинг, раннее обнаружение ошибок и понятные контракты.',
        },
        {
          question: 'Почему Java часто выбирают для долгих enterprise-проектов?',
          expectedAnswer: 'Стабильный рантайм, зрелая экосистема и прогнозируемое поведение в проде.',
        },
        {
          question: 'Java — компилируемый или интерпретируемый язык?',
          expectedAnswer:
            'Исходник компилируется в байткод; дальше JVM исполняет его (часто с JIT). Удобно говорить «компиляция + виртуальная машина», а не выбирать одно слово.',
        },
      ],
      codeExample: {
        title: 'Три «лица» исполнения: скрипт, натив, Java + JVM',
        language: 'text',
        snippet: `# Python (интерпретируемый язык):
print("Hello, мир!")

/* C (компилируемый язык): */
#include <stdio.h>
int main() {
    printf("Hello, мир!");
    return 0;
}

// Java: сначала компиляция в байткод, потом запуск на JVM
//   javac Hello.java   →  Hello.class
//   java Hello         →  JVM грузит класс, JIT ускоряет горячий код
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, мир!");
    }
}`,
        walkthrough: [
          'Компилируемые языки переводятся в машинный код заранее (до запуска программы).',
          'Интерпретируемые языки исполняются шаг за шагом во время выполнения.',
          'Низкоуровневые ближе к железу, высокоуровневые абстрагируют детали реализации.',
          'При статической типизации часть ошибок ловится на этапе компиляции, при динамической — чаще в рантайме.',
          'У Java отдельный путь: не сразу машинный код конкретной ОС, а промежуточный байткод + абстракция JVM и автоматическая сборка мусора.',
        ],
        commonPitfall:
          'Выбирать язык только по скорости первого прототипа. Как правильно: смотреть на сопровождение, надежность, рынок специалистов и экосистему библиотек.',
      },
      practiceHint: {
        task: 'Два кейса для обсуждения: быстрый прототип и банковский сервис — выбрать язык и аргументировать.',
        timeboxMinutes: 5,
        expectedOutcome: 'Четкая аргументация выбора по критериям, а не "нравится/не нравится".',
        mentorCheck: 'Есть ссылка на типизацию, производительность и поддержку.',
      },
      lecturerNotes: [
        'С аутсорсом тема пересекается так: для заказчика важнее предсказуемость сопровождения, чем "модность" стека.',
        'Холивар «какой язык лучше» обычно не дает пользы группе.',
        'Факт для «вау»: на HotSpot JVM один и тот же метод со временем может исполняться быстрее «холодного» старта — JIT перекомпилирует горячие места с оптимизациями (инлайн, деоптимизация при смене предположений).',
        'Факт про экосистему: эталонная реализация — OpenJDK; дистрибутивы (Oracle, Temurin, Corretto, Zulu и др.) отличаются лицензией, патчами и поддержкой, а язык и байткод остаются совместимыми.',
        'Исторический штрих: изначально язык называли Oak, целились во встраиваемые устройства; к релизу 1995 года вышли к веб-апплетам и серверной разработке — отсюда акцент на переносимости и безопасности песочницы.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'jvm-jre-jdk',
      title: 'JVM, JRE, JDK',
      quickAnswer: 'JVM исполняет, JRE запускает, JDK разрабатывает.',
      explainBrief: [
        'JVM — виртуальная машина, исполняющая байткод.',
        'JRE = JVM + стандартные библиотеки для запуска.',
        'JDK = JRE + инструменты разработки (javac, javadoc, jcmd и т.д.).',
      ],
      interviewFocus: [
        {
          question: 'Можно ли собрать Maven-проект без JDK?',
          expectedAnswer: 'Нет, потому что компилятор javac и dev tools входят в JDK.',
        },
        {
          question: 'Почему приложение, собранное под Java 17, может не запуститься на JVM 11?',
          expectedAnswer:
            'Потому что байткод с target/release 17 требует JVM 17+; более старая JVM не понимает этот формат class-файлов.',
        },
      ],
      codeExample: {
        title: 'Проверка среды выполнения',
        language: 'java',
        snippet: `System.out.println(System.getProperty("java.version"));
System.out.println(System.getProperty("java.vm.name"));`,
        walkthrough: [
          'В выводе видны разные свойства: версия языка/рантайма и имя конкретной JVM.',
          'Их удобно сравнивать, когда одно и то же приложение ведет себя по-разному на разных машинах.',
        ],
        commonPitfall:
          'Смешивать "версию языка" и "версию JVM". Как правильно: версия языка определяет доступный синтаксис, версия JVM — среду выполнения байткода. Пример: проект на Java 17 компилируют как release 17 и запускают на JVM 17+; на JVM 11 такой байткод не запустится.',
      },
      practiceHint: {
        task: 'Устно или на доске пройти цепочку: .java -> .class -> запуск JVM.',
        timeboxMinutes: 5,
        expectedOutcome: 'Четкая последовательность из трех шагов без путаницы терминов.',
        mentorCheck: 'Упомянут компилятор javac и запуск через JVM.',
      },
      lecturerNotes: [
        'Хорошо заходит аналогия: JDK как "цех", JRE как "готовое рабочее место".',
        'Упомяни, что после Java 9 поставки и дистрибутивы изменились.',
      ],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'memory-areas',
      title: 'Области памяти в Java',
      quickAnswer:
        'Память JVM условно делят на области: stack для вызовов и локальных переменных, heap для объектов, metaspace для метаданных классов.',
      explainBrief: [
        'Stack: локальные переменные и вызовы методов. Пример: int n = 1; String s = "hi"; (в стеке лежат переменные и ссылки).',
        'Heap: сами объекты. Пример: User user = new User(); (объект User создается в heap).',
        'Metaspace: метаданные загруженных классов. Пример: описание класса User (имя, поля, методы) хранится в metaspace.',
        'Память heap обычно настраивают флагами: -Xms (стартовый размер) и -Xmx (максимальный размер).',
      ],
      interviewFocus: [
        {
          question: 'Чем StackOverflowError отличается от OutOfMemoryError?',
          expectedAnswer: 'Первый про переполнение стека вызовов, второй чаще про нехватку heap/metaspace.',
        },
        {
          question: 'Где хранится ссылка на объект?',
          expectedAnswer: 'Ссылка как локальная переменная в стеке, сам объект в heap.',
        },
        {
          question: 'Что задают параметры -Xms и -Xmx?',
          expectedAnswer: '-Xms задает стартовый размер heap, -Xmx задает верхний предел heap.',
        },
      ],
      codeExample: {
        title: 'Stack, heap и настройка памяти JVM',
        language: 'java',
        snippet: `// java -Xms512m -Xmx2g -jar app.jar
int count = 1;                    // stack
String text = new String("x");    // ссылка в stack, объект в heap`,
        walkthrough: [
          '`new` всегда создает объект в heap.',
          'У примитива в переменной хранится значение, у ссылочного типа — ссылка на объект в heap.',
          'Флаги -Xms и -Xmx задают размер heap и влияют на поведение под нагрузкой.',
        ],
        commonPitfall: 'Ставить слишком маленький -Xmx и получать OutOfMemoryError под реальной нагрузкой.',
      },
      practiceHint: {
        task: 'Пять переменных разной природы — для каждой указать stack, heap или metaspace.',
        timeboxMinutes: 5,
        expectedOutcome: 'Минимум 4 из 5 классифицированы правильно.',
        mentorCheck: 'Корректно различаются примитив, ссылка и объект в heap.',
      },
      lecturerNotes: [
        'Хороший пример для экрана: StackOverflowError из-за бесконечной или слишком глубокой рекурсии.',
        'Не усложняй темой JMM на первом модуле.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'class-loaders',
      title: 'Class Loaders. Виды, для чего нужны',
      quickAnswer:
        'В Java класс загружается по цепочке: сначала проверяются системные загрузчики, и только потом — загрузчик приложения. Это защищает от подмены базовых классов.',
      explainBrief: [
        'ClassLoader ищет байткод класса, загружает его в JVM и делает класс доступным для выполнения.',
        'Обычно участвуют три уровня: Bootstrap (ядро Java), Platform (модули платформы), Application (ваш код).',
        'Если класс не найден по цепочке загрузки, появляются ошибки вида ClassNotFoundException или NoClassDefFoundError.',
      ],
      interviewFocus: [
        {
          question: 'Почему String.class.getClassLoader() возвращает null?',
          expectedAnswer: 'Потому что String загружает Bootstrap loader, а в Java API он отображается как null.',
        },
        {
          question: 'Зачем нужна parent delegation model?',
          expectedAnswer: 'Чтобы сначала доверять родительскому загрузчику: это снижает риск подмены классов и дублирующей загрузки.',
        },
      ],
      codeExample: {
        title: 'Просмотр загрузчика класса',
        language: 'java',
        snippet: `System.out.println(String.class.getClassLoader()); // null
System.out.println(ClassLoader.getSystemClassLoader()); // jdk.internal.loader.ClassLoaders$AppClassLoader@...`,
        walkthrough: [
          'Первая строка показывает: базовые классы Java грузятся Bootstrap loader (в API это null).',
          'Во второй строке обычно будет не null, а объект системного загрузчика: AppClassLoader@...',
          'Этот загрузчик работает с classpath (списком путей к .class и jar).',
        ],
        commonPitfall: 'Путать роли Bootstrap, Platform и Application loader.',
      },
      practiceHint: {
        task: 'Словами описать путь загрузки пользовательского класса по цепочке загрузчиков.',
        timeboxMinutes: 5,
        expectedOutcome: 'Четко объяснена цепочка: родительские загрузчики -> загрузчик приложения.',
        mentorCheck: 'Есть слова bootstrap/platform/application.',
      },
      lecturerNotes: [
        'Связка с практикой: Spring Boot fat jar и classpath — откуда JVM берет классы приложения.',
        'Custom class loaders на первом часе достаточно упомянуть вскользь.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'class-object',
      title: 'Объект класса Class',
      quickAnswer: 'Class<?> содержит runtime-метаданные типа.',
      explainBrief: [
        'У каждого загруженного типа есть объект Class.',
        'Через Class получают имя, методы, поля и конструкторы.',
        'Class.forName("полное.имя.Класса") загружает класс по строке с именем, если он есть на classpath.',
        'Это основа reflection, DI и сериализации.',
      ],
      interviewFocus: [
        {
          question: 'Как получить Class?',
          expectedAnswer:
            'Три способа: `String.class` (литерал), `obj.getClass()` (у уже созданного объекта), `Class.forName("java.lang.String")` (по строке с полным именем класса).',
        },
        {
          question: 'Зачем Class.forName()?',
          expectedAnswer:
            'Это вызов вида `Class.forName("com.example.Service")`: JVM находит класс на classpath по строке с именем, загружает его и отдает `Class`. Нужен, когда имя класса приходит не из кода, а из конфига, плагина или API (класс заранее не прописан в исходниках).',
        },
      ],
      codeExample: {
        title: 'Базовая рефлексия',
        language: 'java',
        snippet: `Class<?> type = String.class;
System.out.println(type.getName()); // java.lang.String`,
        walkthrough: [],
        commonPitfall: 'Путать Class с "классом как исходником .java".',
      },
      practiceHint: {
        task: 'Получить Class для ArrayList тремя способами: .class, getClass(), forName().',
        timeboxMinutes: 5,
        expectedOutcome: 'Три рабочих способа и понимание, чем они отличаются.',
        mentorCheck: 'Есть .class, getClass(), forName.',
      },
      lecturerNotes: ['Reflection дает гибкость, но обычно дороже и слабее по проверкам типов, чем обычный код.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'classes-objects',
      title: 'Классы и объекты',
      quickAnswer: 'Класс — шаблон, объект — экземпляр с конкретным состоянием.',
      explainBrief: [
        'Класс описывает поля и поведение.',
        'Объект хранит конкретные значения этих полей.',
        'Один класс может породить много объектов с разным state.',
      ],
      interviewFocus: [
        { question: 'Что создается при new?', expectedAnswer: 'Новый объект в heap и ссылка на него.' },
      ],
      codeExample: {
        title: 'Инстанцирование',
        language: 'java',
        snippet: `class User { String name; }
User first = new User();`,
        walkthrough: [
          'Переменная `first` хранит ссылку на объект `User` в heap.',
          'У полей экземпляра до явной инициализации стоят значения по умолчанию: ссылочные типы — `null`, числовые примитивы — ноль, `boolean` — `false`.',
        ],
        commonPitfall: 'Считать, что "переменная = объект".',
      },
      practiceHint: {
        task: 'Создать класс Product и два объекта с разными значениями.',
        timeboxMinutes: 5,
        expectedOutcome: 'Понимание, что поведение общее, состояние разное.',
        mentorCheck: 'Два независимых экземпляра, не одна переиспользуемая ссылка.',
      },
      lecturerNotes: ['В отладчике удобно увидеть разницу между ссылкой в переменной и объектом в heap.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'class-structure',
      title: 'Структура класса',
      quickAnswer: 'Минимальный полезный класс: поля, конструктор, методы, инварианты.',
      explainBrief: [
        'Хорошая структура класса уменьшает количество ошибок в будущем.',
        'Инварианты лучше фиксировать в конструкторе.',
        'Скрывай детали через модификаторы доступа.',
      ],
      interviewFocus: [
        { question: 'Почему поля чаще private?', expectedAnswer: 'Чтобы контролировать доступ и валидировать изменения.' },
        { question: 'Где лучше проверять инварианты?', expectedAnswer: 'В конструкторе и методах, меняющих состояние.' },
      ],
      codeExample: {
        title: 'Скелет доменного класса',
        language: 'java',
        snippet: `class Account {
  private final String id;
  Account(String id) {
    if (id == null || id.trim().isEmpty()) {
      throw new IllegalArgumentException("id обязателен");
    }
    this.id = id;
  }
}`,
        walkthrough: [
          '`final` у `id`: значение задаётся один раз и дальше не переприсваивается.',
          'Инвариант «id обязателен и не пустой (после trim)» проверяется в конструкторе: иначе выбрасывается исключение.',
        ],
        commonPitfall: 'Оставлять публичные поля и терять контроль над состоянием.',
      },
      practiceHint: {
        task: 'Переделать плохой класс с public-полями в инкапсулированный.',
        timeboxMinutes: 5,
        expectedOutcome: 'Поля скрыты, создание через конструктор.',
        mentorCheck: 'Нет public mutable полей.',
      },
      lecturerNotes: ['На первом проходе достаточно «ручного» Java без Lombok.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'fields',
      title: 'Поля',
      quickAnswer:
        'Поле объявляют в классе: оно хранит состояние объекта или (если `static`) общие данные класса. Локальная переменная — внутри метода или блока: живёт только на время его выполнения и не задаёт состояние объекта.',
      explainBrief: [
        'Поля бывают instance и static.',
        'Instance-поля уникальны для каждого объекта.',
        'Static-поля общие для класса.',
      ],
      interviewFocus: [
        {
          question: 'Что будет, если static поле mutable?',
          expectedAnswer:
            'У `static`-поля один экземпляр на весь класс (общий для всех объектов и для всего кода, который к нему обращается). Если его можно менять, любая часть программы может перезаписать значение — получается скрытая связь между модулями. В одном потоке это даёт неочевидные побочные эффекты; в нескольких потоках два одновременных изменения без синхронизации дают гонки данных и «ломают» инварианты (счётчики, кэши, флаги).',
        },
        { question: 'Чем final поле полезно?', expectedAnswer: 'Помогает сделать состояние неизменяемым.' },
      ],
      codeExample: {
        title: 'Instance и static поле',
        language: 'java',
        snippet: `class Counter {
  static int total;
  int current;
}`,
        walkthrough: ['current у каждого объекта свой.', 'total общий на все экземпляры класса.'],
        commonPitfall:
          'Путать поле класса с локальной переменной в методе; держать в `static` изменяемое состояние «для удобства» — оно общее на процесс и легко ломает инварианты.',
      },
      practiceHint: {
        task: 'Сделать класс Session с instance id и static count.',
        timeboxMinutes: 4,
        expectedOutcome: 'Понимание разницы instance/static на примере.',
        mentorCheck: 'Корректная инкрементация общего счетчика.',
      },
      lecturerNotes: ['Сильный пример: Spring singleton-bean с изменяемым общим состоянием.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'constructors',
      title: 'Конструкторы (ключевые слова super и this)',
      quickAnswer: 'this() вызывает другой конструктор этого класса, super() — родительский.',
      explainBrief: [
        'Конструктор гарантирует валидное начальное состояние.',
        'Вызов `super(...)` или `this(...)` (именно скобки — вызов другого конструктора) должен быть первой строкой; `this.поле = ...` к этому не относится.',
        'Цепочки конструкторов убирают дублирование инициализации.',
        'Если конструкторы не писать, компилятор создаёт конструктор без параметров: он вызывает `super()` без аргументов, а поля получают обычные значения по умолчанию.',
      ],
      interviewFocus: [
        {
          question: 'Можно ли вызвать и this(), и super() в одном конструкторе?',
          expectedAnswer:
            'Нет, если речь о `this(...)` и `super(...)` — вызовах конструктора: допустим только один такой вызов и только первой строкой. `this.department = x` после `super(...)` — не вызов конструктора, а поле; с `super` в одном конструкторе так нормально.',
        },
        { question: 'Когда компилятор вставляет super() сам?', expectedAnswer: 'Если явно не указан вызов this()/super().' },
      ],
      codeExample: {
        title: 'super(), this() и порядок вызова',
        language: 'java',
        snippet: `class Person {
  private final String name;
  Person(String name) {
    this.name = name;
  }
}

class Employee extends Person {
  private final String department;
  // Удобный конструктор делегирует «главному» через this(...) — это первая строка.
  Employee(String name) {
    this(name, "UNKNOWN");
  }
  // Здесь первая строка — super(...): сначала собирается родитель, потом поля наследника.
  Employee(String name, String department) {
    super(name);
    this.department = department;
  }
}

// Если бы у Person был только конструктор с параметром, а у Employee не было бы
// ни одного конструктора — компилятор не смог бы добавить дефолтный Child():
// не из чего вызвать super() без аргументов.`,
        walkthrough: [
          '`Employee(String name)` первой строкой вызывает `this(name, "UNKNOWN")` — цепочка конструкторов внутри класса.',
          '`Employee(String name, String department)` первой строкой вызывает `super(name)` — сначала инициализируется `Person`, затем поле `department`.',
          'Правило «либо `this(...)`, либо `super(...)`» про вызов конструктора со скобками, не про `this.поле`. В примере сначала `super(name)`, потом присваивание полю наследника — один вызов конструктора родителя, без второго `this(...)` или `super(...)`.',
          'Неявный `super()` без аргументов компилятор подставляет только если у родителя есть доступный no-arg конструктор.',
        ],
        commonPitfall:
          'Писать любой код до первого `super(...)` или `this(...)`; пытаться вызвать оба как конструкторы в одном теле — разрешён только один такой вызов и только первой строкой.',
      },
      practiceHint: {
        task: 'Сделать иерархию Person -> Employee с корректным super().',
        timeboxMinutes: 6,
        expectedOutcome: 'Нет дублирования полей и корректная передача параметров.',
        mentorCheck: 'super вызван первым, поля не дублируются.',
      },
      lecturerNotes: ['Ошибка компиляции в этом примере — хороший наглядный момент.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'methods-overloading',
      title: 'Методы (сигнатура методов, перегрузка методов)',
      quickAnswer:
        'Перегрузки различаются только списком параметров: при одинаковых параметрах два return type не скомпилируются — компилятор не знает, какой метод вызвать.',
      explainBrief: [
        'Метод объявляют в классе: модификаторы, имя, параметры, тело; вызов передаёт аргументы и при необходимости использует возвращаемое значение.',
        'В контексте перегрузки важны имя метода и типы параметров (включая порядок и varargs); имена параметров и возвращаемый тип на выбор варианта не влияют.',
        'Перегрузка уместна, когда операция одна по смыслу, а входы разного вида; если смыслы разные, часто читаемее другое имя метода или один метод с параметром-объектом (DTO, options).',
        'Если подходит больше одной перегрузки без однозначного лучшего совпадения, компилятор выдаёт ошибку неоднозначного вызова.',
      ],
      interviewFocus: [
        { question: 'Можно ли перегрузить метод только по return type?', expectedAnswer: 'Нельзя.' },
        { question: 'Когда overloading вреден?', expectedAnswer: 'Когда вызовы становятся неоднозначными и читаемость падает.' },
      ],
      codeExample: {
        title: 'Перегрузка и выбор на этапе компиляции',
        language: 'java',
        snippet: `int sum(int a, int b) { return a + b; }
int sum(int a, int b, int c) { return a + b + c; }

// Компилятор выбирает перегрузку по типам аргументов при вызове:
// sum(1, 2) → двухаргументная; sum(1, 2, 3) → трёхаргументная.
// Разный только return type без смены параметров — не компилируется.`,
        walkthrough: [
          'Перегрузка (overload): одно имя, разные списки параметров; какой метод вызвать, компилятор решает по сигнатуре вызова.',
          'Возвращаемый тип на этот выбор не влияет — иначе вызов нельзя было бы однозначно разобрать.',
          'Если подходят две перегрузки без явного лучшего совпадения — ошибка ambiguous call.',
        ],
        commonPitfall:
          'Строить перегрузки, из-за которых вызов неоднозначен, или пытаться «перегрузить» только возвращаемым типом.',
      },
      practiceHint: {
        task: 'Перегрузить метод parse: String и String+radix.',
        timeboxMinutes: 5,
        expectedOutcome: 'Обе версии работают и не конфликтуют.',
        mentorCheck: 'Понятно, что возвращаемый тип не входит в сигнатуру перегрузки.',
      },
      lecturerNotes: ['На собесе часто дают ловушку "return type".'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'init-blocks',
      title: 'Статические и нестатические блоки инициализации',
      quickAnswer: 'static блок — один раз на класс, instance блок — каждый раз на объект.',
      explainBrief: [
        'Static блок используют для тяжелой инициализации класса.',
        'Instance блок выполняется перед телом конструктора.',
        'В production чаще встречается static блок, чем instance блок.',
      ],
      interviewFocus: [
        { question: 'Что выполняется раньше: instance блок или конструктор?', expectedAnswer: 'Сначала instance block, потом конструктор.' },
        { question: 'Зачем static block вообще нужен?', expectedAnswer: 'Для одноразовой подготовки class-level состояния.' },
      ],
      codeExample: {
        title: 'Блоки в теле класса (не внутри метода)',
        language: 'java',
        snippet: `class Demo {
  static {
    // Уровень класса: выполняется один раз, когда класс впервые подгружают в JVM
    System.out.println("static block");
  }

  {
    // Уровень класса: перед КАЖДЫМ конструктором при каждом new Demo()
    System.out.println("instance block");
  }

  Demo() {
    System.out.println("constructor");
  }
}

// Demo a = new Demo();
// Demo b = new Demo();
// static block — один раз; дальше для a и b: instance → constructor`,
        walkthrough: [
          'Статический и инстанс-блок пишут только в теле класса (как поля и методы), не внутри метода — там это уже другой синтаксис и смысл.',
          'При первом обращении к классу JVM выполняет static-блок ровно один раз на процесс загрузки класса.',
          'При каждом `new Demo()` сначала отрабатывают все instance-блоки и инициализаторы полей в порядке объявления, затем выбранный конструктор.',
        ],
        commonPitfall: 'Делать в static блоке сетевые вызовы и получать медленный старт приложения.',
      },
      practiceHint: {
        task: 'Сделать класс с static счетчиком и instance логированием.',
        timeboxMinutes: 4,
        expectedOutcome: 'Понимание, что static выполняется ровно один раз.',
        mentorCheck: 'Порядок вывода объяснен правильно.',
      },
      lecturerNotes: ['Instance-блоки достаточно упомянуть кратко, без перегруза деталями.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'modifiers-overview',
      title: 'Модификаторы',
      quickAnswer: 'Модификаторы отвечают за три вещи: видимость, возможность наследования и возможность изменения.',
      explainBrief: [
        'Модификаторы доступа (`public`, `protected`, package-private, `private`) задают, кто может вызывать код.',
        'Модификаторы `final` и `abstract` задают правила расширения: можно ли наследовать и нужно ли реализовывать метод.',
        'Главное практическое правило: давать минимально необходимую видимость, чтобы не раскрывать лишнее API.',
      ],
      interviewFocus: [
        {
          question: 'Какой модификатор допустим у top-level класса?',
          expectedAnswer: 'Только `public` или package-private, потому что `private` и `protected` к top-level не применяются.',
        },
        {
          question: 'Можно ли переопределить private-метод?',
          expectedAnswer: 'Нет. `private`-метод виден только внутри своего класса и не участвует в полиморфизме.',
        },
      ],
      codeExample: {
        title: 'Модификаторы в одном месте',
        language: 'java',
        snippet: `public final class Config {
  private int retries;
}`,
        walkthrough: [
          '`final` на классе запрещает наследование, значит поведение класса нельзя изменить через extends.',
          '`private` на поле оставляет контроль внутри класса: внешние классы не могут менять состояние напрямую.',
        ],
        commonPitfall: 'Ставить public "на всякий случай".',
      },
      practiceHint: {
        task: 'Класс с завышенной видимостью — подобрать минимально достаточные модификаторы.',
        timeboxMinutes: 5,
        expectedOutcome: 'Минимально необходимая видимость.',
        mentorCheck: 'Нет лишнего public.',
      },
      lecturerNotes: ['Хорошо заходит правило: "минимально возможная видимость".'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'static-final-abstract',
      title: 'static, final, abstract',
      quickAnswer:
        '`static` — член класса, не экземпляра. `final` у поля/переменной — одна инициализация; у метода — нельзя override; у класса — нельзя наследовать. `abstract` — метод без тела или класс с неполной реализацией, наследники обязаны дореализовать.',
      explainBrief: [
        '`static`: поле или метод живут на уровне типа; к ним обращаются как `Type.member`, общее состояние не дублируется на каждый `new`.',
        '`final` на поле экземпляра: присвоить можно один раз (часто в конструкторе); на классе: запрет наследования; на методе: запрет переопределения.',
        '`abstract` на методе: сигнатура без реализации; на классе: нельзя создать `new` напрямую, пока не сделан конкретный подкласс.',
        'Сочетания: `static final` — константа времени класса; `abstract` и `final` на одном методе несовместимы.',
      ],
      interviewFocus: [
        { question: 'Можно ли abstract метод сделать final?', expectedAnswer: 'Нельзя, это противоречащие требования.' },
        { question: 'Можно ли final класс расширить?', expectedAnswer: 'Нельзя.' },
      ],
      codeExample: {
        title: 'static + final + abstract в одном примере',
        language: 'java',
        snippet: `class Limits {
  static final int MAX_RETRIES = 3;

  static int clamp(int n) {
    return Math.min(n, MAX_RETRIES);
  }
}

abstract class Report {
  abstract void export();

  final void audit() {
    // шаблонный шаг: наследник не переопределяет
  }
}

final class PdfReport extends Report {
  @Override
  void export() { /* ... */ }
}`,
        walkthrough: [
          '`static final MAX_RETRIES` — одна константа на класс `Limits`, без привязки к экземпляру.',
          '`static clamp` вызывается как `Limits.clamp(x)`; внутри видна `static`-константа.',
          '`abstract export` обязан появиться с телом в `PdfReport`.',
          '`final class PdfReport` — дальше наследовать нельзя; `final audit` в базе нельзя переопределить в наследнике.',
        ],
        commonPitfall: 'Пытаться использовать abstract там, где нужен интерфейсный контракт.',
      },
      practiceHint: {
        task: 'Спроектировать Payment API: где interface, где abstract class, где final.',
        timeboxMinutes: 6,
        expectedOutcome: 'Аргументированный выбор модификаторов.',
        mentorCheck: 'Пояснены причины каждого выбора.',
      },
      lecturerNotes: ['Контрпример: final-класс мешает подмене в тестах без обходных приемов.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'access-modifiers',
      title: 'private, protected, public, package private',
      quickAnswer: 'Используй самый узкий модификатор, который решает задачу.',
      explainBrief: [
        'public — доступно всем.',
        'protected — пакет + наследники.',
        'package-private — только пакет; private — только класс.',
      ],
      interviewFocus: [
        { question: 'Видит ли класс из другого пакета package-private метод?', expectedAnswer: 'Нет.' },
        { question: 'Что дает protected кроме package-private?', expectedAnswer: 'Доступ в наследниках за пределами пакета.' },
      ],
      codeExample: {
        title: 'Четыре модификатора на членах класса',
        language: 'java',
        snippet: `// У top-level класса свой модификатор; здесь — public, чтобы тип видели из других пакетов.
public class Account {

  private void onlyHere() {
    // только этот класс
  }

  void samePackageOnly() {
    // package-private: любой класс из того же пакета, не извне
  }

  protected void heirsAndPackage() {
    // этот пакет + наследники Account из ЛЮБЫХ пакетов
  }

  public void everyone() {
    // откуда угодно, где есть ссылка на Account
  }

  void demoInside() {
    onlyHere();
    samePackageOnly();
    heirsAndPackage();
    everyone();
  }
}`,
        walkthrough: [
          'Сужаем круг: `private` < package (без слова) < `protected` < `public`. Внутри одного класса все четыре метода видны — поэтому `demoInside` их вызывает.',
          '`protected` шире package: наследник в другом пакете увидит `heirsAndPackage`, а `samePackageOnly` — уже нет.',
          'Модификатор у самого класса (`public class` vs `class` без слова) — отдельное правило: кто вообще может ссылаться на тип, не путать с доступом к полям/методам.',
        ],
        commonPitfall: 'Неверно понимать protected как "только наследники".',
      },
      practiceHint: {
        task: 'Разложить 6 методов по модификаторам под заданные требования доступа.',
        timeboxMinutes: 5,
        expectedOutcome: 'Корректно подобранные модификаторы.',
        mentorCheck: 'Нет "public по умолчанию".',
      },
      lecturerNotes: ['Таблица видимости public/protected/package/private хорошо заходит на слайде или доске.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'property-setting',
      title: 'Варианты установки значений свойств объектов',
      quickAnswer:
        'Обязательное и инварианты чаще запирают в конструктор (или в `build()`). Пошаговые изменения после создания — сеттеры (ценой мутабельности и «дыр» между вызовами). Много полей и опционалов — builder. Именованные входы без огромного списка аргументов — статическая фабрика `of`/`from`.',
      explainBrief: [
        'Конструктор: + объект сразу в консистентном состоянии, удобно для `final` полей и неизменяемости; − при 5+ параметрах легко перепутать порядок (telescoping constructor), читать тяжело.',
        'Сеттеры: + гибко дополнять и менять после `new`, дружат с фреймворками вроде Jackson/JavaBeans; − между вызовами объект может быть невалиден, сложнее рассуждать о потоках, инварианты надо дублировать в каждом сеттере.',
        'Builder: + вызов читается по именам полей, удобно смешивать обязательные и опциональные, в `build()` один раз проверяешь инварианты; − больше шаблонного кода (или Lombok `@Builder`).',
        'Статическая фабрика (`User.of(...)`, `Money.euros(...)`) — + короткие осмысленные имена вместо «голого» конструктора, можно спрятать сложность или кеш; − это отдельный публичный API, который тоже нужно поддерживать.',
      ],
      interviewFocus: [
        {
          question: 'Когда сеттеры опасны?',
          expectedAnswer:
            'Когда нужен неизменяемый или всегда валидный объект: между сеттерами состояние «обрезано», инварианты нарушены; в многопоточности гонки, если mutable.',
        },
        {
          question: 'Чем builder лучше длинного конструктора?',
          expectedAnswer:
            'Именованные шаги, не путаешь порядок семи `String`, опциональные поля опускаешь; финальная проверка в `build()`.',
        },
        {
          question: 'Зачем статическая фабрика вместо `new`?',
          expectedAnswer:
            'Имя метода объясняет намерение, можно вернуть подтип или закешированный экземпляр, спрятать сложный конструктор.',
        },
      ],
      codeExample: {
        title: 'Три способа: конструктор, сеттеры, builder',
        language: 'java',
        snippet: `// 1) Конструктор — всё обязательное сразу, объект готов после new
User u1 = new User("alex", Role.INTERN);

// 2) Сеттеры — по шагам; между строками объект может быть ещё «недособран»
User u2 = new User();
u2.setLogin("alex");
u2.setRole(Role.INTERN); // до setRole логин есть, роли нет — валиден ли заказ?

// 3) Builder — имена полей в цепочке, проверки обычно в build()
User u3 = User.builder().login("alex").role(Role.INTERN).build();

// Дополнительно часто: фабрика вместо голого new
// User u4 = User.registered("alex", Role.INTERN);`,
        walkthrough: [
          'Конструктор: один вызов — одна точка, где можно проверить все обязательные поля вместе.',
          'Сеттеры: каждый вызов меняет кусочек состояния; риск «полупустого» объекта, пока цепочка не закончена.',
          'Builder: клиентский код самодокументируется; «закрываешь» создание в `build()` так же, как конструктором.',
          'Фабрика — вариант API поверх конструктора/builder, когда имя метода важнее, чем вид `new`.',
        ],
        commonPitfall: 'Открывать сеттеры на обязательные поля.',
      },
      practiceHint: {
        task: 'Дан DTO из 6 полей: выбрать подход и объяснить почему.',
        timeboxMinutes: 5,
        expectedOutcome: 'Осознанный выбор, а не шаблонный.',
        mentorCheck: 'Проговорены обязательные и опциональные поля.',
      },
      lecturerNotes: ['Пересекается с валидацией в сервисе и инвариантами доменной модели.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'abstract-vs-interface',
      title: 'Абстрактные классы и интерфейсы',
      quickAnswer: 'Интерфейс — контракт, абстрактный класс — контракт + общая реализация.',
      explainBrief: [
        'Интерфейс задает роль/поведение.',
        'Абстрактный класс полезен, когда есть общая логика и состояние.',
        'В Java можно реализовать много интерфейсов, но наследовать только один класс.',
      ],
      interviewFocus: [
        { question: 'Когда выбрать interface?', expectedAnswer: 'Когда нужен чистый контракт и полиморфизм по роли.' },
        { question: 'Зачем default методы в интерфейсе?', expectedAnswer: 'Для эволюции API без ломки старых реализаций.' },
      ],
      codeExample: {
        title: 'Два отдельных примера: interface и abstract',
        language: 'java',
        snippet: `// --- Пример 1: интерфейс — только контракт, реализация целиком в классе ---
interface Notifier {
  void send(String text);
}

class EmailNotifier implements Notifier {
  @Override
  public void send(String text) {
    // как отправить email — решает этот класс
  }
}

// --- Пример 2: абстрактный класс — общее состояние + общий каркас, дети дореализуют ---
abstract class BaseNotifier {
  protected final String from;

  protected BaseNotifier(String from) {
    this.from = from;
  }

  public void send(String text) {
    dispatch(from, text);
  }

  protected abstract void dispatch(String from, String text);
}

class SmsNotifier extends BaseNotifier {
  SmsNotifier(String from) {
    super(from);
  }

  @Override
  protected void dispatch(String from, String text) {
    // как отправить SMS — только здесь
  }
}`,
        walkthrough: [
          'Первый блок: `interface` перечисляет, что должен уметь тип; тело методов пишут в `implements`-классе.',
          'Второй блок: `abstract class` хранит поле `from` и готовый метод `send`; разное поведение прячут в `abstract dispatch` и реализуют в `extends`.',
        ],
        commonPitfall: 'Сразу делать абстрактный класс, когда достаточно интерфейса.',
      },
      practiceHint: {
        task: 'Спроектировать Notification API (email/sms/push).',
        timeboxMinutes: 6,
        expectedOutcome: 'Логичное разделение interface и abstract base.',
        mentorCheck: 'Решение не нарушает single inheritance ограничение.',
      },
      lecturerNotes: ['Удобная точка для SOLID: зависимость от абстракций, а не от реализаций.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'mutable-immutable',
      title: 'Изменяемые и неизменяемые объекты',
      quickAnswer: 'Immutable проще для многопоточности и предсказуемости.',
      explainBrief: [
        'Immutable-объект нельзя изменить после создания.',
        'Это упрощает reasoning и потокобезопасность.',
        'String и wrapper-классы — классические примеры неизменяемости.',
      ],
      interviewFocus: [
        { question: 'Как сделать класс immutable?', expectedAnswer: 'final class, private final поля, без сеттеров, defensive copies.' },
        { question: 'Почему immutable удобен в кэше?', expectedAnswer: 'Нет риска, что кто-то поменяет состояние "за спиной".' },
      ],
      codeExample: {
        title: 'Immutable класс',
        language: 'java',
        snippet: `final class Point {
  private final int x;
  private final int y;
}`,
        walkthrough: ['final class защищает от наследования с mutable поведением.', 'final поля фиксируют состояние.'],
        commonPitfall: 'Забывать defensive copy для mutable полей типа List/Date.',
      },
      practiceHint: {
        task: 'Сделать immutable версию класса Student с List<String> tags.',
        timeboxMinutes: 8,
        expectedOutcome: 'Корректные defensive copies в конструкторе и геттере.',
        mentorCheck: 'Нельзя изменить внутренний список извне.',
      },
      lecturerNotes: ['Полезен антипример: defensive copy сделан неправильно, и список все еще меняют снаружи.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'inner-nested',
      title: 'Inner и Nested классы',
      quickAnswer:
        'У inner есть скрытая ссылка на экземпляр Outer и он создаётся как `outer.new Inner()`; static nested — обычный тип внутри файла внешнего класса, создаётся как `new Outer.Nested()` без outer.',
      explainBrief: [
        'Вложенный класс (nested class) в Java — класс, объявленный внутри тела другого класса.',
        'Static nested class (`static class Nested` внутри `Outer`) — статический член `Outer`. У него нет `Outer.this`: он не «принадлежит» конкретному объекту внешнего класса. Доступ к полям экземпляра `Outer` — только если явно передали ссылку на `Outer`.',
        'Inner class (не статический вложенный: просто `class Inner` внутри `Outer`) — не статический член: у экземпляра `Inner` неявно есть ссылка на тот `Outer`, который его создал; поэтому из `Inner` видны поля и методы этого outer.',
        'Создание: `Outer.Nested n = new Outer.Nested();` — без экземпляра `Outer`. Для inner: `Outer o = new Outer(); Outer.Inner i = o.new Inner();` — сначала нужен `o`.',
      ],
      interviewFocus: [
        {
          question: 'Зачем static nested?',
          expectedAnswer:
            'Спрямить вспомогательный тип в область видимости внешнего класса (логическая группировка, доступ к private static/к внешнему классу по правилам nested), не создавая лишнюю связь «каждый Nested тащит Outer».',
        },
        {
          question: 'Как создать inner объект?',
          expectedAnswer:
            'Только на экземпляре внешнего класса: `outerRef.new Inner()` (внутри самого `Outer` можно писать просто `new Inner()`).',
        },
      ],
      codeExample: {
        title: 'Два случая в одном классе Host',
        language: 'java',
        snippet: `class Host {
  private static int classOnly = 1;   // одно на весь класс Host
  private int perObject = 2;          // своё у каждого new Host()

  // --- static nested: отдельный тип, НЕ привязан к new Host() ---
  static class Nested {
    void print() {
      System.out.println(classOnly); // OK: это «уровень класса»
      // perObject; // ошибка: чей perObject? объекта Host в руках нет
    }
  }

  // --- inner: каждый экземпляр привязан к КОНКРЕТНОМУ new Host() ---
  class Inner {
    void print() {
      System.out.println(classOnly);
      System.out.println(perObject); // берётся у того Host, который создал Inner
    }
  }
}

// Nested: объект Host создавать не обязательно
Host.Nested n = new Host.Nested();

// Inner: сначала есть конкретный host, потом inner «на нём»
Host h = new Host();
Host.Inner i = h.new Inner();`,
        walkthrough: [
          '`static class Nested` — как обычный вложенный тип: живёт рядом с `Host`, но без скрытой ссылки на экземпляр `Host`, поэтому `perObject` недоступен.',
          '`class Inner` без `static` — у каждого `Inner` есть неявный «родительский» `Host`, поэтому виден его `perObject`.',
          'Создание: `new Host.Nested()` vs `h.new Inner()` — во втором явно видно, к какому `Host` относится inner.',
        ],
        commonPitfall:
          'Объявлять вложенный класс без `static`, когда он не использует состояние outer: лишняя ссылка на внешний объект, больше связности и накладные расходы без выгоды.',
      },
      practiceHint: {
        task: 'Сделать Builder как static nested класс в сущности.',
        timeboxMinutes: 6,
        expectedOutcome: 'Понимание практического кейса nested-класса.',
        mentorCheck: 'Builder объявлен static.',
      },
      lecturerNotes: ['Тот же прием часто встречается в паттерне Builder.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'local-anonymous',
      title: 'Локальные и анонимные классы',
      quickAnswer:
        'Локальный класс — объявлен внутри метода, виден только там. Анонимный — `new Type() { ... }` без имени класса. Для захвата локальных переменных они должны быть final или effectively final; с Java 8 одноабстрактные интерфейсы чаще пишут лямбдой.',
      explainBrief: [
        'Локальный класс нужен, когда в методе нужен отдельный тип с именем и несколькими методами, но выносить на уровень файла не хочется.',
        'Анонимный класс — разовая реализация интерфейса/класса на месте; компилятор сам даёт внутреннее имя.',
        'Локальные и анонимные классы могут читать локальные переменные метода только если те не переприсваиваются после инициализации (effectively final) — иначе замыкание было бы небезопасным.',
        'Лямбда `() -> { }` короче для одного абстрактного метода; анонимный класс оставляют при нескольких методах или тонкой настройке.',
      ],
      interviewFocus: [
        {
          question: 'Когда анонимный класс все еще нужен?',
          expectedAnswer:
            'Когда не подходит одна абстрактная операция: несколько методов, свои поля, явный `this` внешнего класса или редкие нюансы инициализации.',
        },
        {
          question: 'Почему для local class переменные должны быть effectively final?',
          expectedAnswer:
            'Объект вложенного класса может жить дольше кадра метода; JVM копирует захваченные значения, поэтому переменная снаружи не должна «прыгать» после захвата.',
        },
      ],
      codeExample: {
        title: 'Локальный класс и анонимный класс в одном методе',
        language: 'java',
        snippet: `void schedule() {
  final int delayMs = 500; // effectively final — можно не писать final, если не переприсваиваем

  class LocalTask implements Runnable {
    public void run() {
      System.out.println(delayMs); // захват локальной
    }
  }

  Runnable anon = new Runnable() {
    public void run() {
      System.out.println(delayMs);
    }
  };

  // Часто короче: Runnable lambda = () -> System.out.println(delayMs);
}`,
        walkthrough: [
          '`LocalTask` виден только внутри `schedule`, как обычный класс с именем.',
          'Анонимный `new Runnable() { }` — тот же захват `delayMs`, без отдельного имени типа.',
          'Если бы `delayMs` меняли после использования во вложенном классе — код не скомпилировался бы.',
        ],
        commonPitfall: 'Использовать анонимные классы, когда проще и чище лямбда.',
      },
      practiceHint: {
        task: 'Переписать анонимный класс в лямбду, где это возможно.',
        timeboxMinutes: 5,
        expectedOutcome: 'Понятно, когда подходит лямбда (один абстрактный метод), а когда нужен анонимный класс.',
        mentorCheck: 'Лямбда применена корректно.',
      },
      lecturerNotes: ['Тема обзорная, хватает короткого прохода.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'object-class',
      title: 'Класс Object',
      quickAnswer:
        'Любой класс наследует `Object`: ссылка `Object ref` может указывать на что угодно; реальный тип узнают через `getClass()` / `instanceof`, а виртуальные методы (`toString`, `equals`…) вызываются у фактического класса.',
      explainBrief: [
        'Писать `class User` значит `class User extends Object` — базовые методы уже есть.',
        '`getClass()` и `instanceof` различают «что за объект лежит в переменной», когда статический тип ссылки широкий.',
        'Коллекции и generic-код часто временно держат `Object` или сырой тип — понимание контракта Object нужно, чтобы не сломать equals/hashCode.',
        'Следующая тема — разбор методов Object по отдельности.',
      ],
      interviewFocus: [
        { question: 'Какие методы Object чаще всего переопределяют?', expectedAnswer: 'equals, hashCode, toString.' },
        { question: 'Что возвращает getClass()? ', expectedAnswer: 'Runtime-представление класса объекта.' },
      ],
      codeExample: {
        title: 'Ссылка Object и фактический тип',
        language: 'java',
        snippet: `Object ref = Integer.valueOf(7);
System.out.println(ref.getClass().getName()); // java.lang.Integer
System.out.println(ref instanceof Integer);   // true
System.out.println(ref.toString());           // виртуальный вызов — реализация Integer`,
        walkthrough: [
          'Тип переменной `Object`, но объект в heap — `Integer`; `getClass` и `instanceof` это показывают.',
          '`toString()` выберется у `Integer`, а не «пустой» смысл только от Object.',
          'Без знания фактического типа безопасно делать только то, что гарантирует контракт Object или общий интерфейс.',
        ],
        commonPitfall: 'Считать, что Object "бесполезен", потому что слишком общий.',
      },
      practiceHint: {
        task: 'Создать класс User и осмысленно переопределить toString.',
        timeboxMinutes: 4,
        expectedOutcome: 'Лог читаемый, без шума и утечки лишних данных.',
        mentorCheck: 'toString не раскрывает чувствительные поля.',
      },
      lecturerNotes: ['Логичный переход к контракту equals/hashCode.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'object-methods',
      title: 'Методы класса Object',
      quickAnswer: 'В реальной работе чаще всего важны `equals`, `hashCode` и `toString`; `wait/notify` нужны для низкоуровневой синхронизации.',
      explainBrief: [
        '`equals` и `hashCode` определяют корректную работу сравнения и хэш-коллекций.',
        '`toString` нужен для читаемых логов и диагностики.',
        '`wait/notify` работают через монитор объекта и чаще встречаются в базовых задачах по многопоточности.',
      ],
      interviewFocus: [
        {
          question: 'Зачем переопределять toString в прод-коде?',
          expectedAnswer: 'Чтобы в логах был смысловой текст (id, статус), а не `ClassName@hash`.',
        },
        {
          question: 'Почему wait/notify объявлены в Object, а не в Thread?',
          expectedAnswer: 'Потому что ожидание и уведомление привязаны к монитору конкретного объекта.',
        },
      ],
      codeExample: {
        title: 'Полезный toString',
        language: 'java',
        snippet: `@Override
public String toString() { return "User{id=" + id + "}"; }`,
        walkthrough: [
          'Без override лог обычно показывает технический мусор вида `User@5e2de80c`.',
          'С override сразу видно полезные данные объекта, что ускоряет разбор инцидентов.',
        ],
        commonPitfall: 'Логировать в toString пароли/токены.',
      },
      practiceHint: {
        task: 'Методы Object сгруппировать по назначению: сравнение, строка, клонирование, синхронизация.',
        timeboxMinutes: 4,
        expectedOutcome: 'Структурированное понимание без зубрежки.',
        mentorCheck: 'Есть группы: equality, reflection, threading.',
      },
      lecturerNotes: ['finalize — устаревшая тема, достаточно одной фразы.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'equals-hashcode',
      title: 'Контракт equals - hashCode',
      quickAnswer: 'Если два объекта равны по `equals`, у них обязан быть одинаковый `hashCode`.',
      explainBrief: [
        '`equals` отвечает на вопрос: одинаковы ли объекты по смыслу.',
        '`hashCode` помогает `HashMap` и `HashSet` быстро находить объект в нужной корзине.',
        'Если контракт нарушен, коллекции начинают вести себя странно: дубликаты, потери элементов, ошибки поиска.',
      ],
      interviewFocus: [
        {
          question: 'Что произойдет, если переопределить equals, но не hashCode?',
          expectedAnswer: 'В hash-коллекциях объект может "теряться": логически равные объекты попадают в разные корзины.',
        },
        {
          question: 'Какие свойства должен соблюдать equals?',
          expectedAnswer:
            'Рефлексивность, симметричность, транзитивность, консистентность и `x.equals(null) == false`.',
        },
      ],
      codeExample: {
        title: 'Базовая реализация',
        language: 'java',
        snippet: `@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (o == null || getClass() != o.getClass()) return false;
  Person person = (Person) o;
  return Objects.equals(email, person.email);
}
@Override
public int hashCode() { return Objects.hash(email); }`,
        walkthrough: [
          'В `equals` и `hashCode` нужно использовать один и тот же набор полей.',
          'Если сравниваем по `email`, то и хэш должен считаться по `email`.',
        ],
        commonPitfall: 'Включать в hashCode поле, которое не участвует в equals.',
      },
      practiceHint: {
        task: 'Исправить сломанный класс Person в HashSet-кейсе.',
        timeboxMinutes: 8,
        expectedOutcome: 'HashSet не хранит логические дубликаты.',
        mentorCheck: 'equals/hashCode согласованы.',
      },
      lecturerNotes: ['Это одна из самых частых собес-тем junior/middle.'],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'clone-method',
      title: 'Метод clone',
      quickAnswer:
        'По умолчанию `clone` — shallow: новый объект «снаружи», но вложенные объекты по ссылкам те же; без `Cloneable` и override контракт не собрать. В проде чаще копируют через конструктор или фабрику — без checked `CloneNotSupportedException` и яснее, что именно дублируется.',
      explainBrief: [
        'Shallow: дублируется «оболочка» объекта, mutable-вложенности по ссылке разделяются с оригиналом, пока не скопируете их явно.',
        '`Cloneable` не даёт метода `clone` — он только разрешает успешный `super.clone()` у подтипов `Object`.',
        'Deep copy вручную: после `super.clone()` пройти по каждому mutable-полю-ссылке и заменить его на новый объект с теми же данными: `items = new ArrayList<>(original.items)`, для `Map` — обычно `new HashMap<>(original)`, массив — `Arrays.copyOf` или покомпонентно, вложенный тип — копирующий конструктор или его `clone`.',
        'Альтернатива `clone`: `Person(Person other)`, `Order.copyOf(order)`, builder «скопировать и поменять».',
      ],
      interviewFocus: [
        { question: 'Почему clone считают плохим API?', expectedAnswer: 'Сложный контракт, checked exception, частые ошибки копирования ссылок.' },
        {
          question: 'Что такое shallow vs deep copy?',
          expectedAnswer:
            'Shallow: новый объект верхнего уровня, но ссылки на вложенные объекты те же. Deep: для каждого изменяемого вложения создают новый объект с копией содержимого (список — `new ArrayList<>(...)`, массив — копия, вложенный тип — свой копирующий конструктор/`clone` и т.д.), при необходимости рекурсивно.',
        },
      ],
      codeExample: {
        title: 'Шаблон clone',
        language: 'java',
        snippet: `@Override
protected Object clone() throws CloneNotSupportedException {
  return super.clone();
}`,
        walkthrough: [
          'После `super.clone()` вложенные изменяемые объекты по умолчанию остаются общими между копией и оригиналом.',
          'Глубокое копирование — не магия JVM: в переопределённом `clone()` после `super.clone()` явно пересобирают поля (новые коллекции, копии массивов и вложенных объектов).',
          'Тот же смысл часто проще выразить копирующим конструктором или статическим `copyOf`, без `Cloneable`.',
        ],
        commonPitfall: 'Ожидать deep copy от super.clone().',
      },
      practiceHint: {
        task: 'Сделать deep copy для класса Order с mutable List.',
        timeboxMinutes: 7,
        expectedOutcome: 'Изменение копии не влияет на оригинал.',
        mentorCheck: 'Ссылки на вложенные mutable объекты не разделяются.',
      },
      lecturerNotes: ['В обычном backend clone почти не используют — чаще копирование через конструктор или фабрику.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'oop-principles',
      title: 'Принципы ООП',
      quickAnswer:
        'Четыре опоры: инкапсуляция прячет состояние и правила смены за API класса; абстракция оставляет снаружи контракт «что умеет»; наследование переиспользует общее через is-a; полиморфизм подменяет реализации под одним типом-контрактом.',
      explainBrief: [
        'Инкапсуляция: внутренние данные и то, как их менять безопасно, живут внутри класса (например private-поля + методы с проверками); снаружи не лезут в поля напрямую. Аналогия: устройство с панелью — снаружи кнопки, внутри схема.',
        'Абстракция: в месте вызова видно только нужную роль и действия (интерфейс, короткий публичный API), а сложность и детали спрятаны в реализации или подтипах.',
        'Наследование: новый класс строят как «особый вид» существующего — общие поля и методы не дублируют, отличия добавляют в наследнике (is-a). Это про иерархию типов, не про «просто вызвать другой объект».',
        'Полиморфизм: переменная или параметр объявлены по контракту (интерфейс / базовый класс), а при вызове метода выполняется код конкретного объекта; клиентский код не переписывают при смене реализации. Аналогия: одна кнопка «Оплатить» — разные платёжные модули под капотом.',
      ],
      interviewFocus: [
        {
          question: 'Как выглядит полиморфизм в обычном backend-сервисе?',
          expectedAnswer: 'Есть интерфейс `PaymentService` и несколько реализаций под разных провайдеров.',
        },
        {
          question: 'Зачем инкапсуляция, кроме "спрятать поле"?',
          expectedAnswer: 'Она защищает инварианты: объект нельзя перевести в невалидное состояние случайным вызовом снаружи.',
        },
      ],
      codeExample: {
        title: 'Полиморфизм через интерфейс',
        language: 'java',
        snippet: `PaymentService service = new CardPaymentService();
service.pay(invoice);`,
        walkthrough: [
          'Код зависит от контракта `PaymentService`, а не от конкретного класса.',
          'Если заменить реализацию на `SbPaymentService`, вызов `service.pay(...)` останется тем же.',
        ],
        commonPitfall:
          'Делать наследование там, где нужна композиция: если один объект просто использует другой, это "has-a" (композиция), а не "is-a" (наследование).',
      },
      practiceHint: {
        task: 'Разбить "God class" на интерфейс и 2 реализации.',
        timeboxMinutes: 7,
        expectedOutcome: 'Код легче расширять и тестировать.',
        mentorCheck: 'Есть четкий контракт и реализация не утекла наружу.',
      },
      lecturerNotes: ['При желании можно одной фразой упомянуть SOLID, без углубления.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'inheritance-association',
      title: 'Наследование и Ассоциация',
      quickAnswer: 'Чаще выигрывает композиция (has-a), а не наследование (is-a).',
      explainBrief: [
        'Наследование хорошо, когда есть стабильная иерархия is-a.',
        'Ассоциация/композиция дает больше гибкости и меньше связности.',
        'В enterprise обычно предпочитают композицию.',
      ],
      interviewFocus: [
        { question: 'Почему inheritance часто переиспользуют неправильно?', expectedAnswer: 'Ради повторного кода, а не ради корректной модели is-a.' },
        { question: 'Что значит "favor composition over inheritance"?', expectedAnswer: 'Собирать поведение из зависимостей вместо жесткой иерархии.' },
      ],
      codeExample: {
        title: 'Car и Engine: is-a и has-a',
        language: 'java',
        snippet: `class Engine {
  void start() { /* ... */ }
}

// Базовый тип для транспорта — пример корректного is-a
class Vehicle { }

// Машина — это Vehicle; двигатель при этом не «родитель», а часть/зависимость
class Car extends Vehicle {
  private final Engine engine;

  Car(Engine engine) {
    this.engine = engine;
  }
}

// Так по смыслу неверно: Car не является разновидностью Engine (не is-a)
// class Car extends Engine { }`,
        walkthrough: [
          '`Car extends Vehicle` — наследование там, где «машина — это транспорт».',
          '`private final Engine engine` — композиция: машина содержит/использует двигатель, не наследует его.',
          '`Car extends Engine` синтаксически возможно, но для доменной модели обычно ошибка: путаются is-a и has-a.',
        ],
        commonPitfall: 'Строить глубокие иерархии ради "красоты".',
      },
      practiceHint: {
        task: 'Переделать наследование ReportService -> PdfReportService в композицию.',
        timeboxMinutes: 7,
        expectedOutcome: 'Слабосвязанный дизайн через внедрение зависимости.',
        mentorCheck: 'Наследование убрано без потери функциональности.',
      },
      lecturerNotes: ['Одна из любимых тем на проектном интервью.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'method-overriding',
      title: 'Переопределение методов',
      quickAnswer: 'Override меняет реализацию унаследованного метода с той же сигнатурой.',
      explainBrief: [
        'Для override сигнатура и совместимый return type обязательны.',
        'Аннотация @Override защищает от ошибок.',
        'Нарушение Liskov часто проявляется именно в плохом override.',
      ],
      interviewFocus: [
        { question: 'Можно ли сузить модификатор доступа при override?', expectedAnswer: 'Нельзя, доступ можно только расширять.' },
        { question: 'Можно ли бросать более широкое checked исключение?', expectedAnswer: 'Нельзя.' },
      ],
      codeExample: {
        title: 'Корректный override',
        language: 'java',
        snippet: `class Base { Number value() { return 1; } }
class Child extends Base { @Override Integer value() { return 1; } }`,
        walkthrough: ['Covariant return type допустим (Integer вместо Number).', '@Override ловит случайные опечатки.'],
        commonPitfall: 'Думать, что private/static методы можно override.',
      },
      practiceHint: {
        task: 'Четыре сигнатуры методов — для каждой решить: override или overload.',
        timeboxMinutes: 5,
        expectedOutcome: 'Уверенное различение override и overload по сигнатурам.',
        mentorCheck: 'Ответы без путаницы override vs overload.',
      },
      lecturerNotes: ['Типичный прод-кейс: поломка из-за случайного не-override (опечатка в имени метода).'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'binding',
      title: 'Статическое и динамическое связывание',
      quickAnswer:
        'Статическое связывание: компилятор уже выбрал поле, static-метод или перегрузку по типу ссылки. Динамическое: у обычного instance-метода с override в момент вызова смотрят на реальный класс объекта в памяти.',
      explainBrief: [
        'Связывание — не «магия ООП», а правило выбора: какая реализация или какое поле используется в конкретном выражении.',
        'Статическое (раннее): решение по типу переменной слева (тип ссылки). Так работают обращения к полям, вызовы `static`-методов и выбор между перегрузками `overload` по аргументам.',
        'Динамическое (позднее): для `public`/`protected`/`package` instance-методов без `final` при `override` JVM на вызове смотрит на фактический класс объекта (`new Child()`), а не только на объявление `Base ref`.',
        'Итог на пальцах: `Base ref = new Child()` — по `ref` поле и `static` ведут себя как у `Base`, а переопределённый обычный метод — как у `Child`.',
      ],
      interviewFocus: [
        {
          question: 'Какой тип влияет на обращение к полю и вызов static-метода?',
          expectedAnswer:
            'Тип ссылки (как объявлена переменная): компилятор вшивает обращение к полю/статике именно этого типа.',
        },
        {
          question: 'Какой тип влияет на вызов переопределенного instance-метода?',
          expectedAnswer:
            'Фактический класс объекта в памяти (у `Base ref = new Child()` при виртуальном вызове выполнится реализация из `Child`, если метод переопределён).',
        },
      ],
      codeExample: {
        title: 'Одна ссылка: поле и static (статика) vs instance override (динамика)',
        language: 'java',
        snippet: `class Base {
  int id = 1;
  static void ping() { System.out.print("B "); }
  void run() { System.out.print("Base "); }
}

class Child extends Base {
  int id = 2;
  static void ping() { System.out.print("C "); }
  @Override
  void run() { System.out.print("Child "); }
}

Base ref = new Child();
System.out.println(ref.id); // 1 — поле по типу ссылки Base (не полиморфно)
ref.ping();                  // B — static по типу ссылки Base (hiding, не override)
ref.run();                   // Child — instance override, фактический тип Child`,
        walkthrough: [
          '`ref.id`: поля не «виртуальные», берётся поле класса, который указан в объявлении `ref` — здесь `Base.id`.',
          '`ref.ping()`: static вызывается как у типа ссылки; «переопределение» static в Java — hiding, полиморфизма нет.',
          '`ref.run()`: обычный метод, dispatch по объекту — выполняется `Child.run()`, хотя переменная объявлена как `Base`.',
        ],
        commonPitfall: 'Ожидать, что static методы ведут себя как override.',
      },
      practiceHint: {
        task: 'Разобрать 3 примера и отметить, где compile-time, где runtime binding.',
        timeboxMinutes: 5,
        expectedOutcome: 'Четкое понимание механики вызовов.',
        mentorCheck: 'Каждый пример корректно отнесен к статическому или динамическому связыванию.',
      },
      lecturerNotes: ['Тема маленькая, но важная для полиморфизма.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'wrappers',
      title: 'Оболочки примитивных типов. API и сравнение',
      quickAnswer:
        'Значения обёрток сравнивают через `equals` (или `Objects.equals`). `==` проверяет одну и ту же ссылку в heap; из-за кеша `Integer.valueOf` для -128..127 два «одинаковых» `Integer` иногда указывают на один объект и `==` вводит в заблуждение — на это не опираются.',
      explainBrief: [
        'Wrapper-классы дают объектное представление примитивов.',
        'Автоупаковка/распаковка упрощает код, но скрывает стоимость и создание объектов.',
        'Запись `Integer x = 127` по сути ведёт к `Integer.valueOf(127)`. Для целых от -128 до 127 спецификация Java разрешает (и практически везде так и есть) использовать заранее созданные экземпляры — «integer cache». Тогда два таких `Integer` могут быть одной ссылкой, и `x == y` случайно true.',
        'Для значений вне кеша (например 128) `valueOf` обычно возвращает новый объект каждый раз — `==` даёт false при двух отдельных переменных, хотя `equals` остаётся true.',
        'Итог для кода и собесов: смысл «одинаковое число» проверяют через `equals`, не через `==`. Кеш — деталь оптимизации JVM, не контракт для сравнения.',
      ],
      interviewFocus: [
        {
          question: 'Почему Integer a=127; Integer b=127; a==b true?',
          expectedAnswer:
            'Потому что обе переменные получают ссылку на один и тот же закешированный объект из диапазона, который возвращает `Integer.valueOf` (типично -128..127). `==` сравнивает ссылки — они совпали.',
        },
        {
          question: 'Почему для 128 уже false?',
          expectedAnswer:
            '128 вне гарантированного кеша для этого трюка: чаще всего для `a` и `b` создаются два разных объекта в heap, ссылки разные, `==` false; `equals` по-прежнему true, потому что сравнивает `intValue()`.',
        },
      ],
      codeExample: {
        title: 'Integer: кеш -128..127 и сравнение',
        language: 'java',
        snippet: `Integer a127 = 127;
Integer b127 = 127;
System.out.println(a127 == b127);           // true — часто одна ссылка из кеша valueOf

Integer a128 = 128;
Integer b128 = 128;
System.out.println(a128 == b128);           // false — обычно два разных объекта
System.out.println(a128.equals(b128));      // true — сравнение по значению

// Явно то же самое делает valueOf:
System.out.println(Integer.valueOf(500) == Integer.valueOf(500)); // как правило false`,
        walkthrough: [
          '`==` у объектов — это «один и тот же объект в памяти», не «одинаковое число».',
          'В диапазоне -128..127 `valueOf` переиспользует экземпляры — отсюда ловушка на собеседованиях.',
          'Для бизнес-логики: `Objects.equals(a, b)` или примитивы, если null не бывает.',
        ],
        commonPitfall: 'Сравнивать wrapper через == и получать "рандомные" результаты.',
      },
      practiceHint: {
        task: 'Найти и исправить 3 бага сравнения Integer/Long в коде.',
        timeboxMinutes: 6,
        expectedOutcome: 'Все сравнения значений через equals/Objects.equals.',
        mentorCheck: 'Нет сравнений wrapper через ==.',
      },
      lecturerNotes: ['Важный крайний случай: NPE при автораспаковке null-обертки.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'string-class',
      title: 'String',
      quickAnswer: 'String immutable: любая операция создает новый объект.',
      explainBrief: [
        'String используется везде: API, ключи, SQL, логи.',
        'Неизменяемость дает безопасность и возможность кеширования.',
        'Частая ошибка — думать, что concat меняет исходную строку.',
      ],
      interviewFocus: [
        { question: 'Почему String immutable?', expectedAnswer: 'Безопасность, thread-safety, string pool и надежные hashCode ключей.' },
        { question: 'Что быстрее в цикле: String + или StringBuilder?', expectedAnswer: 'StringBuilder.' },
      ],
      codeExample: {
        title: 'Неизменяемость String',
        language: 'java',
        snippet: `String text = "Java";
text.concat(" 11");
System.out.println(text);`,
        walkthrough: [
          'Методы вроде `concat` возвращают новую строку; без присваивания исходная переменная не меняется.',
          'Нужно писать `text = text.concat(...)`, если результат должен сохраниться.',
        ],
        commonPitfall: 'Ожидать "мутацию" строки после concat/replace.',
      },
      practiceHint: {
        task: 'Исправить метод, который "теряет" изменения строки.',
        timeboxMinutes: 4,
        expectedOutcome: 'Результат строковых операций всегда присваивается переменной, где нужно.',
        mentorCheck: 'Все string-операции с присваиванием результата.',
      },
      lecturerNotes: ['Сюда естественно подводится String pool.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'string-pool',
      title: 'String pool',
      quickAnswer:
        'Литералы интернируются: одинаковый текст в кавычках обычно — один объект `String` в heap; `new String(...)` даёт другой объект в heap, не из пула литералов.',
      explainBrief: [
        'Пул — чтобы не плодить в памяти много одинаковых строк из исходника: один литерал — одна типичная ссылка.',
        'Два поля с литералом `"dev"` чаще всего указывают на один и тот же объект; два `new String("dev")` — почти всегда разные объекты.',
        '`intern()` вручную кладёт строку в pool; в обычном коде почти не нужен без замеров.',
      ],
      interviewFocus: [
        {
          question: 'Почему "a"=="a" true, а new String("a")==new String("a") false?',
          expectedAnswer:
            'Оба варианта — объекты в heap; в первом две ссылки на один интернированный литерал из пула, во втором два отдельных `new String`, разные ссылки.',
        },
        { question: 'Когда имеет смысл intern()?', expectedAnswer: 'Точечно, при большом количестве повторяющихся строк и осознанном профилировании.' },
      ],
      codeExample: {
        title: 'Проверка пула строк',
        language: 'java',
        snippet: `String a = "dev";
String b = "dev";
String c = new String("dev");
System.out.println(a == b); // true
System.out.println(a == c); // false`,
        walkthrough: [
          'a и b — одна и та же ссылка на объект `String` из пула литералов (он тоже в heap).',
          'c — другой объект `String` в heap; символы совпадают, но ссылка другая.',
        ],
        commonPitfall: 'Использовать == для сравнения текстов в бизнес-логике.',
      },
      practiceHint: {
        task: 'Предсказать вывод 5 выражений со строками и объяснить почему.',
        timeboxMinutes: 6,
        expectedOutcome: 'Каждый результат объясняется через string pool и отдельные объекты в heap.',
        mentorCheck: 'Есть корректное объяснение для всех выражений.',
      },
      lecturerNotes: ['Тема часто идет "вопросом-ловушкой" на собесах.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'string-api',
      title: 'String API',
      quickAnswer:
        '`trim`/`strip` — обрезка пробелов (`strip` учитывает Unicode с Java 11). `isEmpty` vs `isBlank`: пустая строка против «только пробелы». `split` принимает regex — точку и спецсимволы экранируют или `Pattern.quote`. Результат операций — новая `String`, исходную не мутируют.',
      explainBrief: [
        'Проверки: `isEmpty()` — длина 0; `isBlank()` — пусто или одни пробельные символы (удобно для ввода пользователя).',
        'Обрезка: `trim()` — классические пробелы; `strip()` (Java 11+) — шире по Unicode whitespace.',
        'Разбор: `split(regex)` режет по шаблону; `split(",")` ок, а `split(".")` режет после каждого символа — нужно `\\\\.` или `Pattern.quote(".")`.',
        'На `null` методы не вызывают — сначала `== null` или `Objects.requireNonNull`, иначе `NullPointerException`.',
      ],
      interviewFocus: [
        {
          question: 'Чем isEmpty отличается от isBlank?',
          expectedAnswer:
            '`isEmpty` true только при нулевой длине; `isBlank` true ещё и для строк из пробелов/переводов строк.',
        },
        {
          question: 'Почему split(".") не работает как ожидают?',
          expectedAnswer:
            'Аргумент — regex: `.` значит «любой символ». Нужна экранированная точка или `Pattern.quote(".")`.',
        },
      ],
      codeExample: {
        title: 'strip, isBlank и split с regex',
        language: 'java',
        snippet: `String raw = "  a,b; c  ";
String t = raw.strip();
boolean blankLine = "\\t".isBlank(); // true; isEmpty() — false (символ таба есть)

String csv = "a.b.c";
// String[] wrong = csv.split(".");  // ловушка: regex «любой символ»
String[] ok = csv.split("\\\\.");    // сегменты a, b, c

String multi = "x|y|z";
String[] parts = multi.split("\\\\|"); // | в regex — спецсимвол`,
        walkthrough: [
          '`strip` + `isBlank` — типичная связка для «пустого» пользовательского ввода.',
          '`split` всегда помнит: шаблон regex; для буквального разделителя — экранирование или `Pattern.quote`.',
          'Каждый вызов (`trim`, `toLowerCase`, `split`…) возвращает новую строку — присваивать, если результат нужен дальше.',
          'Для `substring` и индексов следят за границами — иначе `StringIndexOutOfBoundsException`.',
        ],
        commonPitfall: 'Передавать в split строку-разделитель, забывая, что это regex, а не буквальный текст.',
      },
      practiceHint: {
        task: 'Написать метод normalizeEmail(String input).',
        timeboxMinutes: 7,
        expectedOutcome: 'Убраны пробелы и приведен lower-case.',
        mentorCheck: 'Обработан null/blank-case.',
      },
      lecturerNotes: ['Удобно разобрать утилитный метод и граничные случаи (null, пустая строка).'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'string-builder-buffer',
      title: 'StringBuilder, StringBuffer',
      quickAnswer: 'StringBuilder быстрее и не thread-safe, StringBuffer thread-safe и медленнее.',
      explainBrief: [
        'При конкатенации в цикле String создает много временных объектов.',
        'StringBuilder решает это через mutable буфер.',
        'StringBuffer редко нужен, только при реальной многопоточности.',
      ],
      interviewFocus: [
        { question: 'Почему "str += i" в цикле плохо?', expectedAnswer: 'Создается много промежуточных String, нагрузка на GC.' },
        { question: 'Когда оправдан StringBuffer?', expectedAnswer: 'Когда один буфер реально разделяется между потоками.' },
      ],
      codeExample: {
        title: 'Построение строки в цикле',
        language: 'java',
        snippet: `StringBuilder builder = new StringBuilder();
for (int i = 0; i < 3; i++) { builder.append(i); }`,
        walkthrough: ['Один буфер на весь цикл.', 'Меньше мусора в heap.'],
        commonPitfall: 'Использовать StringBuffer по умолчанию без причины.',
      },
      practiceHint: {
        task: 'Переписать метод генерации CSV со String на StringBuilder.',
        timeboxMinutes: 6,
        expectedOutcome: 'Код проще и эффективнее на больших входных данных.',
        mentorCheck: 'Нет конкатенации String в цикле.',
      },
      lecturerNotes: ['Хорошо заходит microbench-пояснение без глубоких чисел.'],
      estimatedMinutes: 3,
    }),
  ],
};
