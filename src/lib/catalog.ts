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
    id: "cat-costumes",
    name: "Costumes sur mesure",
    slug: "costumes-sur-mesure",
    description:
      "Costumes ajustés, vestes, ensembles habillés et finitions impeccables pour un style net.",
    position: 1,
  },
  {
    id: "cat-chemises-pantalons",
    name: "Chemises & pantalons",
    slug: "chemises-pantalons",
    description:
      "Chemises bien coupées, pantalons fuselés ou à boucles, disponibles sur commande.",
    position: 2,
  },
  {
    id: "cat-traditionnel",
    name: "Agbada & good luck",
    slug: "agbada-good-luck",
    description:
      "Tenues traditionnelles modernes, broderies soignées et culture portée avec élégance.",
    position: 3,
  },
  {
    id: "cat-express",
    name: "Express 24h & 72h",
    slug: "express-24h-72h",
    description:
      "Confection express 24h selon le modèle, livraison 72h et accompagnement sans stress.",
    position: 4,
  },
];

const productDate = "2026-08-19T00:00:00.000Z";

function fallbackImages(slug: string, name: string, detail = "detail-1") {
  return [
    {
      id: `${slug}-main`,
      url: `/images/products/${slug}.jpg`,
      alt: `${name} - FA Creation`,
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
    id: "prod-costume-signature",
    name: "Costume signature sur mesure",
    slug: "tenue-homme-batisseur",
    category_id: "cat-costumes",
    short_description: "Un costume parfaitement ajusté, pensé comme une vraie signature.",
    description:
      "Le vrai luxe, c'est un costume qui vous va parfaitement. FA Creation vous accompagne du choix du tissu aux finitions pour une tenue classe, moderne et impeccable.",
    material: "Costume sur mesure",
    composition: "Tissu choisi avec le client, doublure et finitions personnalisées",
    care: "Nettoyage délicat recommandé. Repassage vapeur doux.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tenue-homme-batisseur", "Costume signature sur mesure", "detail-2"),
    product_variants: fallbackVariants("costume-signature-sur-mesure", "Couleur au choix"),
  },
  {
    id: "prod-pantalon-boucles",
    name: "Pantalon à boucles",
    slug: "ensemble-pantalon-baoule",
    category_id: "cat-chemises-pantalons",
    short_description: "Une coupe propre et efficace pour structurer votre look.",
    description:
      "Un pantalon à boucles bien coupé change tout : simple, propre, efficace. Disponible sur commande avec ajustement selon votre style et vos mesures.",
    material: "Pantalon sur commande",
    composition: "Tissu tailleur ou matière choisie avec le client",
    care: "Lavage doux ou pressing selon la matière.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("ensemble-pantalon-baoule", "Pantalon à boucles", "detail-1"),
    product_variants: fallbackVariants("pantalon-a-boucles", "Noir, beige ou sur demande"),
  },
  {
    id: "prod-chemise-soignee",
    name: "Chemise coupe soignée",
    slug: "chemise-lin-ecru",
    category_id: "cat-chemises-pantalons",
    short_description: "Une belle chemise, coupe nette et finition propre.",
    description:
      "Une belle chemise fait toujours la différence. FA Creation réalise des chemises sur mesure avec une coupe soignée, des finitions propres et le style qui vous correspond.",
    material: "Chemise sur mesure",
    composition: "Coton, lin ou tissu choisi selon le rendu souhaité",
    care: "Lavage doux recommandé. Repassage adapté à la matière.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("chemise-lin-ecru", "Chemise coupe soignée", "detail-2"),
    product_variants: fallbackVariants("chemise-coupe-soignee", "Blanc, lin ou couleur au choix"),
  },
  {
    id: "prod-ensemble-lin",
    name: "Ensemble en lin sur mesure",
    slug: "chemise-lin-terracotta",
    category_id: "cat-costumes",
    short_description: "Simple, élégant et confortable, dans la couleur de votre choix.",
    description:
      "Vous aimez le lin ? Choisissez votre couleur et FA Creation confectionne une tenue simple, élégante et confortable, prête à porter sans stress.",
    material: "Lin sur mesure",
    composition: "Lin ou mélange lin selon disponibilité",
    care: "Lavage doux à froid, séchage à l'air libre et repassage léger.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("chemise-lin-terracotta", "Ensemble en lin sur mesure", "detail-3"),
    product_variants: fallbackVariants("ensemble-lin-sur-mesure", "Couleur au choix"),
  },
  {
    id: "prod-agbada-premium",
    name: "Agbada moderne",
    slug: "cape-les-batisseurs",
    category_id: "cat-traditionnel",
    short_description: "Une tenue traditionnelle élégante, ample et travaillée.",
    description:
      "Pour une tenue moderne ou traditionnelle faite pour vous, FA Creation confectionne agbada, ensembles cérémoniels et pièces culturelles avec soin.",
    material: "Agbada sur mesure",
    composition: "Tissu premium, broderie et détails selon le modèle",
    care: "Pressing recommandé pour préserver le tombé et les broderies.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: true,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("cape-les-batisseurs", "Agbada moderne", "detail-1"),
    product_variants: fallbackVariants("agbada-moderne", "Personnalisable"),
  },
  {
    id: "prod-good-luck",
    name: "Tunique good luck brodée",
    slug: "tunique-napie",
    category_id: "cat-traditionnel",
    short_description: "Élégance simple, racines visibles et broderie soignée.",
    description:
      "Une tunique moderne, brodée avec soin, pour ceux qui veulent rester stylés tout en gardant leur culture près du cœur.",
    material: "Good luck brodé",
    composition: "Tissu choisi, broderie et finition personnalisée",
    care: "Lavage délicat ou pressing selon la broderie.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: false,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("tunique-napie", "Tunique good luck brodée", "detail-2"),
    product_variants: fallbackVariants("tunique-good-luck-brodee", "Personnalisable"),
  },
  {
    id: "prod-look-beige",
    name: "Look beige ton sur ton",
    slug: "kimo-royale",
    category_id: "cat-costumes",
    short_description: "Classe, simple et efficace pour une élégance décontractée.",
    description:
      "Veste légère, pantalon fuselé, polo ou t-shirt blanc : FA Creation compose un look minimaliste, élégant et facile à porter.",
    material: "Look coordonné",
    composition: "Tissus assortis selon disponibilité et préférence",
    care: "Entretien selon les matières choisies.",
    gender: "homme",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("kimo-royale", "Look beige ton sur ton", "detail-3"),
    product_variants: fallbackVariants("look-beige-ton-sur-ton", "Beige ou ton sur ton"),
  },
  {
    id: "prod-express-72h",
    name: "Tenue prête en 72h",
    slug: "piece-sur-mesure",
    category_id: "cat-express",
    short_description: "Choix du tissu, confection et livraison en 72h selon faisabilité.",
    description:
      "FA Creation s'occupe de tout pour vous : choix du tissu, confection, finitions et tenue prête à porter. Livraison en 72h, express 24h selon le modèle.",
    material: "Service express",
    composition: "Tissu fourni ou sélectionné avec l'atelier",
    care: "Conseils donnés selon la matière retenue.",
    gender: "mixte",
    price_xof: null,
    compare_price_xof: null,
    is_made_to_measure: true,
    is_new: true,
    is_featured: false,
    is_published: true,
    created_at: productDate,
    product_images: fallbackImages("piece-sur-mesure", "Tenue prête en 72h", "detail-1"),
    product_variants: fallbackVariants("tenue-prete-en-72h", "Selon tissu choisi"),
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

