import { getCollection } from 'astro:content';

/** Published devlog posts, newest part first. */
export async function getPosts() {
  const posts = await getCollection('devlog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.part - a.data.part);
}
