import { describe, expect, it } from "vitest";

import { resetAnalyticsSink, setAnalyticsSink, track, type AnalyticsEvent } from "@/lib/analytics";
import { INGREDIENTS_PLACEHOLDER, PRESETS, PRESET_ORDER, presetShopUrl } from "@/lib/quiz/presets";
import { QUESTIONS, visibleQuestions } from "@/lib/quiz/questions";
import { scoreQuiz } from "@/lib/quiz/scoring";

describe("quiz scoring", () => {
  it("recommends Junior alone when the quiz is for a child", () => {
    const out = scoreQuiz({ q1: "child" });
    expect(out.primary).toBe("junior");
    expect(out.secondary).toBeNull();
  });

  it("makes the Q2 choice the main match when nothing else adds up", () => {
    expect(scoreQuiz({ q1: "me", q2: "skin" }).primary).toBe("glow");
  });

  it("breaks a tie in favour of the preset chosen in Q2", () => {
    // Q2 "everyday" = Essential +2, Q4 "stressed" = Balance +2.
    const out = scoreQuiz({ q1: "me", q2: "everyday", q4: "stressed" });
    expect(out.scores.essential).toBe(2);
    expect(out.scores.balance).toBe(2);
    expect(out.primary).toBe("essential");
  });

  it("breaks the same tie the other way when Q2 picked Balance", () => {
    const out = scoreQuiz({ q1: "me", q2: "balanced", q4: "good" });
    expect(out.primary).toBe("balance");
    expect(out.secondary).toBe("essential");
  });

  it("names the second-highest preset as the secondary recommendation", () => {
    // Active: Q2 +2 and Q3 +2. Essential: Q6 +2.
    const out = scoreQuiz({ q1: "me", q2: "sports", q3: "movement", q6: "vegan" });
    expect(out.scores.active).toBe(4);
    expect(out.scores.essential).toBe(2);
    expect(out.primary).toBe("active");
    expect(out.secondary).toBe("essential");
  });

  it("lets a yes on the cycle question overtake an everyday match", () => {
    const out = scoreQuiz({ q1: "me", q2: "everyday", q7: "yes" });
    expect(out.scores.cycle).toBe(3);
    expect(out.scores.essential).toBe(2);
    expect(out.primary).toBe("cycle");
    expect(out.secondary).toBe("essential");
  });

  it("adds up the point values written in the question config", () => {
    // Q5 "5+ times per week" is worth Active +2 on its own.
    const out = scoreQuiz({ q1: "me", q5: "daily" });
    expect(out.scores.active).toBe(2);
    expect(out.primary).toBe("active");
  });

  it("never offers Junior as the secondary recommendation", () => {
    const out = scoreQuiz({ q1: "me", q2: "everyday", q3: "busy", q4: "tired", q5: "rarely", q6: "balanced" });
    expect(out.primary).toBe("essential");
    expect(out.secondary).not.toBe("junior");
    expect(out.scores.junior).toBe(0);
  });

  it("asks the cycle question only when the quiz is for the person answering", () => {
    expect(visibleQuestions({ q1: "me" }).map((q) => q.id)).toContain("q7");
    expect(visibleQuestions({}).map((q) => q.id)).not.toContain("q7");
    expect(visibleQuestions({ q1: "child" }).map((q) => q.id)).not.toContain("q7");
  });

  it("keeps every question reachable from the config", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(["q1", "q2", "q3", "q4", "q5", "q6", "q7"]);
    for (const question of QUESTIONS) {
      for (const option of question.options) {
        expect(option.next === "result" || QUESTIONS.some((q) => q.id === option.next)).toBe(true);
      }
    }
  });
});

describe("quiz presets", () => {
  it("has a preset for every collection", () => {
    expect(PRESET_ORDER).toEqual(["essential", "glow", "balance", "active", "focus", "cycle", "junior"]);
    for (const id of PRESET_ORDER) expect(PRESETS[id].id).toBe(id);
  });

  it("lists ingredients for every preset", () => {
    expect(PRESETS.essential.ingredients).toContain("Thiamin (B1)");
    expect(PRESETS.glow.ingredients).toContain("Biotin (B7)");
    expect(PRESETS.balance.ingredients).toContain("Ashwagandha (KSM-66)");
    expect(PRESETS.cycle.ingredients).toContain("Iron (bisglycinate)");
    expect(PRESETS.junior.ingredients?.some((i) => /extract|caffeine/i.test(i))).toBe(false);
    expect(INGREDIENTS_PLACEHOLDER).toBe("Ingredients coming soon");
  });

  it("puts the quiz UTM parameters on every shop link", () => {
    expect(presetShopUrl("essential")).toBe(
      "/shop/essential-starter-kit?utm_source=quiz&utm_medium=website&utm_campaign=preset_finder",
    );
    for (const id of PRESET_ORDER) {
      expect(presetShopUrl(id)).toContain("utm_source=quiz");
      expect(presetShopUrl(id)).toContain("utm_medium=website");
      expect(presetShopUrl(id)).toContain("utm_campaign=preset_finder");
    }
  });

  it("keeps preset wording free of medical or performance claims", () => {
    const banned = ["cure", "cures", "prevent", "treat", "heal", "boosts your immune", "guarantee"];
    for (const id of PRESET_ORDER) {
      const text = `${PRESETS[id].name} ${PRESETS[id].blurb}`.toLowerCase();
      for (const word of banned) expect(text).not.toContain(word);
    }
  });
});

describe("analytics helper", () => {
  it("sends events to the sink you plug in", () => {
    const seen: AnalyticsEvent[] = [];
    setAnalyticsSink((event) => seen.push(event));
    track("quiz_started", { questions: 7 });
    track("result_cta_clicked", { preset: "Essential", link: "/shop/essential-starter-kit" });
    resetAnalyticsSink();

    expect(seen).toEqual([
      { name: "quiz_started", params: { questions: 7 } },
      { name: "result_cta_clicked", params: { preset: "Essential", link: "/shop/essential-starter-kit" } },
    ]);
  });
});
