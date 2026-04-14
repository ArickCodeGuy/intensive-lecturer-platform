import './style.css';
import { modules } from './content';
import type { TopicContent } from './content/schema';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Не найден контейнер приложения.');
}
const appRoot = app;

const state = {
  activeModuleIndex: -1,
  activeTopicIndex: 0,
};

function getCurrentTopic(): TopicContent {
  return modules[state.activeModuleIndex].topics[state.activeTopicIndex];
}

function isInterviewLandingModule(moduleItem: (typeof modules)[number]): boolean {
  return moduleItem.id.startsWith('interview-');
}

function isCvLandingModule(moduleItem: (typeof modules)[number]): boolean {
  return moduleItem.id === 'cv-interview';
}

function renderModuleLanding(): string {
  const interviewSlots = modules
    .map((moduleItem, index) => ({ moduleItem, index }))
    .filter(({ moduleItem }) => isInterviewLandingModule(moduleItem));
  const cvSlots = modules
    .map((moduleItem, index) => ({ moduleItem, index }))
    .filter(({ moduleItem }) => isCvLandingModule(moduleItem));
  const coreModules = modules.filter((m) => !isInterviewLandingModule(m) && !isCvLandingModule(m));

  const cards = coreModules
    .map((moduleItem, displayIndex) => {
      const index = modules.indexOf(moduleItem);
      const isAvailable = moduleItem.isAvailable !== false;
      const cardClass = isAvailable ? 'module-card' : 'module-card locked';
      const actionAttr = isAvailable ? 'data-action="open-module"' : '';
      const lockText = !isAvailable && moduleItem.lockedReason ? `<p class="module-lock">${moduleItem.lockedReason}</p>` : '';
      const topicMeta =
        moduleItem.topics.length > 0
          ? `<p class="module-meta"><span class="module-meta-dot" aria-hidden="true"></span>Тем: ${moduleItem.topics.length}</p>`
          : '';
      return `<button class="${cardClass}" ${actionAttr} data-module-index="${index}" data-module-id="${moduleItem.id}">
        <p class="module-kicker">Модуль ${displayIndex + 1}</p>
        <h2>${moduleItem.title}</h2>
        <p class="module-description">${moduleItem.summary ?? `Тем: ${moduleItem.topics.length}.`}</p>
        ${topicMeta}
        ${lockText}
      </button>`;
    })
    .join('');

  if (interviewSlots.length === 0) {
    return `<section class="module-landing">
    <div class="module-hero">
      <h1>Java Intensive Studio</h1>
      <p class="module-hero-lead">Материалы интенсивов по модулям.</p>
    </div>
    <h2 class="module-section-title">Учебные модули</h2>
    <div class="module-grid">${cards}</div>
  </section>`;
  }

  const interviewCards = interviewSlots
    .map(({ moduleItem, index }) => {
      const interviewAvailable = moduleItem.isAvailable !== false;
      const interviewCardClass = interviewAvailable ? 'module-card module-card--interview' : 'module-card locked';
      const interviewAction = interviewAvailable ? 'data-action="open-module"' : '';
      const interviewLock =
        !interviewAvailable && moduleItem.lockedReason ? `<p class="module-lock">${moduleItem.lockedReason}</p>` : '';
      const kicker = moduleItem.interviewSectionKicker ?? 'Интервью';
      const interviewMeta =
        moduleItem.topics.length > 0
          ? `<p class="module-meta"><span class="module-meta-dot" aria-hidden="true"></span>Тем: ${moduleItem.topics.length}</p>`
          : '';
      return `<button type="button" class="${interviewCardClass}" ${interviewAction} data-module-index="${index}" data-module-id="${moduleItem.id}">
        <p class="module-kicker">${kicker}</p>
        <h2>${moduleItem.title}</h2>
        <p class="module-description">${moduleItem.summary ?? `Тем: ${moduleItem.topics.length}.`}</p>
        ${interviewMeta}
        ${interviewLock}
      </button>`;
    })
    .join('');

  const interviewBlock = `<div class="interview-landing-block">
    <h2 class="interview-landing-title">Интервью</h2>
    <p class="interview-landing-intro">Та же структура карточек, что у учебных модулей: краткое объяснение, вопросы и ответы для собеседования, примеры и ссылки.</p>
    <div class="module-grid module-grid--interview">
      ${interviewCards}
    </div>
  </div>`;

  const cvCards = cvSlots
    .map(({ moduleItem, index }) => {
      const isAvailable = moduleItem.isAvailable !== false;
      const cardClass = isAvailable ? 'module-card module-card--cv' : 'module-card locked';
      const actionAttr = isAvailable ? 'data-action="open-module"' : '';
      const lockText = !isAvailable && moduleItem.lockedReason ? `<p class="module-lock">${moduleItem.lockedReason}</p>` : '';
      const meta =
        moduleItem.topics.length > 0
          ? `<p class="module-meta"><span class="module-meta-dot" aria-hidden="true"></span>Тем: ${moduleItem.topics.length}</p>`
          : '';
      return `<button type="button" class="${cardClass}" ${actionAttr} data-module-index="${index}" data-module-id="${moduleItem.id}">
        <p class="module-kicker">CV интервью</p>
        <h2>${moduleItem.title}</h2>
        <p class="module-description">${moduleItem.summary ?? ''}</p>
        ${meta}
        ${lockText}
      </button>`;
    })
    .join('');

  const cvBlock =
    cvSlots.length > 0
      ? `<div class="cv-landing-block">
    <h2 class="cv-landing-title">CV</h2>
    <p class="cv-landing-intro">Интервью по опыту кандидата: проекты, процессы, команда и софт-скиллы. Для каждого вопроса — ориентиры middle/senior и отметка результата.</p>
    <div class="module-grid module-grid--cv">
      ${cvCards}
    </div>
  </div>`
      : '';

  return `<section class="module-landing">
    <div class="module-hero">
      <h1>Java Intensive Studio</h1>
      <p class="module-hero-lead">Материалы интенсивов по модулям.</p>
    </div>
    <h2 class="module-section-title">Учебные модули</h2>
    <div class="module-grid">${cards}</div>
    ${interviewBlock}
    ${cvBlock}
  </section>`;
}

