import { useEffect, useState } from "react";
import { Lane, TextLink, Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";
import { site } from "../../data/site";

type Post = { id: string; image: string; caption: string; permalink: string; timestamp: string };

/**
 * "Behind the scenes": Instagram-dan son 6 post (About səhifəsində).
 * Postlar /api/instagram-dan gəlir (api/instagram.ts). Post yoxdursa bölmə ümumiyyətlə göstərilmir.
 */
export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/instagram")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d: { posts?: Post[] }) => alive && setPosts(d.posts ?? []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!posts.length || !site.company.instagram) return null;

  return (
    <section className="relative scroll-mt-24 pb-20 md:pb-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <Lane>
          <Reveal>
            <Eyebrow>Behind the scenes</Eyebrow>
            <h2 className="t-h2 text-ink">From our Instagram.</h2>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {posts.slice(0, 6).map((p, i) => (
              <Reveal as="li" key={p.id} delay={Math.min(i, 5) * 0.05}>
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-[var(--r-md)] border border-line bg-surface-2"
                  aria-label={p.caption ? `Instagram post: ${p.caption}` : "Instagram post"}
                >
                  <img
                    src={p.image}
                    alt={p.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </a>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8">
            <TextLink href={site.company.instagram}>@strativu on Instagram</TextLink>
          </Reveal>
        </Lane>
      </div>
    </section>
  );
}
