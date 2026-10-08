import { useState, type FormEvent } from "react";

/**
 * Minimal Formspree client: one POST to the same endpoint the @formspree/react package used
 * (https://formspree.io/f/<id>, JSON response), without pulling in that package and its Stripe dependency.
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
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: new FormData(form),
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
