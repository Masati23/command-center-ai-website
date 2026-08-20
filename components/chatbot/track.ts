// Same fire-and-forget beacon pattern already used for buy_click/consult_click
// in components/Services.tsx — reused here rather than reimplemented so the
// new assistant panel's analytics behave identically (never blocks or
// delays the UI, survives immediate navigation). No new tracking surface:
// this posts to the existing /api/track endpoint and the existing EventLog
// table, just with a few additional event `type` values.
export type AssistantEventType =
  | "assistant_auto_open"
  | "assistant_closed"
  | "quick_action_clicked"
  | "booking_opened"
  | "booking_completed";

export function trackAssistantEvent(type: AssistantEventType, detail?: string) {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({ type, productSlug: detail ?? type });
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/track", blob);
    if (sent) return;
  }
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
