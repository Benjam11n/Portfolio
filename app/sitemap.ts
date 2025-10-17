import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const lastModified = new Date();

  const routes = ['/', '/list', '/explore', '/credits'];

  return routes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
