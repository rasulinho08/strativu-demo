import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import { NotFound } from "./pages/NotFound";

/*
 * Home is in the main bundle; every other page is loaded when it is first needed (one chunk per page file).
 * The build adds <link rel="modulepreload"> for the right chunk to each route's static HTML (vite.config.ts → PAGE_FOR_ROUTE),
 * so a direct visit to an inner page does not wait for an extra round trip.
 */
const productsPage = () => import("./pages/Products");
const grc360 = () => import("./pages/Grc360");
const coverage = () => import("./pages/Coverage");
const company = () => import("./pages/Company");
const contact = () => import("./pages/Contact");
const legal = () => import("./pages/Legal");
const Products = lazy(() => productsPage().then((m) => ({ default: m.Products })));
const Grc360 = lazy(() => grc360().then((m) => ({ default: m.Grc360 })));
const Architecture = lazy(() => grc360().then((m) => ({ default: m.Architecture })));
const Changelog = lazy(() => grc360().then((m) => ({ default: m.Changelog })));
const EarlyAccess = lazy(() => grc360().then((m) => ({ default: m.EarlyAccess })));
const Coverage = lazy(() => coverage().then((m) => ({ default: m.Coverage })));
const FrameworkPage = lazy(() => coverage().then((m) => ({ default: m.FrameworkPage })));
const About = lazy(() => company().then((m) => ({ default: m.About })));
const Trust = lazy(() => company().then((m) => ({ default: m.Trust })));
const Contact = lazy(() => contact().then((m) => ({ default: m.Contact })));
const ContactThanks = lazy(() => contact().then((m) => ({ default: m.ContactThanks })));
const Privacy = lazy(() => legal().then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => legal().then((m) => ({ default: m.Terms })));

/** /coverage/:slug → /products/grc360/frameworks/:slug (client-side twin of the vercel.json redirect). */
function LegacyFramework() {
  const { slug } = useParams();
  return <Navigate to={`/products/grc360/frameworks/${slug ?? ""}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/* Navigations run as transitions, so the previous page stays on screen while the next chunk loads. */}
        <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          {/* GRC360 by Strativu — interim product site (not in the main nav); paths also in data/grc360.ts → GRC */}
          <Route path="/products/grc360" element={<Grc360 />} />
          <Route path="/products/grc360/architecture" element={<Architecture />} />
          <Route path="/products/grc360/frameworks" element={<Coverage />} />
          <Route path="/products/grc360/frameworks/:slug" element={<FrameworkPage />} />
          <Route path="/products/grc360/changelog" element={<Changelog />} />
          <Route path="/products/grc360/early-access" element={<EarlyAccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/thank-you" element={<ContactThanks />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* Old routes (on Vercel these are 308 redirects in vercel.json; these cover client-side navigation) */}
          <Route path="/company" element={<Navigate to="/about" replace />} />
          <Route path="/company/about" element={<Navigate to="/about" replace />} />
          <Route path="/company/contact" element={<Navigate to="/contact" replace />} />
          <Route path="/platform" element={<Navigate to="/products" replace />} />
          <Route path="/platform/grc" element={<Navigate to="/products/grc360" replace />} />
          <Route path="/platform/architecture" element={<Navigate to="/products/grc360/architecture" replace />} />
          <Route path="/coverage" element={<Navigate to="/products/grc360/frameworks" replace />} />
          <Route path="/coverage/:slug" element={<LegacyFramework />} />
          <Route path="/changelog" element={<Navigate to="/products/grc360/changelog" replace />} />
          <Route path="/early-access" element={<Navigate to="/products/grc360/early-access" replace />} />
          <Route path="/pricing" element={<Navigate to="/products/grc360/early-access" replace />} />
          <Route path="/work" element={<Navigate to="/products" replace />} />
          <Route path="/legal/privacy" element={<Navigate to="/privacy" replace />} />
          <Route path="/legal/terms" element={<Navigate to="/terms" replace />} />
          <Route path="/legal/dpa" element={<Navigate to="/terms" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
