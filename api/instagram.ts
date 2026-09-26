/**
 * Vercel serverless function: GET /api/instagram
 *
 * Instagram-dan son postları gətirir və sayta JSON kimi verir. Token heç vaxt brauzerə getmir.
 *   - Token: Vercel → Project → Settings → Environment Variables → INSTAGRAM_TOKEN
 *     (Instagram API with Instagram Login, Business/Creator hesabı, long-lived token).
 *   - Cavab Vercel-in CDN-ində 1 saat keşlənir, yəni Instagram hər ziyarətdə soruşulmur.
 *   - Token yoxdursa və ya Instagram cavab vermirsə, boş siyahı qaytarır → saytda bölmə sadəcə görünmür.
 */
declare const process: { env: Record<string, string | undefined> };

type IgMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

const LIMIT = 6;

export default async function handler(_req: unknown, res: {
  setHeader: (k: string, v: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
}) {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) {
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ posts: [] });
  }
  try {
    const url =
      "https://graph.instagram.com/me/media" +
      "?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp" +
      `&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`instagram ${r.status}`);
    const data = (await r.json()) as { data?: IgMedia[] };
    const posts = (data.data ?? [])
      .map((m) => ({
        id: m.id,
        image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        caption: (m.caption ?? "").split("\n")[0].slice(0, 140),
        permalink: m.permalink,
        timestamp: m.timestamp,
      }))
      .filter((p) => Boolean(p.image));
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ posts });
  } catch {
    // Instagram əlçatan deyil və ya token vaxtı keçib: bölməni gizlət, saytı sındırma.
    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ posts: [] });
  }
}