function renderTopicList(): string {
  const moduleData = modules[state.activeModuleIndex];
  if (moduleData.id === 'cv-interview') {
    const groupLabels: Record<string, string> = {
      'cvb-': 'CV Basics',
      'prj-': 'Проект',
      'proc-': 'Процессы',
      'team-': 'Работа в команде',
      'task-': 'Жизненный цикл задачи',
      'you-': 'Ты и работа',
      'gen-': 'Общее',
    };

    const groups = Object.keys(groupLabels).map((prefix) => ({
      prefix,
      label: groupLabels[prefix],
      items: moduleData.topics
        .map((topic, index) => ({ topic, index }))
        .filter(({ topic }) => topic.id.startsWith(prefix)),
    }));

    const renderedGroups = groups
      .filter((g) => g.items.length > 0)
      .map((group) => {
        const items = group.items
          .map(({ topic, index }) => {
            const selectedClass = index === state.activeTopicIndex ? 'topic-item selected' : 'topic-item';
            return `<button class="${selectedClass}" data-action="select-topic" data-topic-index="${index}">
              <span class="topic-title">${topic.title}</span>
            </button>`;
          })
          .join('');
        return `<div class="topic-group">
          <div class="topic-group-title">${group.label}</div>
          <div class="topic-group-items">${items}</div>
        </div>`;
      })
      .join('');

    return renderedGroups;
  }

  return moduleData.topics
    .map((topic, index) => {
      const selectedClass = index === state.activeTopicIndex ? 'topic-item selected' : 'topic-item';
      return `<button class="${selectedClass}" data-action="select-topic" data-topic-index="${index}">
        <span class="topic-title">${topic.title}</span>
      </button>`;
    })
    .join('');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTermRegex(term: string): RegExp {
  const escaped = escapeRegExp(term);
  return new RegExp(`(^|[^A-Za-zА-Яа-яЁё0-9_])(${escaped})(?=$|[^A-Za-zА-Яа-яЁё0-9_])`, 'gi');
}

function highlightTerms(text: string): string {
  const terms = [
    'JVM',
    'JRE',
    'JDK',
    'ClassLoader',
    'class loader',
    'Bootstrap',
    'Platform',
    'Application',
    'parent delegation',
    'compile-time',
    'runtime',
    'heap',
    'stack',
    'metaspace',
    'classpath',
    'байткод',
    'модификатор',
    'инкапсуляция',
    'наследование',
    'полиморфизм',
    'абстракция',
    'интерфейс',
    'абстрактный класс',
    'private',
    'protected',
    'public',
    'package-private',
    'static',
    'final',
    'abstract',
    'equals',
    'hashCode',
    'toString',
    'String',
    'StringBuilder',
    'StringBuffer',
    'immutable',
    'мутабельный',
    'переопределение',
    'перегрузка',
    'примитив',
    'wrapper',
    'автобоксинг',
    'распаковка',
    'heap',
    'stack',
    'metaspace',
    'classpath',
    'Kafka',
    'REST',
    'DDD',
    'mTLS',
    'JWT',
    'OAuth2',
    'OpenShift',
    'Kubernetes',
    'Istio',
    'Redis',
    'Prometheus',
    'Grafana',
    'Circuit Breaker',
    'API Gateway',
    'happens-before',
    'volatile',
    'Spring',
    'Spring Boot',
    'IoC',
    'DI',
    'ACID',
    'NoSQL',
    'SQL',
  ];
  return terms
    .sort((left, right) => right.length - left.length)
    .reduce((acc, term) => {
      const regex = getTermRegex(term);
      return acc.replace(regex, (_, prefix: string, matchedTerm: string) => {
        return `${prefix}<span class="term-highlight">${matchedTerm}</span>`;
      });
    }, text);
}

function renderHighlightedLine(line: string): string {
  if (line.includes('Ответ:')) {
    const [questionPart, answerPart] = line.split('Ответ:');
    return `<div class="line-block">
      <span class="line-label">${highlightTerms(questionPart.trim())}</span>
      <span class="line-answer"><span class="line-answer-label">Ответ:</span> ${highlightTerms(answerPart.trim())}</span>
    </div>`;
  }

  if (line.startsWith('Частый собес-вопрос:')) {
    return `<span class="line-label">${highlightTerms(line)}</span>`;
  }

  if (line.startsWith('Практический фокус:')) {
    return `<span class="line-focus">${highlightTerms(line)}</span>`;
  }

  if (line.startsWith('Вопрос для самопроверки:')) {
    return `<span class="line-check">${highlightTerms(line)}</span>`;
  }

  return `<span>${highlightTerms(line)}</span>`;
}

function buildFixForMistake(topic: TopicContent, line: string): string | undefined {
  const lower = line.toLowerCase();
  const title = topic.title.toLowerCase();

  if (lower.includes('protected')) {
    return 'protected дает доступ внутри пакета и наследникам из других пакетов.';
  }
  if (lower.includes('stack хранит объекты')) {
    return 'в stack обычно лежат фреймы, локальные переменные и ссылки, а объекты создаются в heap.';
  }
  if (lower.includes('equals') && lower.includes('hashcode')) {
    return 'equals и hashCode переопределяют вместе, чтобы hash-коллекции работали корректно.';
  }
  if (lower.includes('==') && lower.includes('строк')) {
    return 'строки сравнивают через equals, потому что == сравнивает ссылки.';
  }
  if (lower.includes('jre = jdk') || lower.includes('jre') && lower.includes('jdk')) {
    return 'JDK включает инструменты разработки, а JRE предназначен для запуска.';
  }
  if (lower.includes('super') && lower.includes('где угодно')) {
    return 'super(...) вызывают первой строкой конструктора.';
  }
  if (lower.includes('toString') && (lower.includes('парол') || lower.includes('токен'))) {
    return 'в toString оставляют только безопасные поля (id, статус), а секреты не логируют.';
  }
  if (lower.includes('deep copy') || lower.includes('super.clone')) {
    return (
      'super.clone() даёт shallow copy. Глубокую делают вручную после super.clone(): для каждого mutable-поля-ссылки ' +
      'подставляют новый объект с копией данных — например `new ArrayList<>(старыйСписок)`, для массива `Arrays.copyOf` или `clone()`, ' +
      'для вложенного DTO — конструктор копии, свой `clone()` или фабрика; при дереве вложенности шаг повторяют рекурсивно по уровням.'
    );
  }
  if (lower.includes('clone') && lower.includes('cloneable')) {
    return 'для clone нужно понимать контракт Cloneable и явно обрабатывать mutable-поля.';
  }
  if (lower.includes('stackoverflow')) {
    return 'проверить условие выхода из рекурсии и глубину вызовов.';
  }
  if (lower.includes('утечк') || lower.includes('cache') || lower.includes('listener')) {
    return 'контролировать жизненный цикл ссылок: eviction для cache, отписка listener, очистка static-коллекций.';
  }
  if (title.includes('модификатор') || title.includes('private') || title.includes('protected')) {
    return 'выбирать минимально необходимую область видимости для каждого члена класса.';
  }
  return undefined;
}

function renderMistakeLine(topic: TopicContent, line: string): string {
  if (line.includes('Как правильно:')) {
    const [mistakePart, fixPart] = line.split('Как правильно:');
    return `<div class="line-block">
      <span>${highlightTerms(mistakePart.trim())}</span>
      <span class="line-answer"><span class="line-answer-label">Как правильно:</span> ${highlightTerms(fixPart.trim())}</span>
    </div>`;
  }
  const fix = buildFixForMistake(topic, line);
  if (!fix) {
    return renderHighlightedLine(line);
  }
  return `<div class="line-block">
    <span>${line}</span>
    <span class="line-answer"><span class="line-answer-label">Как правильно:</span> ${fix}</span>
  </div>`;
}

function normalizeViewText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeCvAnswer(text: string): string {
  let normalized = text.trim();

  // Важно: \b в JS не работает как Unicode-word-boundary для кириллицы,
  // поэтому используем Unicode property escapes по границам букв.
  const replaceWord = (input: string, word: string, replacement: string): string => {
    const re = new RegExp(`(^|[^\\p{L}])(${word})(?=$|[^\\p{L}])`, 'giu');
    return input.replace(re, (_, prefix: string) => `${prefix}${replacement}`);
  };

  const replaceWords = (input: string, map: Record<string, string>): string => {
    return Object.entries(map).reduce((acc, [word, replacement]) => replaceWord(acc, word, replacement), input);
  };

  normalized = replaceWords(normalized, {
    // Местоимения 1 лица
    я: 'кандидат',
    мне: 'кандидату',
    мной: 'кандидатом',
    мною: 'кандидатом',
    мой: 'кандидата',
    моя: 'кандидата',
    моё: 'кандидата',
    мои: 'кандидата',
    моих: 'кандидата',
    моему: 'кандидату',
    моей: 'кандидата',

    // Типовые глаголы 1 лица (встречаются как “Описываю…”, “Показываю…” и т.д.)
    привожу: 'кандидат приводит',
    перечисляю: 'кандидат перечисляет',
    называю: 'кандидат называет',
    объясняю: 'кандидат объясняет',
    рассказываю: 'кандидат рассказывает',
    говорю: 'кандидат говорит',
    описываю: 'кандидат описывает',
    показываю: 'кандидат показывает',
    делю: 'кандидат делит',
    упоминаю: 'кандидат упоминает',
    выбираю: 'кандидат выбирает',
    уточняю: 'кандидат уточняет',
    сравниваю: 'кандидат сравнивает',
  });

  normalized = normalized.replace(/что делал лично/giu, 'что делал кандидат');
  normalized = normalized.replace(/что сделал лично/giu, 'что сделал кандидат');

  // После точки/воскл/вопр приводим "кандидат" к заглавной букве (чтобы не было ". кандидат ...")
  normalized = normalized.replace(/([.!?]\s+)кандидат/giu, '$1Кандидат');

  // Косметика: если строка начинается со строчного "кандидат" — делаем заглавную букву
  normalized = normalized.replace(/^кандидат\b/, 'Кандидат');
  return normalized;
}

function renderTopicPage(topic: TopicContent): string {
  const moduleData = modules[state.activeModuleIndex];
  const isCvPack = moduleData?.id === 'cv-interview' || topic.id.startsWith('cvb-') || topic.id.startsWith('prj-') || topic.id.startsWith('proc-') ||
    topic.id.startsWith('team-') || topic.id.startsWith('task-') || topic.id.startsWith('you-') || topic.id.startsWith('gen-');

  const cvText = (value: string): string => (isCvPack ? normalizeCvAnswer(value) : value);

  const lines = topic.explainBrief.map((line) => `<li>${highlightTerms(cvText(line))}</li>`).join('');
  const keyPoints = topic.keyPoints.map((line) => `<li>${renderHighlightedLine(cvText(line))}</li>`).join('');
  const commonMistakes = topic.commonMistakes.map((line) => `<li>${renderMistakeLine(topic, cvText(line))}</li>`).join('');

  const interviewWithAnswers = topic.interviewFocus
    .map((item) => {
      if (!isCvPack || !item.expectedAnswerByLevel) {
        const expectedAnswer = isCvPack ? cvText(item.expectedAnswer) : item.expectedAnswer;
        return `<li class="qa-item"><span class="qa-question">${highlightTerms(item.question)}</span><span class="qa-answer">${highlightTerms(expectedAnswer)}</span></li>`;
      }

      const middle = normalizeCvAnswer(item.expectedAnswerByLevel.middle);
      const senior = normalizeCvAnswer(item.expectedAnswerByLevel.senior);

      return `<li class="qa-item qa-item--cv">
        <div class="qa-cv-head">
          <span class="qa-question">${highlightTerms(item.question)}</span>
        </div>
        <div class="qa-cv-answers">
          <div class="qa-cv-answer">
            <div class="qa-cv-label">Middle</div>
            <div class="qa-answer">${highlightTerms(middle)}</div>
          </div>
          <div class="qa-cv-answer">
            <div class="qa-cv-label">Senior</div>
            <div class="qa-answer">${highlightTerms(senior)}</div>
          </div>
        </div>
      </li>`;
    })
    .join('');
  const quickAnswerSection =
    normalizeViewText(topic.simpleDefinition).includes(normalizeViewText(topic.quickAnswer))
      ? ''
      : `<section class="section-block section-answer">
      <h3>Короткий ответ</h3>
      <p>${highlightTerms(cvText(topic.quickAnswer))}</p>
    </section>`;

  const walkthrough = topic.codeExample.walkthrough.map((line) => `<li>${cvText(line)}</li>`).join('');
  const antiPatternBlock = topic.codeExample.antiPatternSnippet
    ? `<h3>Антипример (как делать не стоит)</h3>
    <pre><code>${topic.codeExample.antiPatternSnippet}</code></pre>
    <article class="pitfall-card"><strong>Почему плохо:</strong> ${topic.codeExample.antiPatternNote ?? topic.codeExample.commonPitfall}</article>`
    : '';
  const productionNote = topic.codeExample.productionNote
    ? `<article class="section-block section-success"><h3>Production заметка</h3><p>${cvText(topic.codeExample.productionNote)}</p></article>`
    : '';

  const explainSection = lines
    ? `<section class="section-block">
          <h3>Суть темы</h3>
          <ul class="bullet-list">${lines}</ul>
        </section>`
    : '';
  const keyPointsSection = keyPoints
    ? `<section class="section-block">
          <h3>Ключевые пункты</h3>
          <ul class="bullet-list">${keyPoints}</ul>
        </section>`
    : '';
  const commonMistakesSection = commonMistakes
    ? `<section class="section-block section-warning">
          <h3>Типичные ошибки</h3>
          <ul class="bullet-list">${commonMistakes}</ul>
        </section>`
    : '';
  const interviewWithAnswersSection = interviewWithAnswers
    ? `<section class="section-block">
          <h3>Вопросы с короткими ответами</h3>
          <ul class="bullet-list">${interviewWithAnswers}</ul>
        </section>`
    : '';
  const walkthroughSection = walkthrough
    ? `<h3>Пояснение к коду</h3>
        <ul class="bullet-list">${walkthrough}</ul>`
    : '';

  const isInterviewPack =
    topic.id.startsWith('int-ms-') ||
    topic.id.startsWith('int-stack-') ||
    topic.id.startsWith('cvb-') ||
    topic.id.startsWith('prj-') ||
    topic.id.startsWith('proc-') ||
    topic.id.startsWith('team-') ||
    topic.id.startsWith('task-') ||
    topic.id.startsWith('you-') ||
    topic.id.startsWith('gen-');
  const hasGlossary = Boolean(topic.glossary && topic.glossary.length > 0);
  const glossaryDl =
    hasGlossary && topic.glossary
      ? `<dl class="glossary-list">
          ${topic.glossary
            .map(
              (entry) =>
                `<dt class="glossary-term">${highlightTerms(entry.term)}</dt><dd class="glossary-meaning">${highlightTerms(entry.meaning)}</dd>`,
            )
            .join('')}
        </dl>`
      : '';
  const glossaryLead =
    '<p class="glossary-lead">Кратко, что значат имена и аббревиатуры в этой теме — чтобы не гуглить посреди беседы.</p>';
  const glossarySectionClasses =
    isInterviewPack && hasGlossary
      ? 'topic-section topic-section--glossary topic-section--glossary-first'
      : 'topic-section topic-section--glossary';
  const glossaryCardClasses =
    isInterviewPack && hasGlossary
      ? 'content-card content-card--glossary content-card--glossary-prominent'
      : 'content-card content-card--glossary';

  const interviewPromptLead =
    isInterviewPack && hasGlossary
      ? 'Термины — в зелёном блоке «Словарь терминов» сразу над этой карточкой. Здесь только вопросы; полный разбор и шпаргалка — ещё ниже.'
      : 'Задавайте по очереди — ответы ниже в разделе «Вопросы с короткими ответами».';

  const interviewPromptSection =
    isInterviewPack && topic.interviewFocus.length > 0
      ? `<section class="topic-section topic-section--interview-prompt">
      <h3 class="topic-section-title">Вопросы для интервью</h3>
      <div class="content-card content-card--interview-prompt">
        <p class="interview-prompt-lead">${interviewPromptLead}</p>
        <ol class="interview-prompt-list">
          ${topic.interviewFocus
            .map(
              (item) =>
                `<li class="interview-prompt-item">${highlightTerms(item.question)}</li>`,
            )
            .join('')}
        </ol>
      </div>
    </section>`
      : '';

  const glossarySection = hasGlossary
    ? `<section class="${glossarySectionClasses}">
      <h3 class="topic-section-title topic-section-title--glossary-main">Словарь терминов</h3>
      <div class="${glossaryCardClasses}">
        ${glossaryLead}
        ${glossaryDl}
      </div>
    </section>`
    : '';

  return `<article class="topic-page">
    ${glossarySection}
    ${interviewPromptSection}
    <section class="topic-section">
      <h3 class="topic-section-title">Полный разбор</h3>
      <div class="content-card">
        <section class="section-block section-definition">
          <h3>Простое определение</h3>
          <p>${highlightTerms(cvText(topic.simpleDefinition))}</p>
        </section>
        ${quickAnswerSection}
        ${explainSection}
        ${keyPointsSection}
        ${commonMistakesSection}
        ${interviewWithAnswersSection}
      </div>
    </section>

    <section class="topic-section">
      <h3 class="topic-section-title">Код и пояснения</h3>
      <article class="content-card">
        <h3>${topic.codeExample.title}</h3>
        <pre><code>${topic.codeExample.snippet.replace(/\\n/g, '\n')}</code></pre>
        ${walkthroughSection}
        ${productionNote}
        ${antiPatternBlock}
      </article>
    </section>
  </article>`;
}

function render(): void {
  if (state.activeModuleIndex < 0) {
    appRoot.innerHTML = renderModuleLanding();
    return;
  }

  const moduleData = modules[state.activeModuleIndex];
  const topic = getCurrentTopic();
  appRoot.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <button class="back-button" data-action="go-modules">← Модули</button>
        <h1>Java Intensive</h1>
        <p class="subtitle">${moduleData.title}</p>
        <section class="topic-list">${renderTopicList()}</section>
      </aside>
      <main class="content">
        <header class="content-header">
          <h2>${topic.title}</h2>
          ${
            topic.id.startsWith('int-ms-') ||
            topic.id.startsWith('int-stack-') ||
            moduleData.id === 'cv-interview'
              ? `<p class="content-header-hint">${
                  topic.glossary && topic.glossary.length > 0
                    ? 'Первый блок под заголовком темы — <strong>Словарь терминов</strong> (расшифровки из вопроса). Ниже — вопросы для беседы (карточка может «прилипать» при прокрутке).'
                    : 'Текст вопросов дублируется вверху страницы — удобно держать на экране во время беседы.'
                }</p>`
              : ''
          }
        </header>
        <section class="tab-content">${renderTopicPage(topic)}</section>
      </main>
    </div>
  `;
}

function updateTopicSelection(topicIndex: number): void {
  const topicCount = modules[state.activeModuleIndex].topics.length;
  if (topicIndex < 0 || topicIndex >= topicCount) {
    return;
  }
  state.activeTopicIndex = topicIndex;
  render();
}

function goToNextTopic(): void {
  updateTopicSelection(state.activeTopicIndex + 1);
}

function goToPreviousTopic(): void {
  updateTopicSelection(state.activeTopicIndex - 1);
}

appRoot.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }
  const element = target.closest<HTMLElement>('[data-action]');
  if (!element) {
    return;
  }
  const action = element.dataset.action;

  if (action === 'open-module') {
    const moduleIndex = Number(element.dataset.moduleIndex);
    const moduleItem = modules[moduleIndex];
    if (!Number.isNaN(moduleIndex) && moduleIndex >= 0 && moduleIndex < modules.length && moduleItem?.isAvailable !== false) {
      state.activeModuleIndex = moduleIndex;
      state.activeTopicIndex = 0;
      render();
    }
    return;
  }

  if (action === 'go-modules') {
    state.activeModuleIndex = -1;
    state.activeTopicIndex = 0;
    render();
    return;
  }

  if (action === 'select-topic') {
    const value = Number(element.dataset.topicIndex);
    updateTopicSelection(value);
    return;
  }

});

window.addEventListener('keydown', (event) => {
  if (state.activeModuleIndex < 0) {
    return;
  }
  const key = event.key;
  if (key === 'ArrowRight') {
    goToNextTopic();
    return;
  }
  if (key === 'ArrowLeft') {
    goToPreviousTopic();
    return;
  }
});

render();
