import { Btn, Container } from "./primitives";
import { Reveal } from "./Reveal";
import { site } from "../../data/site";

/**
 * Closing statement. One primary action, one secondary.
 * `stage` (home page): a tall, transparent section — the 3D mark flies back to centre above the text.
 */
export function ClosingCTA({
  title,
  body,
  stage = false,
}: {
  title: string;
  body: string;
  stage?: boolean;
}) {
  const inner = (
    <Reveal>
      <div className="mx-auto max-w-[860px] text-center">
        <p className="chapter">
          <b>{site.status.label}</b> · {site.status.detail}
        </p>
        <h2 className="t-h1 mt-6 text-ink">{title}</h2>
        <p className="mx-auto mt-6 max-w-[60ch] text-[17px] leading-[1.65] text-ink-2">{body}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Btn to="/early-access" size="lg" arrow>
            Request early access
          </Btn>
          <Btn to="/company/contact" size="lg" variant="secondary">
            Talk to us
          </Btn>
        </div>
      </div>
    </Reveal>
  );

  if (stage) {
    return (
      <section data-logo-stage className="stage-pad relative flex min-h-[100svh] flex-col justify-end pb-20 md:pb-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              {/* shown only when the 3D logo is not built (theme.css → .logo-fallback) */}
              <img src={site.logo.mark} alt="" aria-hidden width={207} height={144} className="logo-fallback mx-auto mb-10 h-auto w-[min(40vw,200px)]" />
              <h2 className="t-display text-ink">{title}</h2>
              <p className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-[1.65] text-ink-2">{body}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
                <Btn to="/company/contact" size="lg">
                  Contact us
                </Btn>
                <a href={`mailto:${site.company.email}`} className="link-line text-[15px] text-ink-2 hover:text-ink">
                  {site.company.email}
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }
  return (
    <section className="relative isolate overflow-hidden border-t border-line py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{ background: "radial-gradient(closest-side, var(--glow-1), transparent 72%)" }}
      />
      <Container>{inner}</Container>
    </section>
  );
}
