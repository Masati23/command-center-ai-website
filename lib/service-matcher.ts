/**
 * Deterministic service-intent matcher — adapted from the Command Center AI
 * Academy project's course-matcher.ts (cc-stripe/lib/course-matcher.ts),
 * same architecture: regex patterns (English and Spanish) over the
 * visitor's raw message decide which service (if any) is the strongest
 * match, independent of anything the AI model outputs. This is what
 * powers `recommendedServiceSlug` for chat analytics — the visible reply
 * text and its section link still come from the model (instructed via
 * lib/chatbot-knowledge.ts), this just gives a reliable, model-independent
 * signal for logging and the Service Interest dashboard.
 *
 * DIY_PATTERNS is the .net equivalent of the Academy matcher's DFY
 * patterns, just inverted: Academy detects "I want it built for me" to
 * redirect toward commandcenterai.net; here we detect "I want to learn/
 * build it myself" to redirect toward CommandCenterAIAcademy.com.
 */

export type ServiceMatch = { slug: string; score: number };

const SERVICE_PATTERNS: Record<string, RegExp[]> = {
  "ai-website-chatbot": [
    /\bchatbot\b/i, /\bchat bot\b/i, /\bwebsite (chat|bot|assistant)\b/i,
    /\banswer(ing)? (customer )?questions? (automatically|24\/7|on my site|on the website)\b/i,
    /\bmiss(ing)? (website )?visitors?\b/i, /\bcapture leads? (on|from) (my|the) (website|site)\b/i,
    /\bchatbot de\b/i, /\brespond(er)? preguntas? autom/i, /\bnunca pierd[ao].*visitante/i,
  ],
  "ai-appointment-booking": [
    /\bappointment/i, /\bbooking\b/i, /\bschedul(e|ing)\b/i, /\bno.?shows?\b/i,
    /\bmissed calls?\b/i, /\bcalendar\b/i, /\breminders?\b/i,
    /\bcitas?\b/i, /\breservas?\b/i, /\bagendar\b/i, /\bllamadas? perdidas?\b/i,
  ],
  "ai-lead-generation": [
    /\blead(s)? generation\b/i, /\bmore (leads?|customers?|clients?)\b/i, /\bfind (new )?customers?\b/i,
    /\bqualif(y|ied|ying) (leads?|prospects?)\b/i, /\bneed (more )?(leads?|clients?|business)\b/i,
    /\bgrow (my|our) (client base|customer base)\b/i,
    /\bm[áa]s (leads?|clientes?)\b/i, /\bnecesito.*negocio\b/i, /\bgenerar leads?\b/i,
  ],
  "ai-business-command-center": [
    /\bcommand center\b/i, /\bcomplete (business )?system\b/i, /\ball.?in.?one\b/i,
    /\beverything (together|connected|combined)\b/i, /\bautomate (as much|everything|my whole business)\b/i,
    /\bfull (ai )?dashboard\b/i, /\bconectar todo\b/i, /\bsistema completo\b/i,
  ],
  "ai-customer-support-system": [
    /\bcustomer support\b/i, /\bsupport tickets?\b/i, /\bhelp desk\b/i, /\bsupport (system|automation)\b/i,
    /\banswer(ing)? support (questions?|tickets?)\b/i, /\btriage\b/i, /\bfaqs?\b/i,
    /\bsoporte al cliente\b/i, /\btickets? de soporte\b/i,
  ],
  "ai-voice-receptionist-phone-agent": [
    /\bvoice agent\b/i, /\breceptionist\b/i, /\bphone (automation|agent|calls?)\b/i, /\bmiss(ing)? (phone )?calls?\b/i,
    /\banswer(ing)? (the )?phone\b/i, /\bAI (that )?answers? calls?\b/i, /\bvoicemail\b/i,
    /\bagente de voz\b/i, /\brecepcionista\b/i, /\bllamadas? telef[óo]nicas?\b/i, /\bcontestar llamadas?\b/i,
  ],
  "ai-sales-crm-automation": [
    /\bCRM\b/i, /\bsales pipeline\b/i, /\bdeal(s)? (tracking|pipeline)\b/i, /\bfollow.?ups?\b/i,
    /\btrack(ing)? (deals?|prospects?)\b/i, /\bsales automation\b/i,
    /\bpipeline de ventas\b/i, /\bseguimiento de (ventas|clientes)\b/i,
  ],
  "ai-estimates-invoicing": [
    /\bestimate(s)?\b/i, /\binvoic(e|es|ing)\b/i, /\bquote(s)?\b/i, /\bbilling\b/i,
    /\bpayment reminders?\b/i, /\boverdue (payments?|balances?)\b/i, /\bunpaid\b/i,
    /\bestimados?\b/i, /\bfacturas?\b/i, /\bcotizaci[óo]n(es)?\b/i, /\bpagos? (vencidos?|atrasados?)\b/i,
  ],
  "ai-reputation-management": [
    /\breview(s)?\b/i, /\breputation\b/i, /\brating(s)?\b/i, /\btestimonials?\b/i,
    /\bgoogle reviews?\b/i, /\bunhappy customers?\b/i, /\bnegative feedback\b/i,
    /\brese[ñn]as?\b/i, /\breputaci[óo]n\b/i, /\bcalificaciones?\b/i,
  ],
  "ai-employee-knowledge-assistant": [
    /\bemployee(s)? (questions?|knowledge|training)\b/i, /\binternal knowledge\b/i, /\bonboarding\b/i,
    /\bcompany (polic(y|ies)|procedures?)\b/i, /\bstaff training\b/i, /\btrain(ing)? (new )?employees?\b/i,
    /\bempleados?\b/i, /\bcapacitaci[óo]n\b/i, /\bpol[íi]ticas? de la empresa\b/i,
  ],
};

