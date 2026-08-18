import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProductImage = { id: string; url: string; alt: string | null; position: number };
export type ProductVariant = {
  id: string;
  size: string;
  color: string | null;
  stock: number;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  composition: string | null;
  care: string | null;
  gender: string;
  price_xof: number | null;
  compare_price_xof: number | null;
  is_made_to_measure: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
};
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
};
export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  author_name: string | null;
};

const PRODUCT_SELECT =
  "*, product_images(id,url,alt,position), product_variants(id,size,color,stock)";

const fallbackCategories: Category[] = [
  {
    id: "cat-batik",
    name: "Pagnes Batik",
    slug: "pagnes-batik",
    description: "Pagnes 100% coton, teints à la main, doux, respirants et riches en couleurs.",
    position: 1,
  },
  {
    id: "cat-tisse",
    name: "Pagnes Tissés",
    slug: "pagnes-tisses",
    description: "Tissus tissés avec soin, rayures élégantes et finitions authentiques.",
    position: 2,
  },
  {
    id: "cat-teinture",
    name: "Teinture Artisanale",
    slug: "teinture-artisanale",
    description:
      "Motifs circulaires, linéaires et abstraits réalisés par pliage, nouage et teinture.",
    position: 3,
  },
  {
    id: "cat-sur-mesure",
    name: "Créations Sur Mesure",
    slug: "creations-sur-mesure",
    description:
      "Robes, ensembles, chemises, boubous, accessoires et tenues uniques à vos mesures.",
    position: 4,
  },
];

const productDate = "2026-08-18T00:00:00.000Z";
const legacySlugs = new Set(["chemises-lin", "edition-masa", "les-batisseurs"]);

async function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

function fallbackImages(slug: string, name: string, detail = "detail-1") {
  return [
    {
      id: `${slug}-main`,
      url: `/images/products/${slug}.jpg`,
      alt: `${name} - Abikè`,
      position: 0,
    },
    {
      id: `${slug}-detail`,
      url: `/images/products/${detail}.jpg`,
      alt: `${name} - détail du tissu`,
      position: 1,
    },
  ];
}

function fallbackVariants(slug: string, color: string): ProductVariant[] {
  return ["Unique", "Sur mesure"].map((size, index) => ({
    id: `${slug}-${index}`,
    size,
    color,
    stock: 4,
  }));
}

