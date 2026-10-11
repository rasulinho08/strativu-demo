import { useState, type FormEvent } from "react";

/**
 * Form sending for the site's forms.
 *  1. POST /api/contact (Vercel function → Resend → the corporate mailbox; api/contact.ts).
 *  2. If that is not configured (503) or fails on the server side (5xx), the same data goes to Formspree
 *     (https://formspree.io/f/<id>), so a message is never lost.
 */
export type FormspreeError = { field?: string; code?: string; message: string };
export type FormspreeState = { submitting: boolean; succeeded: boolean; errors: FormspreeError[] | null };

function toErrors(body: unknown, status: number): FormspreeError[] {
  const b = body as { errors?: FormspreeError[]; error?: string } | null;
  if (b && Array.isArray(b.errors) && b.errors.length) return b.errors.map((e) => ({ field: e.field, code: e.code, message: String(e.message ?? "") }));
  if (b && typeof b.error === "string") return [{ message: b.error }];
  return [{ code: `HTTP_${status}`, message: "Unknown error" }];
}

export function useFormspree(formId: string) {
  const [state, setState] = useState<FormspreeState>({ submitting: false, succeeded: false, errors: null });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ submitting: true, succeeded: false, errors: null });
    const data = new FormData(form);
    try {
      const api = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      }).catch(() => null);
      if (api && api.status < 500) {
        const body = await api.json().catch(() => null);
        if (api.ok) setState({ submitting: false, succeeded: true, errors: null });
        else setState({ submitting: false, succeeded: false, errors: toErrors(body, api.status) });
        return;
      }
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const body = await res.json().catch(() => null);
      if (res.ok && !(body && (body as { errors?: unknown }).errors)) {
        setState({ submitting: false, succeeded: true, errors: null });
      } else {
        setState({ submitting: false, succeeded: false, errors: toErrors(body, res.status) });
      }
    } catch {
      // Network failure, blocked request, offline …
      setState({ submitting: false, succeeded: false, errors: [{ code: "NETWORK", message: "Network error" }] });
    }
  };

  return [state, handleSubmit] as const;
}
