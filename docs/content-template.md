# Content Template

Use this template for every new topic in any module:

```ts
{
  id: 'unique-topic-id',
  title: 'Topic title',
  priority: 'core', // or 'optional'
  quickAnswer: '20-second answer for live lecture',
  explainBrief: [
    'What it is in one sentence.',
    'Why it matters in production.',
    'Most common beginner mistake.',
  ],
  interviewFocus: [
    {
      question: 'Typical interview question?',
      expectedAnswer: 'Concise expected answer with key terms.',
    },
  ],
  codeExample: {
    title: 'Short practical Java snippet',
    language: 'java',
    snippet: `class Demo {}`,
    walkthrough: [
      'How to explain line by line.',
      'Why this snippet matters for interview or production.',
    ],
    commonPitfall: 'Typical mistake with this code.',
  },
  practiceHint: {
    task: 'Hands-on mini task for interns.',
    timeboxMinutes: 5,
    expectedOutcome: 'What students should show at the end.',
    mentorCheck: 'How mentor quickly validates result.',
  },
  lecturerNotes: [
    'Memory trigger for lecturer.',
    'Edge case to mention in Q&A.',
  ],
  estimatedMinutes: 2,
}
```

Rules:
- Keep `explainBrief` short and practical.
- Keep examples compilable and interview-oriented with walkthrough.
- Always include one anti-pattern discussion in notes.
- Keep `estimatedMinutes` realistic to fit one-hour sessions.