const fallbackProducts: Product[] = [
  {
    id: "prod-violet-royal",
    name: "Pagne Batik Violet Royal",
    slug: "chemise-lin-ecru",
    category_id: "cat-batik",
    short_description: "Pagne Abikè violet royal 100% coton.",
    description:
      "Un pagne batik moderne, teint à la main, doux, respirant et conçu pour donner de l'allure en cérémonie, au bureau ou en sortie.",
    material: "Batik",
    composition: "100% coton béninois",
    care: "Lavage à la main ou cycle délicat, séchage à l'ombre.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("chemise-lin-ecru", "Pagne Batik Violet Royal", "detail-1"),
    product_variants: fallbackVariants("pagne-batik-violet-royal", "Violet profond / Blanc"),
  },
  {
    id: "prod-rouge-blanc",
    name: "Pagne Batik Rouge & Blanc",
    slug: "chemise-lin-terracotta",
    category_id: "cat-batik",
    short_description: "L'intensité du batik, l'élégance signée Abikè.",
    description:
      "Pagne 100% coton sublimé par des motifs tie-dye originaux. Ses nuances rouges et blanches donnent une touche moderne, authentique et élégante à chaque création.",
    material: "Batik",
    composition: "100% coton",
    care: "Lavage doux à froid, séparément, séchage à l'ombre.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages(
      "chemise-lin-terracotta",
      "Pagne Batik Rouge & Blanc",
      "detail-2",
    ),
    product_variants: fallbackVariants("pagne-batik-rouge-blanc", "Rouge / Blanc"),
  },
  {
    id: "prod-bleu-gris-blanc",
    name: "Pagne Tissé Bleu Gris Blanc",
    slug: "robe-longue-sene",
    category_id: "cat-tisse",
    short_description: "L'authenticité du tissé, l'élégance d'un style unique.",
    description:
      "Un pagne aux motifs rayés dans un mélange chic de bleu, gris et blanc. Idéal pour robes, ensembles, jupes, pantalons, chemises, vestes et créations sur mesure.",
    material: "Pagne tissé",
    composition: "Coton tissé main",
    care: "Nettoyage délicat recommandé.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("robe-longue-sene", "Pagne Tissé Bleu Gris Blanc", "detail-3"),
    product_variants: fallbackVariants("pagne-tisse-bleu-gris-blanc", "Bleu / Gris / Blanc"),
  },
  {
    id: "prod-brun-caramel",
    name: "Batik Brun Caramel",
    slug: "tunique-napie",
    category_id: "cat-batik",
    short_description: "Batik artisanal aux nuances brun, caramel, ocre et ivoire.",
    description:
      "Ses motifs abstraits et raffinés apportent élégance et originalité aux chemises, ensembles, robes, vestes, pantalons et tenues de couple.",
    material: "Batik",
    composition: "Coton batik teinté à la main",
    care: "Lavage à la main, eau froide, séparément.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tunique-napie", "Batik Brun Caramel", "detail-1"),
    product_variants: fallbackVariants("batik-brun-caramel", "Brun / Caramel / Ivoire"),
  },
  {
    id: "prod-vert-blanc",
    name: "Pagne Tissé Vert & Blanc",
    slug: "kimo-royale",
    category_id: "cat-tisse",
    short_description: "Tradition, élégance et raffinement.",
    description:
      "Un pagne tissé vert et blanc, résistant et confortable, parfait pour mariages, fiançailles, cérémonies, fêtes et événements culturels.",
    material: "Pagne tissé",
    composition: "Coton tissé main",
    care: "Nettoyage délicat recommandé.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("kimo-royale", "Pagne Tissé Vert & Blanc", "detail-2"),
    product_variants: fallbackVariants("pagne-tisse-vert-blanc", "Vert / Blanc"),
  },
  {
    id: "prod-vert-turquoise",
    name: "Pagne Teint Vert Turquoise",
    slug: "ensemble-pantalon-baoule",
    category_id: "cat-teinture",
    short_description: "Pagne teint artisanal aux motifs artistiques uniques.",
    description:
      "Un tissu vert turquoise agréable au toucher, adapté aux créations pour hommes, femmes et enfants : robes, ensembles, chemises, jupes, accessoires ou décoration.",
    material: "Teinture artisanale",
    composition: "100% coton béninois",
    care: "Lavage doux à froid, séchage à l'ombre.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages(
      "ensemble-pantalon-baoule",
      "Pagne Teint Vert Turquoise",
      "detail-3",
    ),
    product_variants: fallbackVariants("pagne-teint-vert-turquoise", "Vert turquoise"),
  },
  {
    id: "prod-bleu-roi",
    name: "Pagne Batik Bleu Roi",
    slug: "tenue-homme-batisseur",
    category_id: "cat-batik",
    short_description: "Un bleu paisible et magnifique, teint à la main avec amour.",
    description:
      "Ce pagne batik bleu roi 100% coton béninois met en valeur, donne de la prestance et sublime les créations modernes comme traditionnelles.",
    material: "Batik",
    composition: "100% coton béninois",
    care: "Lavage à froid, séparément, séchage à l'ombre.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tenue-homme-batisseur", "Pagne Batik Bleu Roi", "detail-1"),
    product_variants: fallbackVariants("pagne-batik-bleu-roi", "Bleu roi"),
  },
  {
    id: "prod-marron-bleu-royal",
    name: "Pagne Tissé Marron Bleu Royal",
    slug: "boubou-lin-anthracite",
    category_id: "cat-tisse",
    short_description: "Sobriété, élégance et authenticité.",
    description:
      "Un fond marron chaleureux sublimé par une bande bleu royal, de fines rayures blanches et des touches rouges. Un tissu intemporel pour des tenues distinguées.",
    material: "Pagne tissé",
    composition: "Coton tissé main",
    care: "Nettoyage délicat recommandé.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages(
      "boubou-lin-anthracite",
      "Pagne Tissé Marron Bleu Royal",
      "detail-2",
    ),
    product_variants: fallbackVariants("pagne-tisse-marron-bleu-royal", "Marron / Bleu royal"),
  },
  {
    id: "prod-formation-teinture",
    name: "Atelier Teinture Artisanale",
    slug: "piece-sur-mesure",
    category_id: "cat-sur-mesure",
    short_description: "Formation pratique aux motifs circulaires et linéaires.",
    description:
      "Le centre de la coopérative Abikè à Parakou accompagne les bénéficiaires dans les techniques de pliage, nouage et application de la teinture artisanale.",
    material: "Formation textile",
    composition: "Techniques de teinture artisanale",
    care: "Renseignements et inscription par WhatsApp.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("piece-sur-mesure", "Atelier Teinture Artisanale", "detail-3"),
    product_variants: fallbackVariants("atelier-teinture-artisanale", "Atelier pratique"),
  },
];

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => fallbackCategories,
  });

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => fallbackProducts,
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> =>
      fallbackProducts.find((p) => p.slug === slug) ?? null,
  });

export const deliveryZonesQuery = () =>
  queryOptions({
    queryKey: ["delivery_zones"],
    queryFn: async () => [],
  });

export const reviewsQuery = (productId: string) =>
  queryOptions({
    queryKey: ["reviews", productId],
    queryFn: async (): Promise<Review[]> => [],
  });
export function primaryImage(p: Product) {
  const sorted = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position);
  return sorted[0]?.url ?? "/images/products/detail-1.jpg";
}

export function secondaryImage(p: Product) {
  const sorted = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position);
  return sorted[1]?.url ?? primaryImage(p);
}

export function totalStock(p: Product) {
  return (p.product_variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
}

export function sizes(p: Product) {
  return [...new Set((p.product_variants ?? []).map((v) => v.size))];
}

export function colors(p: Product) {
  return [...new Set((p.product_variants ?? []).map((v) => v.color).filter(Boolean))] as string[];
}
