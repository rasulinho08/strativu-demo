import { Btn, Container } from "./primitives";
import { Reveal } from "./Reveal";
import { site } from "../../data/site";

/**
 * Closing stage on the home page: a tall, transparent section — the 3D mark flies back to centre above the text
 * (LogoScene looks for `[data-logo-stage]`). One action ("Contact us") and the email address.
 */
export function ClosingCTA({ title, body }: { title: string; body: string }) {
  return (
    <section data-logo-stage className="stage-pad relative flex min-h-[100svh] flex-col justify-end pb-20 md:pb-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            {/* shown only when the 3D logo is not built (theme.css → .logo-fallback) */}
            <img src={site.logo.mark} alt="" aria-hidden width={207} height={144} className="logo-fallback mx-auto mb-10 h-auto w-[min(40vw,200px)]" />
            <h2 className="t-h1 mx-auto max-w-[16ch] text-ink">{title}</h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-[1.65] text-ink-2">{body}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              <Btn to="/contact" size="lg">
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
