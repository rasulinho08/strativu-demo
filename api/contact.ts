/**
 * Vercel serverless function: POST /api/contact
 *
 * Saytın formlarını (Contact, GRC360 early access) Resend vasitəsilə korporativ poçta göndərir.
 * Açar heç vaxt brauzerə getmir. Vercel → Project → Settings → Environment Variables:
 *   RESEND_API_KEY  → Resend API açarı (məcburi)
 *   CONTACT_TO      → mesajların gələcəyi ünvan (yoxdursa: contact@strativu.com; vergüllə bir neçə ünvan olar)
 *   CONTACT_FROM    → göndərən; Resend-də təsdiqlənmiş domendə olmalıdır
 *                     (yoxdursa: "Strativu Website <noreply@strativu.com>")
 * Açar yoxdursa 503 + code "NOT_CONFIGURED" qaytarır → sayt formu köhnə yolla (Formspree) göndərir.
 */
declare const process: { env: Record<string, string | undefined> };

type Req = { method?: string; body?: unknown };
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

const clean = (v: unknown) =>
  String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, MAX);
const oneLine = (v: string) => v.replace(/\s+/g, " ").slice(0, 200);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ code: "NOT_CONFIGURED", error: "Email sending is not configured" });

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
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: f.email, subject, text, html }),
    });
    if (!r.ok) {
      // Səbəb Vercel loglarında görünür (açar loga yazılmır); ziyarətçiyə ümumi xəta.
      const detail = await r.text().catch(() => "");
      console.error("resend_failed", r.status, detail.slice(0, 500));
      return res.status(502).json({ error: "Could not send the message" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("resend_unreachable", String(e).slice(0, 200));
    return res.status(502).json({ error: "Could not send the message" });
  }
}
