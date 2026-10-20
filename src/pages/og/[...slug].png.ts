import type { APIRoute } from 'astro';
import { getPosts } from '../../lib/posts';
import { renderCard, type Card } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  const cards: { slug: string; card: Card }[] = [
    { slug: 'home', card: { eyebrow: 'Free and open source', title: 'A photo app for Windows and macOS, in the spirit of Picasa' } },
    { slug: 'devlog', card: { eyebrow: 'Seura Photos devlog', title: 'How Seura Photos is being designed and built, in the open' } },
    ...posts.map((p) => ({ slug: `devlog/${p.id}`, card: { eyebrow: `Seura Photos devlog · Part ${p.data.part}`, title: p.data.title } })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderCard((props as { card: Card }).card), { headers: { 'Content-Type': 'image/png' } });
