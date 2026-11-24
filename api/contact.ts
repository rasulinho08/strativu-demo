/**
 * Vercel serverless function: POST /api/contact
 *
 * Saytın formlarını (Contact, GRC360 early access) korporativ poçta göndərir. Açar heç vaxt brauzerə getmir.
 * Göndərmə xidməti: Brevo (əsas). Keçid dövründə BREVO_API_KEY yoxdursa, köhnə Resend açarı ilə göndərir.
 * Vercel → Project → Settings → Environment Variables:
 *   BREVO_API_KEY   → Brevo API açarı (SMTP & API → API Keys; MCP açarı yox, adi API açarı)
 *   RESEND_API_KEY  → (köhnə) yalnız BREVO_API_KEY yoxdursa istifadə olunur; Brevo işləyəndən sonra silin
 *   CONTACT_TO      → mesajların gələcəyi ünvan (yoxdursa: contact@strativu.com; vergüllə bir neçə ünvan olar)
 *   CONTACT_FROM    → göndərən, "Ad <email>" formatında; Brevo-da təsdiqlənmiş domendə olmalıdır
 *                     (yoxdursa: "Strativu Website <noreply@strativu.com>")
 * Heç bir açar yoxdursa 503 + code "NOT_CONFIGURED" qaytarır → sayt formu köhnə yolla (Formspree) göndərir.
 */
declare const process: { env: Record<string, string | undefined> };

type Req = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> };
type Res = {
  setHeader: (k: string, v: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Sahə adları və məktubdakı başlıqları (sıra ilə). Başqa sahələr qəbul edilmir. */
const LABELS: Record<string, string> = {
  form: "Form",
  name: "Name",
  email: "Email",
  company: "Company",
  role: "Role",
  topic: "Topic",
  frameworks: "Frameworks",
  message: "Message",
  consent: "Consent",
};
const MAX = 5000;

/**
 * Yalnız saytın öz səhifələrindən gələn sorğular qəbul olunur (brauzer POST-da həmişə Origin göndərir).
 * Origin-siz və ya başqa domendən gələn sorğu (bot, başqa sayt) 403 alır. Əlavə domen: CONTACT_ALLOWED_ORIGINS (vergüllə).
 */
const ALLOWED_ORIGINS = ["https://strativu.com", "https://www.strativu.com"];
function originAllowed(origin: string) {
  if (!origin) return false;
  const extra = (process.env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if ([...ALLOWED_ORIGINS, ...extra].includes(origin)) return true;
  // lokal yoxlama (vite preview / vercel dev)
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) && process.env.VERCEL_ENV !== "production";
}

const clean = (v: unknown) =>
  String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, MAX);
const oneLine = (v: string) => v.replace(/\s+/g, " ").slice(0, 200);
/** "Strativu Website <noreply@strativu.com>" → { name, email }; ad yoxdursa yalnız email. */
function parseAddress(v: string) {
  const m = v.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { ...(m[1] ? { name: m[1].replace(/^"|"$/g, "") } : {}), email: m[2].trim() } : { email: v.trim() };
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const header = (k: string) => {
    const v = req.headers?.[k];
    return (Array.isArray(v) ? v[0] : v) ?? "";
  };
  if (!originAllowed(header("origin"))) return res.status(403).json({ error: "Forbidden" });
  if (!header("content-type").toLowerCase().startsWith("application/json")) return res.status(415).json({ error: "Unsupported content type" });

  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!brevoKey && !resendKey) return res.status(503).json({ code: "NOT_CONFIGURED", error: "Email sending is not configured" });

  let body: Record<string, unknown> = {};
  try {
    body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Record<string, unknown>;
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid request" });

  // Spam tələsi: gizli sahə doludursa, uğurlu kimi cavab ver, amma göndərmə.
  if (clean(body._gotcha)) return res.status(200).json({ ok: true });

  const f: Record<string, string> = {};
  for (const k of Object.keys(LABELS)) {
    const v = clean(body[k]);
    if (v) f[k] = v;
  }

  const errors: { field: string; message: string }[] = [];
  if (!f.name) errors.push({ field: "name", message: "Please enter your full name." });
  if (!f.email || !EMAIL_RE.test(f.email) || f.email.length > 254)
    errors.push({ field: "email", message: "Please enter a valid email address." });
  if (f.form !== "early-access" && !f.message) errors.push({ field: "message", message: "Please write a message." });
  if (errors.length) return res.status(422).json({ errors });

  const subject = oneLine(clean(body._subject)) || (f.form === "early-access" ? "GRC360 early access request" : "Website message");
  const rows = Object.keys(LABELS).filter((k) => f[k]);
  const text = rows.map((k) => `${LABELS[k]}: ${f[k]}`).join("\n\n");
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        (k) =>
          `<tr><td style="vertical-align:top;color:#646E81;white-space:nowrap">${LABELS[k]}</td><td style="white-space:pre-wrap">${esc(f[k])}</td></tr>`,
      )
      .join("") +
    `</table>`;

  const to = (process.env.CONTACT_TO || "contact@strativu.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM || "Strativu Website <noreply@strativu.com>";

  try {
    const r = brevoKey
      ? await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "api-key": brevoKey, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            sender: parseAddress(from),
            to: to.map((email) => ({ email })),
            replyTo: { email: f.email, ...(f.name ? { name: oneLine(f.name) } : {}) },
            subject,
            textContent: text,
            htmlContent: html,
          }),
        })
      : await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, reply_to: f.email, subject, text, html }),
        });
    const provider = brevoKey ? "brevo" : "resend";
    if (!r.ok) {
      // Səbəb Vercel loglarında görünür (açar loga yazılmır); ziyarətçiyə ümumi xəta.
      const detail = await r.text().catch(() => "");
      console.error(`${provider}_failed`, r.status, detail.slice(0, 500));
      return res.status(502).json({ error: "Could not send the message" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("email_unreachable", String(e).slice(0, 200));
    return res.status(502).json({ error: "Could not send the message" });
  }
}
