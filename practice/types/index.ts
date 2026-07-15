export enum QuestionType {
  MCQ = "mcq",
  MULTIPLE_CORRECT = "multiple_correct",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  LONG_ANSWER = "long_answer",
  FILL_BLANK = "fill_blank",
}

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum ExamStatus {
  DRAFT = "draft",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SUBMITTED = "submitted",
}

export enum QuestionStatus {
  UNANSWERED = "unanswered",
  ANSWERED = "answered",
  SKIPPED = "skipped",
  REVIEW = "review",
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  difficulty: QuestionDifficulty;
  order: number;
  createdAt: string;
}

export interface PracticeExam {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  difficulty: QuestionDifficulty;
  totalMarks: number;
  duration: number;
  passingMarks?: number;
  negativeMarks?: number;
  instructions: string;
  tags: string[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  status: ExamStatus;
}

export interface UserAnswer {
  questionId: string;
  value: string | string[];
  timeSpent: number;
  flagged: boolean;
}

export interface ExamSession {
  id: string;
  examId: string;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, UserAnswer>;
  timeRemaining: number;
  status: ExamStatus;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  isPartial: boolean;
  marksObtained: number;
  marksPossible: number;
  timeSpent: number;
}

export interface ExamResult {
  id: string;
  sessionId: string;
  examId: string;
  totalQuestions: number;
  answered: number;
  skipped: number;
  correct: number;
  wrong: number;
  partiallyCorrect: number;
  accuracy: number;
  score: number;
  negativeMarks: number;
  timeTaken: number;
  avgTimePerQuestion: number;
  completionPercentage: number;
  questionResults: QuestionResult[];
  submittedAt: string;
}

export interface PracticeData {
  exams: PracticeExam[];
  sessions: ExamSession[];
  results: ExamResult[];
}

export interface ParsedQuestion {
  raw: string;
  type: QuestionType;
  text: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  questionIndex?: number;
}
