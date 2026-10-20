// Static API segments under /api/communities that a slug must not shadow.
const reserved = new Set(["explore"]);

export function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/, "");
  if (!slug) return "community";
  return reserved.has(slug) ? `${slug}-community` : slug;
}
