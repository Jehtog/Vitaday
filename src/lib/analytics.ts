// ANALYTICS — one small helper for quiz events.
// Events are pushed to window.dataLayer (Google Analytics reads that) and to a sink you can
// swap out with setAnalyticsSink(), e.g. to forward them somewhere else.
export type AnalyticsParam = string | number | boolean | undefined;
export type AnalyticsParams = Record<string, AnalyticsParam>;

export type AnalyticsEventName =
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "result_cta_clicked";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  params: AnalyticsParams;
}

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function dataLayerSink(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: event.name, ...event.params });
  if (typeof w.gtag === "function") w.gtag("event", event.name, event.params);
}

let sink: (event: AnalyticsEvent) => void = dataLayerSink;

/** Replace where events go — pass a function that forwards them to your analytics tool. */
export function setAnalyticsSink(next: (event: AnalyticsEvent) => void) {
  sink = next;
}

/** Back to the default dataLayer sink. */
export function resetAnalyticsSink() {
  sink = dataLayerSink;
}

export function track(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  try {
    sink({ name, params });
  } catch {
    // Analytics must never break the quiz.
  }
}
