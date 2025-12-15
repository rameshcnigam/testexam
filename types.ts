export enum SectionType {
  COMMON = "खंड 1: सामान्य अध्याय",
  LIFE = "खंड 2: जीवन बीमा",
  HEALTH = "खंड 3: स्वास्थ्य बीमा"
}

export interface Chapter {
  id: number;
  title: string;
  section: SectionType;
  description: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<number, number>; // questionId -> optionIndex
  isFinished: boolean;
  score: number;
}

export type ViewState = 'DASHBOARD' | 'LOADING' | 'QUIZ' | 'RESULTS';
