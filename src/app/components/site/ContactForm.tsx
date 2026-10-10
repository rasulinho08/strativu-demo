import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";
import { useFormspree } from "../../lib/formspree";
import { Btn } from "./primitives";
import { site } from "../../data/site";
import { errorCls, fieldCls, labelCls, smallLinkCls, textareaCls } from "./formStyles";

/** Topic options (Website Blueprint v2). `/contact?topic=Other` pre-selects one. */
const TOPICS = ["Product inquiry", "Partnership", "Investment", "Other"] as const;

type FieldName = "name" | "email" | "company" | "topic" | "message" | "consent";
const FIELDS: FieldName[] = ["name", "email", "company", "topic", "message", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side check before anything is sent; the messages are shown next to the fields. */
function validate(form: HTMLFormElement): Partial<Record<FieldName, string>> {
  const v = (n: string) => String(new FormData(form).get(n) ?? "").trim();
  const errors: Partial<Record<FieldName, string>> = {};
  if (!v("name")) errors.name = "Please enter your full name.";
  if (!v("email")) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v("email"))) errors.email = "Please enter a valid email address, like name@company.com.";
  if (!v("topic")) errors.topic = "Please choose a topic.";
  if (!v("message")) errors.message = "Please write a message.";
  if (!(form.elements.namedItem("consent") as HTMLInputElement | null)?.checked)
    errors.consent = "Please confirm that we may process your data to reply.";
  return errors;
}

/**
 * Contact form (/contact): Full name, Email, Company (optional), Topic, Message and Consent, as in the blueprint.
 * Spam protection: a honeypot field (Formspree drops submissions that fill it).
 * Sends to Formspree (src/app/lib/formspree.ts); on success the visitor goes to /contact/thank-you.
 * If the request fails for any reason that is not tied to a field, one visible fallback line offers the email address.
 */
export function ContactForm() {
  const [state, handleSubmit] = useFormspree(site.formspreeId);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const [clientErrors, setClientErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [focusTick, setFocusTick] = useState(0);

  const fromQuery = () => {
    const t = params.get("topic");
    return t && (TOPICS as readonly string[]).includes(t) ? t : "";
  };
  const [topic, setTopic] = useState(fromQuery);
  // A link to /contact?topic=… while already on /contact (e.g. from the header after a product card) updates the choice.
  useEffect(() => {
    const t = fromQuery();
    if (t) setTopic(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (state.succeeded) navigate("/contact/thank-you");
  }, [state.succeeded, navigate]);

  // After a failed check or send: focus the first invalid field, or the error line.
  useEffect(() => {
    if (state.submitting) return;
    if (!focusTick && !state.errors) return;
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (invalid ?? alertRef.current)?.focus();
  }, [state.errors, state.submitting, focusTick]);

  const serverErrors = (f: FieldName) =>
    state.errors
      ?.filter((e) => e.field === f)
      .map((e) => e.message)
      .join(" ") ?? "";
  const message = (f: FieldName) => clientErrors[f] ?? serverErrors(f);
  const hasServerFieldErrors = FIELDS.some((f) => serverErrors(f));
  // Network failure, blocked request, form disabled … → one clear fallback line.
  const showFormError =
    Boolean(state.errors) && (state.errors!.some((e) => !e.field || !FIELDS.includes(e.field as FieldName)) || !hasServerFieldErrors);

  const a11y = (f: FieldName) => (message(f) ? { "aria-invalid": true, "aria-describedby": `${f}-error` } : {});
  const err = (f: FieldName) =>
    message(f) ? (
      <p id={`${f}-error`} className={errorCls}>
        {message(f)}
      </p>
    ) : null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const errors = validate(e.currentTarget);
    setClientErrors(errors);
    if (Object.keys(errors).length) {
      e.preventDefault();
      setFocusTick((n) => n + 1);
      return;
    }
    void handleSubmit(e);
  };

  /** Once a field has been flagged, re-check it as the visitor fixes it. */
  const recheck = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const f = e.target.name as FieldName;
    if (!clientErrors[f] || !formRef.current) return;
    const next = validate(formRef.current);
    setClientErrors((prev) => ({ ...prev, [f]: next[f] }));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-9">
      <input type="hidden" name="form" value="contact" />
      <input type="hidden" name="_subject" value={`Contact: ${topic || "General"}`} />
      {/* Spam honeypot: hidden from people, filled in by bots; Formspree drops submissions that fill it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <p className="text-[13px] text-ink-3">
        Fields marked <span aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Full name <span aria-hidden>*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldCls} onChange={recheck} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span aria-hidden>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
            placeholder="you@company.com"
            onChange={recheck}
            {...a11y("email")}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>
            Company <span className="font-normal text-ink-3">· optional</span>
          </label>
          <input id="company" name="company" autoComplete="organization" className={fieldCls} {...a11y("company")} />
          {err("company")}
        </div>
        <div>
          <label htmlFor="topic" className={labelCls}>
            Topic <span aria-hidden>*</span>
          </label>
          <div className="relative">
            <select
              id="topic"
              name="topic"
              required
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                recheck(e);
              }}
              className={`${fieldCls} cursor-pointer pr-8 ${topic ? "" : "text-ink-3"}`}
              {...a11y("topic")}
            >
              <option value="" disabled>
                Choose a topic
              </option>
              {TOPICS.map((t) => (
                <option key={t} value={t} className="text-ink">
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
          </div>
          {err("topic")}
        </div>
      </div>
      <div>
        <label htmlFor="message" className={labelCls}>
          Message <span aria-hidden>*</span>
        </label>
        <textarea id="message" name="message" required rows={5} className={textareaCls} onChange={recheck} {...a11y("message")} />
        {err("message")}
      </div>
      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            value="yes"
            required
            onChange={recheck}
            className="mt-[3px] h-5 w-5 shrink-0 cursor-pointer accent-[var(--ink)]"
            {...a11y("consent")}
          />
          <div className="text-[14.5px] leading-[1.6] text-ink-2">
            <label htmlFor="consent">
              I agree to Strativu processing my data to respond to this message. <span aria-hidden>*</span>
            </label>
            <p className="mt-1 text-[13px] text-ink-3">
              How we handle it:{" "}
              <Link to="/privacy" className={smallLinkCls}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        {err("consent")}
      </div>
      {showFormError && (
        <p ref={alertRef} tabIndex={-1} role="alert" className="text-[15px] leading-[1.6] text-warn focus:outline-none">
          Could not send. Please email{" "}
          <a href={`mailto:${site.company.email}`} className="underline underline-offset-4">
            {site.company.email}
          </a>
          .
        </p>
      )}
      <div className="pt-3">
        <Btn type="submit" size="lg" disabled={state.submitting}>
          {state.submitting ? "Sending…" : "Send message"}
        </Btn>
      </div>
    </form>
  );
}
