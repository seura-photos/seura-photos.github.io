import rss from '@astrojs/rss';
import { getPosts } from '../../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'Seura Photos devlog',
    description: 'How Seura Photos is being designed and built, start to finish.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/devlog/${post.id}/`,
    })),
  });
}
