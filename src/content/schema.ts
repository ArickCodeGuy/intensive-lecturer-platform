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
  keyPoints: string[];
  commonMistakes: string[];
  selfCheck: string[];
  interviewFocus: TopicInterviewQuestion[];
  interviewTraps: string[];
  codeExample: TopicCodeExample;
  usefulLinks: TopicResourceLink[];
  estimatedMinutes: number;
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
}
