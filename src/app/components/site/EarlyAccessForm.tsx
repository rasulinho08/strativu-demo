import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useForm } from "@formspree/react";
import { Btn } from "./primitives";
import { site } from "../../data/site";
import { Check } from "lucide-react";

/* Minimal fields: a single hairline underline (own --field-line token, ≥3:1) that turns brand on focus (inset, so nothing shifts). */
const base =
  "block w-full appearance-none rounded-none border-b border-field-line bg-transparent px-0 text-[16px] text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-brand focus:[box-shadow:inset_0_-1px_0_var(--brand)] aria-[invalid=true]:border-warn";
const field = `${base} h-12`;
const label = "block text-[13px] font-medium text-ink-2";
const optional = <span className="font-normal text-ink-3"> · optional</span>;
const errorCls = "mt-2 text-[13px] text-warn";

type FieldName = "name" | "email" | "company" | "role" | "frameworks" | "message";
const FIELDS: FieldName[] = ["name", "email", "company", "role", "frameworks", "message"];

export function EarlyAccessForm({ kind = "early-access" }: { kind?: "early-access" | "contact" }) {
  const [state, handleSubmit] = useForm(site.formspreeId);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  // After a successful send the form is replaced; move focus to the confirmation so keyboard and screen-reader users keep their place.
  useEffect(() => {
    if (state.succeeded) doneRef.current?.focus();
  }, [state.succeeded]);

  // After a failed send (the button is disabled while sending, so focus is lost): go to the first invalid field, or to the error line.
  useEffect(() => {
    if (!state.errors || state.submitting) return;
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (invalid ?? alertRef.current)?.focus();
  }, [state.errors, state.submitting]);

  const fieldErrors = (f: FieldName) => state.errors?.getFieldErrors(f) ?? [];
  const hasFieldErrors = FIELDS.some((f) => fieldErrors(f).length > 0);
  // Any failure that is not tied to one field (network, blocked, form disabled …) gets one clear fallback line.
  const showFormError = Boolean(state.errors) && (state.errors!.getFormErrors().length > 0 || !hasFieldErrors);

  /** aria-invalid + aria-describedby for a field with an error, and its error line. */
  const a11y = (f: FieldName) => (fieldErrors(f).length ? { "aria-invalid": true, "aria-describedby": `${f}-error` } : {});
  const err = (f: FieldName) =>
    fieldErrors(f).length ? (
      <p id={`${f}-error`} className={errorCls}>
        {fieldErrors(f)
          .map((e) => e.message)
          .join(" ")}
      </p>
    ) : null;

  if (state.succeeded) {
    return (
      <div role="status" className="border-t border-line pt-8">
        <p ref={doneRef} tabIndex={-1} className="t-h3 flex items-center gap-3 text-ink focus:outline-none">
          <Check className="h-5 w-5 text-brand" strokeWidth={2} aria-hidden /> Received.
        </p>
        <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.6] text-ink-2">
          {kind === "early-access"
            ? "We review requests weekly. A person from our team, not an automated email, replies within five working days."
            : "A person from our team replies within two working days."}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-9">
      <input type="hidden" name="form" value={kind} />
      {/* Spam honeypot: hidden from people, filled in by bots; Formspree drops submissions that fill it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} placeholder="Full name" {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="you@company.com"
            {...a11y("email")}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="company" className={label}>
            Company
          </label>
          <input
            id="company"
            name="company"
            required
            autoComplete="organization"
            className={field}
            placeholder="Company name"
            {...a11y("company")}
          />
          {err("company")}
        </div>
        <div>
          <label htmlFor="role" className={label}>
            Role{optional}
          </label>
          <input
            id="role"
            name="role"
            autoComplete="organization-title"
            className={field}
            placeholder="e.g. Head of Security"
            {...a11y("role")}
          />
          {err("role")}
        </div>
      </div>
      {kind === "early-access" && (
        <div>
          <label htmlFor="frameworks" className={label}>
            Frameworks you are audited against{optional}
          </label>
          <input
            id="frameworks"
            name="frameworks"
            className={field}
            placeholder="Law 998-IIIQ, PCI DSS, ISO 27001, …"
            {...a11y("frameworks")}
          />
          {err("frameworks")}
        </div>
      )}
      <div>
        <label htmlFor="message" className={label}>
          {kind === "early-access" ? <>Your compliance programme today{optional}</> : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          required={kind === "contact"}
          rows={4}
          className={`${base} min-h-[120px] resize-y py-3 leading-[1.6]`}
          placeholder={kind === "early-access" ? "Team size, tools you use today, your next audit or regulator review." : "How can we help?"}
          {...a11y("message")}
        />
        {err("message")}
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
      <div className="flex flex-col gap-4 pt-3 sm:items-start">
        <Btn type="submit" size="lg" disabled={state.submitting}>
          {state.submitting ? "Sending…" : kind === "early-access" ? "Request early access" : "Send message"}
        </Btn>
        <p className="text-[13px] leading-[1.6] text-ink-3">
          No mailing list. We use these details only to reply to you.{" "}
          <Link
            to="/legal/privacy"
            className="underline decoration-[color-mix(in_srgb,currentColor_45%,transparent)] underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
          >
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
