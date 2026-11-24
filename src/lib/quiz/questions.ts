// QUIZ QUESTIONS — question copy, answer labels and point values live here.
// Change a number, add an answer or re-word a question without touching any component.
import type { PresetId } from "./presets";

export type QuestionId = "q2" | "q3" | "q4" | "q5" | "q6" | "q7";
export type OptionId = string;

/** answers[question id] = the chosen answer's option id. */
export type AnswerMap = Partial<Record<QuestionId, OptionId>>;

export interface QuizOption {
  id: OptionId;
  label: string;
  /** Points each preset gets for this answer. Edit the numbers freely. */
  points?: Partial<Record<PresetId, number>>;
  /** Ends the quiz straight away and recommends this preset on its own. */
  resultPreset?: PresetId;
  /** The next question to ask, or "result" to finish. */
  next: QuestionId | "result";
}

export interface QuizQuestion {
  id: QuestionId;
  prompt: string;
  /** Asked only while this returns true. */
  showIf?: (answers: AnswerMap) => boolean;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q2",
    prompt: "What do you want to support most?",
    // Every answer here is worth double (2 points) — this is the strongest signal in the quiz.
    options: [
      { id: "everyday", label: "Everyday wellbeing and basics", points: { essential: 2 }, next: "q3" },
      { id: "skin", label: "Skin, hair and nails", points: { glow: 2 }, next: "q3" },
      { id: "balanced", label: "Feeling balanced, stress, sleep", points: { balance: 2 }, next: "q3" },
      { id: "sports", label: "Sports and energy", points: { active: 2 }, next: "q3" },
      { id: "concentration", label: "Concentration and mental performance", points: { focus: 2 }, next: "q3" },
      { id: "cycle", label: "My cycle", points: { cycle: 2 }, next: "q3" },
    ],
  },
  {
    id: "q3",
    prompt: "What does your daily life look like?",
    options: [
      { id: "desk", label: "Studying or desk job", points: { focus: 1, balance: 1 }, next: "q4" },
      { id: "movement", label: "Lots of movement or sports", points: { active: 2 }, next: "q4" },
      { id: "busy", label: "Busy and unpredictable", points: { essential: 1, balance: 1 }, next: "q4" },
      { id: "family", label: "Family and caring for others", points: { essential: 1, balance: 1 }, next: "q4" },
    ],
  },
  {
    id: "q4",
    prompt: "How do you feel most days?",
    options: [
      { id: "tired", label: "Tired", points: { active: 1, balance: 1, essential: 1 }, next: "q5" },
      { id: "stressed", label: "Stressed", points: { balance: 2 }, next: "q5" },
      { id: "scattered", label: "Hard to concentrate", points: { focus: 2 }, next: "q5" },
      { id: "good", label: "Pretty good, I just want to stay on track", points: { essential: 2 }, next: "q5" },
    ],
  },
  {
    id: "q5",
    prompt: "How often do you exercise?",
    options: [
      { id: "rarely", label: "Rarely", points: { essential: 1 }, next: "q6" },
      { id: "sometimes", label: "1–2 times per week", points: { balance: 1 }, next: "q6" },
      { id: "often", label: "3–4 times per week", points: { active: 1 }, next: "q6" },
      { id: "daily", label: "5+ times per week", points: { active: 2 }, next: "q6" },
    ],
  },
  {
    id: "q6",
    prompt: "How do you eat?",
    options: [
      { id: "balanced", label: "Balanced", points: { essential: 1 }, next: "q7" },
      { id: "vegetarian", label: "Vegetarian", points: { essential: 1 }, next: "q7" },
      { id: "vegan", label: "Vegan", points: { essential: 2 }, next: "q7" },
      { id: "irregular", label: "Irregular", points: { essential: 1, balance: 1 }, next: "q7" },
    ],
  },
  {
    id: "q7",
    prompt: "Would you like support around your cycle?",
    options: [
      { id: "yes", label: "Yes", points: { cycle: 3 }, next: "result" },
      { id: "no", label: "No", next: "result" },
      { id: "undecided", label: "Prefer not to say", next: "result" },
    ],
  },
];

/** The questions a person actually sees, in order, given the answers so far. */
export function visibleQuestions(answers: AnswerMap): QuizQuestion[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

/** The single preset an answer stands for, or null when it points at more than one. */
export function optionPreset(option: QuizOption | undefined): PresetId | null {
  const keys = Object.keys(option?.points ?? {}) as PresetId[];
  return keys.length === 1 ? keys[0] ?? null : null;
}
