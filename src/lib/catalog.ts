import { queryOptions } from "@tanstack/react-query";

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

const fallbackCategories: Category[] = [
  {
    id: "cat-nouveautes",
    name: "Nouvelle collection",
    slug: "nouvelle-collection",
    description:
      "Pièces prêtes à porter et modèles récents disponibles en boutique, avec livraison et expédition.",
    position: 1,
  },
  {
    id: "cat-couture-express",
    name: "Couture express",
    slug: "couture-express",
    description:
      "Confection urgente en 24h selon le modèle, la disponibilité des matières et la complexité.",
    position: 2,
  },
  {
    id: "cat-evenements",
    name: "Tenues événementielles",
    slug: "tenues-evenementielles",
    description:
      "Robes, ensembles et tenues élégantes pour cérémonies, sorties, fêtes et occasions spéciales.",
    position: 3,
  },
  {
    id: "cat-sur-mesure",
    name: "Confection sur mesure",
    slug: "confection-sur-mesure",
    description:
      "Accompagnement complet pour vos projets de couture : choix du modèle, prise de mesures et finitions.",
    position: 4,
  },
];

const productDate = "2026-08-19T00:00:00.000Z";

function fallbackImages(slug: string, name: string, detail = "detail-1") {
  return [
    {
      id: `${slug}-main`,
      url: `/images/products/${slug}.jpg`,
      alt: `${name} - Niss mode & couture`,
      position: 0,
    },
    {
      id: `${slug}-detail`,
      url: `/images/products/${detail}.jpg`,
      alt: `${name} - détail de confection`,
      position: 1,
    },
  ];
}

function fallbackVariants(slug: string, color: string): ProductVariant[] {
  return ["S", "M", "L", "XL", "Sur mesure"].map((size, index) => ({
    id: `${slug}-${index}`,
    size,
    color,
    stock: size === "Sur mesure" ? 10 : 3,
  }));
}

const fallbackProducts: Product[] = [
  {
    id: "prod-robe-24h",
    name: "Robe express 24h",
    slug: "robe-longue-sene",
    category_id: "cat-couture-express",
    short_description: "Robe confectionnée en urgence, selon disponibilité et modèle.",
    description:
      "Besoin d'une robe rapidement ? Niss mode & couture accompagne vos urgences de tenues avec une confection express en 24h lorsque le modèle et les matières le permettent.",
    material: "Couture express",
    composition: "Tissu au choix du client",
    care: "Entretien selon le tissu choisi. Conseils remis à la livraison.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("robe-longue-sene", "Robe express 24h", "detail-1"),
    product_variants: fallbackVariants("robe-express-24h", "Selon tissu choisi"),
  },
  {
    id: "prod-nouvelle-collection",
    name: "Pièce nouvelle collection",
    slug: "chemise-lin-ecru",
    category_id: "cat-nouveautes",
    short_description: "Nouveaux modèles disponibles en boutique.",
    description:
      "Découvrez les nouveautés Niss mode & couture : robes, ensembles et pièces élégantes à commander en boutique, par appel ou directement sur WhatsApp.",
    material: "Nouvelle collection",
    composition: "Sélection de tissus mode",
    care: "Lavage doux recommandé selon la matière.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("chemise-lin-ecru", "Pièce nouvelle collection", "detail-2"),
    product_variants: fallbackVariants("piece-nouvelle-collection", "Selon modèle"),
  },
  {
    id: "prod-robe-evenement",
    name: "Robe de cérémonie",
    slug: "tunique-napie",
    category_id: "cat-evenements",
    short_description: "Robe élégante pour événement, sortie ou cérémonie.",
    description:
      "Confiez votre projet de robe à l'atelier : coupe, volume, longueur, détails et finitions sont ajustés pour votre événement.",
    material: "Tenue événementielle",
    composition: "Tissu, doublure et ornements selon le modèle",
    care: "Nettoyage délicat recommandé.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tunique-napie", "Robe de cérémonie", "detail-3"),
    product_variants: fallbackVariants("robe-de-ceremonie", "Personnalisable"),
  },
  {
    id: "prod-ensemble-dame",
    name: "Ensemble dame sur mesure",
    slug: "ensemble-pantalon-baoule",
    category_id: "cat-sur-mesure",
    short_description: "Ensemble chic confectionné à vos mesures.",
    description:
      "Un ensemble dame pensé pour le quotidien habillé, les sorties ou les rendez-vous importants. L'atelier adapte la coupe à votre morphologie.",
    material: "Confection dame",
    composition: "Tissu au choix",
    care: "Repassage doux et lavage adapté à la matière.",
    gender: "femme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("ensemble-pantalon-baoule", "Ensemble dame sur mesure", "detail-1"),
    product_variants: fallbackVariants("ensemble-dame-sur-mesure", "Personnalisable"),
  },
  {
    id: "prod-tenue-homme",
    name: "Tenue homme personnalisée",
    slug: "tenue-homme-batisseur",
    category_id: "cat-sur-mesure",
    short_description: "Confection homme pour sorties, cérémonies et événements.",
    description:
      "Chemise, ensemble ou tenue complète : Niss mode & couture réalise des pièces homme soignées, avec prise de mesures et finitions nettes.",
    material: "Confection homme",
    composition: "Tissu au choix",
    care: "Entretien selon la matière choisie.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tenue-homme-batisseur", "Tenue homme personnalisée", "detail-2"),
    product_variants: fallbackVariants("tenue-homme-personnalisee", "Personnalisable"),
  },
  {
    id: "prod-retouche-urgence",
    name: "Retouche et ajustement urgent",
    slug: "piece-sur-mesure",
    category_id: "cat-couture-express",
    short_description: "Ajustements rapides pour vos tenues urgentes.",
    description:
      "Pour une tenue à reprendre avant un événement, contactez l'atelier par appel ou WhatsApp afin de vérifier le délai possible.",
    material: "Retouche express",
    composition: "Selon la tenue confiée",
    care: "Essayage conseillé après ajustement.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("piece-sur-mesure", "Retouche et ajustement urgent", "detail-3"),
    product_variants: fallbackVariants("retouche-ajustement-urgent", "Selon tenue"),
  },
  {
    id: "prod-tenue-fete",
    name: "Tenue de fête",
    slug: "kimo-royale",
    category_id: "cat-evenements",
    short_description: "Une tenue chic pour se démarquer lors d'une occasion.",
    description:
      "Couleurs, matière, coupe et détails sont choisis avec vous pour créer une tenue de fête élégante et confortable.",
    material: "Tenue événementielle",
    composition: "Tissu au choix",
    care: "Nettoyage délicat recommandé.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("kimo-royale", "Tenue de fête", "detail-1"),
    product_variants: fallbackVariants("tenue-de-fete", "Personnalisable"),
  },
  {
    id: "prod-collection-boutique",
    name: "Modèle disponible en boutique",
    slug: "chemise-lin-terracotta",
    category_id: "cat-nouveautes",
    short_description: "Modèles à découvrir directement à l'atelier.",
    description:
      "Passez à la boutique ou écrivez sur WhatsApp pour recevoir les modèles disponibles, les tailles, les couleurs et les possibilités d'expédition.",
    material: "Disponible en boutique",
    composition: "Sélection atelier",
    care: "Conseils d'entretien donnés selon le modèle.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages(
      "chemise-lin-terracotta",
      "Modèle disponible en boutique",
      "detail-2",
    ),
    product_variants: fallbackVariants("modele-disponible-boutique", "Selon stock"),
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
