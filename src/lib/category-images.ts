import food from "@/assets/cat-food.jpg";
import beauty from "@/assets/cat-beauty.jpg";
import crafts from "@/assets/cat-crafts.jpg";
import services from "@/assets/cat-services.jpg";

const bySlug: Record<string, string> = {
  food, groceries: food, foods: food, "food-groceries": food, drinks: food,
  beauty, skincare: beauty, "beauty-skincare": beauty, health: beauty,
  crafts, art: crafts, "art-crafts": crafts, home: crafts, decor: crafts,
  services, professional: services, fashion: crafts, clothing: crafts,
};

/** Best local image for a category, used when the category has no uploaded image. */
export function categoryImage(slug: string | null | undefined, index = 0) {
  const key = (slug ?? "").toLowerCase();
  const direct = bySlug[key];
  if (direct) return direct;
  const match = Object.keys(bySlug).find((candidate) => key.includes(candidate));
  if (match) return bySlug[match]!;
  return [food, beauty, crafts, services][index % 4]!;
}
