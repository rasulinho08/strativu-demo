import { Component, type ReactNode } from "react";
import { Btn, Container, Lane } from "./primitives";
import { site } from "../../data/site";

/**
 * Keeps the header and footer on screen if a page fails to render (Layout wraps only the page content).
 * `resetKey` (the pathname) clears the error when the visitor navigates elsewhere.
 */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex min-h-[70svh] flex-col justify-center pb-24 pt-36 md:pt-48">
        <Container>
          <Lane>
            <p className="eyebrow mb-4">Error</p>
            <h1 className="t-h1 text-ink">This page did not load.</h1>
            <p className="t-lead mt-6 max-w-[44ch]">
              Please reload the page. If it keeps happening, email{" "}
              <a href={`mailto:${site.company.email}`} className="text-brand-ink underline underline-offset-4">
                {site.company.email}
              </a>
              .
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Btn onClick={() => window.location.reload()}>Reload the page</Btn>
              <Btn href="/" variant="secondary">
                Go to the home page
              </Btn>
            </div>
          </Lane>
        </Container>
      </section>
    );
  }
}
