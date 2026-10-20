import { createCategory } from "@/db/queries/note";
import { ApiError } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { categorySchema, createCategorySchema } from "@/schemas/category";
import { slugParamsSchema } from "@/schemas/community";

export const POST = route(categorySchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const { name } = await parseBody(req, createCategorySchema);
  const category = await createCategory(user.id, slug, name);
  if (!category) throw new ApiError(403, "Join the community to add categories");
  return category;
});
