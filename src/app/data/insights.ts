/**
 * Insights (/insights, /az/insights): practical articles for the people GRC360 and Cipher are for.
 * Metadata only (plain data: the build reads it for routes, meta, sitemap and JSON-LD); the article bodies are in
 * src/app/content/insightBodies.tsx. An article can exist in one or both languages.
 * Facts only: no legal advice, no invented numbers. Anything about a law is reviewed by a lawyer before it goes here.
 */
export type InsightText = { title: string; description: string };
export type Insight = {
  slug: string;
  /** YYYY-MM-DD, the day it was published */
  date: string;
  readMinutes: number;
  en?: InsightText;
  az?: InsightText;
};

export const insights: Insight[] = [
  {
    slug: "when-spreadsheets-stop-working",
    date: "2026-11-02",
    readMinutes: 5,
    en: {
      title: "When spreadsheets stop working for risk and compliance",
      description:
        "Five signs your risk and compliance work has outgrown spreadsheets, what to move first, and the questions to ask any GRC tool before you choose one.",
    },
    az: {
      title: "Risk və uyğunluq üçün Excel nə vaxt kifayət etmir",
      description:
        "Risk və uyğunluq işinizin cədvəllərdən böyüdüyünü göstərən beş əlamət, ilk nəyi köçürmək lazımdır və GRC aləti seçməzdən əvvəl hansı sualları vermək lazımdır.",
    },
  },
];

export const insightPath = (slug: string, lang: "en" | "az" = "en") => (lang === "az" ? `/az/insights/${slug}` : `/insights/${slug}`);