const DIY_PATTERNS: RegExp[] = [
  /\bteach me\b/i, /\blearn to build\b/i, /\bbuild it myself\b/i, /\bdo it myself\b/i,
  /\bDIY\b/, /\bwant to learn\b/i, /\bhow do I build\b/i, /\btake a course\b/i,
  /\bdon'?t want to (pay|hire)\b/i, /\bnot ready to buy\b/i, /\blearn how to (make|build|create)\b/i,
  /\bense[ñn]ame\b/i, /\baprender a construir\b/i, /\bconstru[ií]rlo yo mismo\b/i, /\bhacerlo yo mismo\b/i,
  /\bquiero aprender\b/i,
];

/**
 * Returns matched services ranked by how many distinct patterns matched
 * (a rough but deterministic confidence signal), and whether DIY/learning
 * intent was detected. Only the message text is used — no dependency on
 * model output.
 */
export function matchServiceIntent(message: string): { services: ServiceMatch[]; diy: boolean } {
  const diy = DIY_PATTERNS.some((p) => p.test(message));

  const services: ServiceMatch[] = [];
  for (const [slug, patterns] of Object.entries(SERVICE_PATTERNS)) {
    const score = patterns.filter((p) => p.test(message)).length;
    if (score > 0) services.push({ slug, score });
  }
  services.sort((a, b) => b.score - a.score);

  return { services, diy };
}

/**
 * Single best-guess service slug for this message, or null if no match
 * (or the match is too ambiguous — several equally-strong candidates — to
 * act on confidently). Used only for logging/analytics
 * (recommendedServiceSlug), not to alter the visible chat reply.
 */
export function decideRecommendedService(message: string): string | null {
  const { services } = matchServiceIntent(message);
  if (services.length === 0) return null;

  const topScore = services[0].score;
  const topMatches = services.filter((s) => s.score === topScore);
  if (topMatches.length > 1) return null; // ambiguous — don't guess

  return topMatches[0].slug;
}
