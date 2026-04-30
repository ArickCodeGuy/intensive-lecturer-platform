export type TopicPriority = 'core' | 'optional';

export interface TopicCodeExample {
  title: string;
  language: 'java' | 'text';
  snippet: string;
  walkthrough: string[];
  commonPitfall: string;
  antiPatternSnippet?: string;
  antiPatternNote?: string;
  productionNote?: string;
}

export interface TopicResourceLink {
  title: string;
  url: string;
  description: string;
}

export interface TopicInterviewQuestion {
  question: string;
  expectedAnswer: string;
  /**
   * Для CV-интервью: один и тот же вопрос, но разные ориентиры ответа по уровню.
   * Если поле задано, UI может показывать ответ по выбранному уровню.
   */
  expectedAnswerByLevel?: {
    middle: string;
    senior: string;
  };
}

/** Краткие расшифровки терминов (англ. аббревиатуры, имена продуктов) для лектора. */
export interface TopicGlossaryEntry {
  term: string;
  meaning: string;
}

export interface TopicQuestionPlanItem {
  question: string;
  answerHint: string;
}

export interface TopicPracticeHint {
  task: string;
  timeboxMinutes: number;
  expectedOutcome: string;
  mentorCheck: string;
}

export interface TopicContent {
  id: string;
  title: string;
  priority: TopicPriority;
  simpleDefinition: string;
  quickAnswer: string;
  explainBrief: string[];
  questionPlan?: TopicQuestionPlanItem[];
  keyPoints: string[];
  commonMistakes: string[];
  selfCheck: string[];
  interviewFocus: TopicInterviewQuestion[];
  interviewTraps: string[];
  codeExample: TopicCodeExample;
  usefulLinks: TopicResourceLink[];
  estimatedMinutes: number;
  glossary?: TopicGlossaryEntry[];
}

export interface LectureModule {
  id: string;
  title: string;
  targetDurationMinutes: number;
  audienceLevel: string;
  topics: TopicContent[];
  isAvailable?: boolean;
  activeElements?: number;
  progressDone?: number;
  progressTotal?: number;
  lockedReason?: string;
  summary?: string;
  /** Подзаголовок на карточке в блоке «Интервью» на главной (только для модулей с id `interview-*`). */
  interviewSectionKicker?: string;
}
