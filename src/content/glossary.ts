export interface GlossarySource {
  label: string;
  url: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  sources: GlossarySource[];
}

export const glossary: GlossaryTerm[] = [
  {
    id: 'jvm',
    term: 'JVM',
    aliases: ['jvm', 'virtual machine'],
    definition: 'Виртуальная машина Java, которая исполняет байткод, управляет памятью и жизненным циклом программы.',
    sources: [{ label: 'Oracle Java Docs', url: 'https://docs.oracle.com/javase/specs/' }],
  },
  {
    id: 'jdk',
    term: 'JDK',
    aliases: ['jdk', 'javac'],
    definition: 'Набор инструментов разработчика: компилятор, утилиты и runtime для разработки Java-приложений.',
    sources: [{ label: 'Oracle JDK', url: 'https://www.oracle.com/java/technologies/downloads/' }],
  },
  {
    id: 'heap',
    term: 'Heap',
    aliases: ['heap'],
    definition: 'Область памяти JVM для объектов и массивов. Управляется сборщиком мусора.',
    sources: [{ label: 'Baeldung: JVM Data Areas', url: 'https://www.baeldung.com/java-jvm-run-time-data-areas' }],
  },
  {
    id: 'stack',
    term: 'Stack',
    aliases: ['stack'],
    definition: 'Память стека хранит фреймы вызовов методов и локальные переменные.',
    sources: [{ label: 'Baeldung: Stack vs Heap', url: 'https://www.baeldung.com/java-stack-heap' }],
  },
  {
    id: 'classloader',
    term: 'ClassLoader',
    aliases: ['class loader', 'classloader', 'bootstrap'],
    definition: 'Механизм загрузки классов в JVM с делегированием родителю (parent delegation).',
    sources: [{ label: 'Baeldung: Classloaders', url: 'https://www.baeldung.com/java-classloaders' }],
  },
  {
    id: 'equals-hashcode',
    term: 'equals/hashCode',
    aliases: ['equals', 'hashcode', 'hash map', 'hashset'],
    definition: 'Контракт сравнения объектов: равные объекты обязаны иметь одинаковый hashCode.',
    sources: [{ label: 'Oracle Object API', url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html' }],
  },
  {
    id: 'string-pool',
    term: 'String Pool',
    aliases: ['string pool', 'intern'],
    definition: 'Пул строк для переиспользования одинаковых литералов и экономии памяти.',
    sources: [{ label: 'Baeldung: String Interview', url: 'https://www.baeldung.com/java-string-interview-questions' }],
  },
  {
    id: 'immutability',
    term: 'Immutability',
    aliases: ['immutable', 'неизменяем', 'string'],
    definition: 'Состояние объекта нельзя изменить после создания. Это упрощает потокобезопасность и предсказуемость.',
    sources: [{ label: 'Oracle String API', url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/String.html' }],
  },
  {
    id: 'overriding',
    term: 'Overriding',
    aliases: ['override', 'overriding', 'polymorphism', 'полиморф'],
    definition: 'Переопределение метода в наследнике для изменения поведения с той же сигнатурой.',
    sources: [{ label: 'Oracle Tutorials', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/' }],
  },
  {
    id: 'composition',
    term: 'Composition',
    aliases: ['composition', 'композиция', 'association', 'ассоциация'],
    definition: 'Построение поведения через включение зависимостей (has-a), а не через наследование.',
    sources: [{ label: 'Baeldung OOP', url: 'https://www.baeldung.com/java-oop' }],
  },
];

export function detectGlossaryTerms(rawContent: string): GlossaryTerm[] {
  const normalized = rawContent.toLowerCase();
  return glossary.filter((entry) => entry.aliases.some((alias) => normalized.includes(alias.toLowerCase())));
}
