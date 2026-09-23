import { useForm, ValidationError } from "@formspree/react";
import { Btn } from "./primitives";
import { site } from "../../data/site";
import { Check } from "lucide-react";

/* Minimal fields: a single hairline underline that turns brand on focus (inset, so nothing shifts). */
const base =
  "block w-full appearance-none rounded-none border-b border-line-strong bg-transparent px-0 text-[16px] text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-brand focus:[box-shadow:inset_0_-1px_0_var(--brand)]";
const field = `${base} h-12`;
const label = "block text-[13px] font-medium text-ink-2";
const optional = <span className="font-normal text-ink-3"> · optional</span>;
const error = "mt-2 text-[13px] text-warn";

export function EarlyAccessForm({ kind = "early-access" }: { kind?: "early-access" | "contact" }) {
  const [state, handleSubmit] = useForm(site.formspreeId);

  if (state.succeeded) {
    return (
      <div role="status" className="border-t border-line pt-8">
        <p className="t-h3 flex items-center gap-3 text-ink">
          <Check className="h-5 w-5 text-brand" strokeWidth={2} aria-hidden /> Received.
        </p>
        <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.6] text-ink-2">
          {kind === "early-access"
            ? "We review requests weekly. A named person, not a sequence, replies within five working days."
            : "We reply within two working days."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      <input type="hidden" name="form" value={kind} />
      <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} placeholder="Full name" />
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
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className={error} />
        </div>
        <div>
          <label htmlFor="company" className={label}>
            Company
          </label>
          <input id="company" name="company" required autoComplete="organization" className={field} placeholder="Company name" />
        </div>
        <div>
          <label htmlFor="role" className={label}>
            Role{optional}
          </label>
          <input id="role" name="role" autoComplete="organization-title" className={field} placeholder="e.g. Head of Security" />
        </div>
      </div>
      {kind === "early-access" && (
        <div>
          <label htmlFor="frameworks" className={label}>
            Frameworks you are audited against{optional}
          </label>
          <input id="frameworks" name="frameworks" className={field} placeholder="ISO 27001, SOC 2, …" />
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
          placeholder={kind === "early-access" ? "Team size, tooling, next audit window, what breaks." : "How can we help?"}
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className={error} />
      </div>
      <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:gap-6">
        <Btn type="submit" size="lg" disabled={state.submitting}>
          {state.submitting ? "Sending…" : kind === "early-access" ? "Request early access" : "Send message"}
        </Btn>
        <p className="text-[13px] text-ink-3">No mailing list. We only reply about your request.</p>
      </div>
    </form>
  );
}
