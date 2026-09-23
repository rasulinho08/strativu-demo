import { Btn, Container } from "./primitives";
import { Reveal } from "./Reveal";
import { site } from "../../data/site";

/** Closing statement on a dark band. One primary action, one secondary. */
export function ClosingCTA({
  title = "Every claim on this site should survive “can you show me?”",
  body = "That is the constraint we build under. If you run a security or compliance programme and want to shape what the GRC product becomes, early access is open to a small number of teams.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[color-mix(in_srgb,var(--ink)_92%,transparent)] py-20 text-[var(--ground)] backdrop-blur-md md:py-28">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-4 text-[12.5px] font-semibold text-white/60">
                {site.status.label} · {site.status.detail}
              </p>
              <h2 className="t-h2 !text-white">{title}</h2>
              <p className="mt-5 max-w-[62ch] text-[16.5px] leading-[1.6] text-white/75">{body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Btn to="/early-access" size="lg" arrow variant="invert">
                Request early access
              </Btn>
              <Btn to="/company/contact" size="lg" variant="secondary" className="!border-white/25 !bg-transparent !text-white hover:!bg-white/10">
                Talk to us
              </Btn>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
