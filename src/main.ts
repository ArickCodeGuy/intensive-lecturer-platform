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

const INTERVIEW_MODULE_ID = 'interview-ms';

function renderModuleLanding(): string {
  const interviewIndex = modules.findIndex((m) => m.id === INTERVIEW_MODULE_ID);
  const interviewModule = interviewIndex >= 0 ? modules[interviewIndex] : undefined;
  const coreModules = modules.filter((m) => m.id !== INTERVIEW_MODULE_ID);

  const cards = coreModules
    .map((moduleItem, displayIndex) => {
      const index = modules.indexOf(moduleItem);
      const isAvailable = moduleItem.isAvailable !== false;
      const cardClass = isAvailable ? 'module-card' : 'module-card locked';
      const actionAttr = isAvailable ? 'data-action="open-module"' : '';
      const lockText = !isAvailable && moduleItem.lockedReason ? `<p class="module-lock">${moduleItem.lockedReason}</p>` : '';
      return `<button class="${cardClass}" ${actionAttr} data-module-index="${index}">
        <p class="module-kicker">Модуль ${displayIndex + 1}</p>
        <h2>${moduleItem.title}</h2>
        <p class="module-description">${moduleItem.summary ?? `Тем: ${moduleItem.topics.length}.`}</p>
        ${lockText}
      </button>`;
    })
    .join('');

  if (!interviewModule || interviewIndex < 0) {
    return `<section class="module-landing">
    <div class="module-hero">
      <h1>Java Intensive Studio</h1>
      <p>Материалы интенсивов по модулям.</p>
    </div>
    <div class="module-grid">${cards}</div>
  </section>`;
  }

  const interviewAvailable = interviewModule?.isAvailable !== false;
  const interviewCardClass = interviewAvailable ? 'module-card module-card--interview' : 'module-card locked';
  const interviewAction = interviewAvailable ? 'data-action="open-module"' : '';
  const interviewLock =
    !interviewAvailable && interviewModule?.lockedReason
      ? `<p class="module-lock">${interviewModule.lockedReason}</p>`
      : '';

  const interviewBlock = `<div class="interview-landing-block">
    <h2 class="interview-landing-title">Интервью</h2>
    <p class="interview-landing-intro">Те же вкладки и структура, что у тем модулей: кратко, вопрос — ответ, схемы.</p>
    <div class="module-grid module-grid--interview">
      <button type="button" class="${interviewCardClass}" ${interviewAction} data-module-index="${interviewIndex}">
        <p class="module-kicker">Микросервисы и эксплуатация</p>
        <h2>${interviewModule.title}</h2>
        <p class="module-description">${interviewModule.summary ?? `Тем: ${interviewModule.topics.length}.`}</p>
        ${interviewLock}
      </button>
    </div>
  </div>`;

  return `<section class="module-landing">
    <div class="module-hero">
      <h1>Java Intensive Studio</h1>
      <p>Материалы интенсивов по модулям.</p>
    </div>
    <div class="module-grid">${cards}</div>
    ${interviewBlock}
  </section>`;
}

function renderTopicList(): string {
  const moduleData = modules[state.activeModuleIndex];
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

function renderTopicPage(topic: TopicContent): string {
  const lines = topic.explainBrief.map((line) => `<li>${highlightTerms(line)}</li>`).join('');
  const keyPoints = topic.keyPoints.map((line) => `<li>${renderHighlightedLine(line)}</li>`).join('');
  const commonMistakes = topic.commonMistakes.map((line) => `<li>${renderMistakeLine(topic, line)}</li>`).join('');
  const interviewWithAnswers = topic.interviewFocus
    .map(
      (item) =>
        `<li class="qa-item"><span class="qa-question">${highlightTerms(item.question)}</span><span class="qa-answer">${highlightTerms(item.expectedAnswer)}</span></li>`,
    )
    .join('');
  const quickAnswerSection =
    normalizeViewText(topic.simpleDefinition).includes(normalizeViewText(topic.quickAnswer))
      ? ''
      : `<section class="section-block section-answer">
      <h3>Короткий ответ</h3>
      <p>${highlightTerms(topic.quickAnswer)}</p>
    </section>`;

  const walkthrough = topic.codeExample.walkthrough.map((line) => `<li>${line}</li>`).join('');
  const antiPatternBlock = topic.codeExample.antiPatternSnippet
    ? `<h3>Антипример (как делать не стоит)</h3>
    <pre><code>${topic.codeExample.antiPatternSnippet}</code></pre>
    <article class="pitfall-card"><strong>Почему плохо:</strong> ${topic.codeExample.antiPatternNote ?? topic.codeExample.commonPitfall}</article>`
    : '';
  const productionNote = topic.codeExample.productionNote
    ? `<article class="section-block section-success"><h3>Production заметка</h3><p>${topic.codeExample.productionNote}</p></article>`
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

  const isInterviewPack = topic.id.startsWith('int-ms-');
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
          <p>${highlightTerms(topic.simpleDefinition)}</p>
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
        <pre><code>${topic.codeExample.snippet}</code></pre>
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
            topic.id.startsWith('int-ms-')
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
