/**
 * Shared look of the site's forms (Contact, GRC360 early access).
 * Minimal fields: a single hairline underline (own --field-line token, ≥3:1) that turns ink on focus (inset, so nothing shifts).
 */
export const fieldBase =
  "block w-full appearance-none rounded-none border-b border-field-line bg-transparent px-0 text-[16px] text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-brand focus:[box-shadow:inset_0_-1px_0_var(--brand)] aria-[invalid=true]:border-warn";
export const fieldCls = `${fieldBase} h-12`;
export const textareaCls = `${fieldBase} min-h-[120px] resize-y py-3 leading-[1.6]`;
export const labelCls = "block text-[13px] font-medium text-ink-2";
export const errorCls = "mt-2 text-[13px] text-warn";
/** Links inside small print under a form: always underlined (not by colour alone, WCAG 1.4.1). */
export const smallLinkCls =
  "underline decoration-[color-mix(in_srgb,currentColor_45%,transparent)] underline-offset-4 transition-colors hover:text-ink hover:decoration-current";
