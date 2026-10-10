import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Check } from "lucide-react";
import { useFormspree } from "../../lib/formspree";
import { Btn } from "./primitives";
import { site } from "../../data/site";
import { errorCls, fieldCls, labelCls, smallLinkCls, textareaCls } from "./formStyles";

const optional = <span className="font-normal text-ink-3"> · optional</span>;

type FieldName = "name" | "email" | "company" | "role" | "frameworks" | "message";
const FIELDS: FieldName[] = ["name", "email", "company", "role", "frameworks", "message"];

/** GRC360 early-access request (/products/grc360/early-access). Posts to Formspree with form=early-access. */
export function EarlyAccessForm() {
  const [state, handleSubmit] = useFormspree(site.formspreeId);
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

  const fieldErrors = (f: FieldName) => state.errors?.filter((e) => e.field === f) ?? [];
  const hasFieldErrors = FIELDS.some((f) => fieldErrors(f).length > 0);
  // Any failure that is not tied to one of the fields (network, blocked, form disabled …) gets one clear fallback line.
  const showFormError =
    Boolean(state.errors) && (state.errors!.some((e) => !e.field || !FIELDS.includes(e.field as FieldName)) || !hasFieldErrors);

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
          We review requests weekly. A person from our team, not an automated email, replies within five working days.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-9">
      <input type="hidden" name="form" value="early-access" />
      {/* Spam honeypot: hidden from people, filled in by bots; Formspree drops submissions that fill it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={fieldCls} placeholder="Full name" {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
            placeholder="you@company.com"
            {...a11y("email")}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>
            Company
          </label>
          <input
            id="company"
            name="company"
            required
            autoComplete="organization"
            className={fieldCls}
            placeholder="Company name"
            {...a11y("company")}
          />
          {err("company")}
        </div>
        <div>
          <label htmlFor="role" className={labelCls}>
            Role{optional}
          </label>
          <input
            id="role"
            name="role"
            autoComplete="organization-title"
            className={fieldCls}
            placeholder="e.g. Head of Security"
            {...a11y("role")}
          />
          {err("role")}
        </div>
      </div>
      <div>
        <label htmlFor="frameworks" className={labelCls}>
          Frameworks you are audited against{optional}
        </label>
        <input id="frameworks" name="frameworks" className={fieldCls} placeholder="Law 998-IIIQ, PCI DSS, ISO 27001, …" {...a11y("frameworks")} />
        {err("frameworks")}
      </div>
      <div>
        <label htmlFor="message" className={labelCls}>
          Your compliance programme today{optional}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={textareaCls}
          placeholder="Team size, tools you use today, your next audit or regulator review."
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
          {state.submitting ? "Sending…" : "Request early access"}
        </Btn>
        <p className="text-[13px] leading-[1.6] text-ink-3">
          No mailing list. We use these details only to reply to you.{" "}
          <Link to="/privacy" className={smallLinkCls}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
