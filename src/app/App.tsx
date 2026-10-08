import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import { NotFound } from "./pages/NotFound";

/*
 * Home is in the main bundle; every other page is loaded when it is first needed (one chunk per page file).
 * The build adds <link rel="modulepreload"> for the right chunk to each route's static HTML (vite.config.ts),
 * so a direct visit to an inner page does not wait for an extra round trip.
 */
const platform = () => import("./pages/Platform");
const coverage = () => import("./pages/Coverage");
const company = () => import("./pages/Company");
const misc = () => import("./pages/Misc");
const Platform = lazy(() => platform().then((m) => ({ default: m.Platform })));
const PlatformGRC = lazy(() => platform().then((m) => ({ default: m.PlatformGRC })));
const Architecture = lazy(() => platform().then((m) => ({ default: m.Architecture })));
const Coverage = lazy(() => coverage().then((m) => ({ default: m.Coverage })));
const FrameworkPage = lazy(() => coverage().then((m) => ({ default: m.FrameworkPage })));
const About = lazy(() => company().then((m) => ({ default: m.About })));
const Contact = lazy(() => company().then((m) => ({ default: m.Contact })));
const EarlyAccess = lazy(() => company().then((m) => ({ default: m.EarlyAccess })));
const Trust = lazy(() => company().then((m) => ({ default: m.Trust })));
const Changelog = lazy(() => misc().then((m) => ({ default: m.Changelog })));
const Legal = lazy(() => misc().then((m) => ({ default: m.Legal })));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/* Navigations run as transitions, so the previous page stays on screen while the next chunk loads. */}
        <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/platform/grc" element={<PlatformGRC />} />
          <Route path="/platform/architecture" element={<Architecture />} />
          <Route path="/coverage" element={<Coverage />} />
          <Route path="/coverage/:slug" element={<FrameworkPage />} />
          <Route path="/company" element={<Navigate to="/company/about" replace />} />
          <Route path="/company/about" element={<About />} />
          <Route path="/company/contact" element={<Contact />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/legal/:doc" element={<Legal />} />
          {/* Legacy routes (on Vercel these are 308 redirects in vercel.json; these cover client-side navigation) */}
          <Route path="/about" element={<Navigate to="/company/about" replace />} />
          <Route path="/contact" element={<Navigate to="/company/contact" replace />} />
          <Route path="/work" element={<Navigate to="/platform/grc" replace />} />
          <Route path="/pricing" element={<Navigate to="/early-access" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
