// QUIZ SCORING — pure function over the answer map. Nothing here touches React.
import { PRESET_ORDER, type PresetId } from "./presets";
import { QUESTIONS, optionPreset, type AnswerMap, type QuizOption, type QuizQuestion } from "./questions";

export interface QuizOutcome {
  primary: PresetId;
  /** null when nothing else scored above zero. */
  secondary: PresetId | null;
  scores: Record<PresetId, number>;
}

function emptyScores(): Record<PresetId, number> {
  const scores = {} as Record<PresetId, number>;
  for (const id of PRESET_ORDER) scores[id] = 0;
  return scores;
}

function asked(question: QuizQuestion, answers: AnswerMap): QuizOption | undefined {
  const chosen = answers[question.id];
  return chosen ? question.options.find((o) => o.id === chosen) : undefined;
}

function questionById(id: QuizQuestion["id"]): QuizQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/** The preset picked in Q2 — used to break ties, because it is the strongest signal. */
function preferredPreset(answers: AnswerMap): PresetId | null {
  const q2 = questionById("q2");
  if (!q2) return null;
  return optionPreset(asked(q2, answers));
}

export function scoreQuiz(answers: AnswerMap): QuizOutcome {
  const scores = emptyScores();

  for (const question of QUESTIONS) {
    const option = asked(question, answers);
    if (!option) continue;
    // An answer may end the quiz outright and name its own result.
    if (option.resultPreset) return { primary: option.resultPreset, secondary: null, scores };
    for (const [preset, points] of Object.entries(option.points ?? {})) {
      scores[preset as PresetId] = (scores[preset as PresetId] ?? 0) + (points ?? 0);
    }
  }

  const preferred = preferredPreset(answers);
  const ranked = [...PRESET_ORDER].sort(
    (a, b) =>
      (scores[b] ?? 0) - (scores[a] ?? 0) ||
      (a === preferred ? 0 : 1) - (b === preferred ? 0 : 1) ||
      PRESET_ORDER.indexOf(a) - PRESET_ORDER.indexOf(b),
  );

  const primary = ranked.find((id) => (scores[id] ?? 0) > 0) ?? "essential";
  const secondary = ranked.find((id) => id !== primary && (scores[id] ?? 0) > 0) ?? null;

  return { primary, secondary, scores };
}
