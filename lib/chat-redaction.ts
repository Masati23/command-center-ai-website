/**
 * Redacts obvious sensitive information from chat messages before they are
 * ever written to the database. This is defense-in-depth, not a substitute
 * for asking visitors not to share sensitive info (see the in-chat privacy
 * notice) - it catches common patterns but is not a guarantee.
 *
 * Ported as-is from the Command Center AI Academy project
 * (cc-stripe/lib/chat-redaction.ts) — proven, self-contained, no
 * dependencies, so no adaptation needed for CommandCenterAI.net.
 */
export function redactSensitiveInfo(text: string): string {
  let redacted = text;

  // Credit/debit card numbers (13-19 digits, with or without spaces/dashes)
  redacted = redacted.replace(/\b(?:\d[ -]*?){13,19}\b/g, "[REDACTED_CARD_NUMBER]");

  // Social Security Numbers (US format)
  redacted = redacted.replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, "[REDACTED_SSN]");

  // Common API key / token patterns
  redacted = redacted.replace(/\b(sk|pk|rk)_(live|test)_[A-Za-z0-9]{10,}\b/g, "[REDACTED_API_KEY]");
  redacted = redacted.replace(/\bBearer\s+[A-Za-z0-9._-]{15,}\b/gi, "[REDACTED_TOKEN]");
  redacted = redacted.replace(/\b[A-Za-z0-9._-]{25,}\b/g, (match) =>
    /^[A-Za-z0-9._-]+$/.test(match) && /[A-Z]/.test(match) && /[0-9]/.test(match)
      ? "[REDACTED_POSSIBLE_TOKEN]"
      : match
  );

  // Explicit "password: xxx" / "password is xxx" patterns
  redacted = redacted.replace(/\b(password|passwd|pwd)\s*(is|:|=)\s*\S+/gi, "$1 [REDACTED_PASSWORD]");

  return redacted;
}
