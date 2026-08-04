import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatPrice, waProduct, wa } from "@/lib/brand";
import {
  colors,
  primaryImage,
  productQuery,
  productsQuery,
  reviewsQuery,
  sizes,
  totalStock,
} from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produit/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ")} — Maison Michèle Yakice`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Pièce artisanale en pagne tissé, lin ou batik. Tailles, matière, entretien et commande en ligne ou sur WhatsApp.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Création artisanale Maison Michèle Yakice, Abidjan.",
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produit/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/produit/${params.slug}` }],
    };
  },
  component: ProductPage,
});

const GUIDE = [
  ["XS", "34", "82 cm", "62 cm"],
  ["S", "36 – 38", "88 cm", "68 cm"],
  ["M", "40 – 42", "94 cm", "74 cm"],
  ["L", "44 – 46", "100 cm", "80 cm"],
  ["XL", "48 – 50", "108 cm", "88 cm"],
];

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQuery(slug));
  const { data: products = [] } = useQuery(productsQuery());
  const { data: reviews = [] } = useQuery({
    ...reviewsQuery(product?.id ?? ""),
    enabled: Boolean(product?.id),
  });
  const { add } = useCart();
  const { user } = useSession();
  const [size, setSize] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (isLoading) {
    return <p className="mx-auto max-w-7xl px-4 py-24 text-sm">Chargement…</p>;
  }
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <h1 className="font-display text-3xl">Pièce introuvable</h1>
        <Link to="/boutique" className="eyebrow mt-6 inline-block underline">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const productSizes = sizes(product);
  const productColors = colors(product);
  const stock = totalStock(product);
  const similar = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  function addToCart() {
    if (productSizes.length > 0 && !size) {
      toast.error("Choisissez une taille.");
      return;
    }
    add({
      productId: product!.id,
      slug: product!.slug,
      name: product!.name,
      image: primaryImage(product!),
      size: size ?? "Unique",
      color: productColors[0] ?? null,
      price: product!.price_xof,
      quantity: 1,
    });
    toast.success("Ajouté au panier.");
  }

  async function addFavorite() {
    if (!user) {
      toast.error("Connectez-vous pour enregistrer vos favoris.");
      return;
    }
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, product_id: product!.id });
    if (error) toast.info("Déjà dans vos favoris.");
    else toast.success("Ajouté à vos favoris.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav className="text-muted-foreground eyebrow flex gap-2">
        <Link to="/">Accueil</Link> / <Link to="/boutique">Boutique</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <div
            className="aspect-4/5 overflow-hidden bg-sand"
            onClick={() => setZoom((v) => !v)}
          >
            <img
              src={images[active]?.url ?? primaryImage(product)}
              alt={images[active]?.alt ?? product.name}
              width={1024}
              height={1280}
              className={`size-full cursor-zoom-in object-cover transition-transform duration-700 ${zoom ? "scale-150" : ""}`}
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`aspect-4/5 w-20 overflow-hidden border ${i === active ? "border-primary" : "border-transparent"}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? product.name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-terracotta">{product.material}</p>
          <h1 className="font-display mt-3 text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg">
            {formatPrice(product.price_xof)}
            {product.compare_price_xof && (
              <span className="text-muted-foreground ml-3 line-through">
                {formatPrice(product.compare_price_xof)}
              </span>
            )}
          </p>
          <div className="hairline my-6" />
          <p className="text-muted-foreground leading-relaxed">
            {product.description ?? product.short_description}
          </p>

          <div className="mt-8">
            <p className="eyebrow text-muted-foreground">Taille</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {productSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border px-4 py-2 text-sm ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              {product.is_made_to_measure
                ? "Pièce réalisée sur mesure — délai communiqué par nos conseillers."
                : stock > 0
                  ? "En stock"
                  : "Sur commande"}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={addToCart}
              className="eyebrow bg-primary text-primary-foreground flex items-center gap-2 px-8 py-4"
            >
              <ShoppingBag className="size-4" /> Ajouter au panier
            </button>
            <a
              href={waProduct(product.name, size)}
              target="_blank"
              rel="noreferrer"
              className="eyebrow border border-primary px-8 py-4"
            >
              Commander sur WhatsApp
            </a>
            <button
              onClick={() => void addFavorite()}
              className="eyebrow flex items-center gap-2 border border-border px-4 py-4"
            >
              <Heart className="size-4" /> Favoris
            </button>
          </div>
          <a
            href={wa(
              `Bonjour Maison Michèle Yakice, pouvez-vous vérifier la disponibilité du modèle ${product.name} ?`,
            )}
            target="_blank"
            rel="noreferrer"
            className="eyebrow text-terracotta mt-4 inline-block underline underline-offset-4"
          >
            Vérifier la disponibilité
          </a>

          <dl className="mt-10 space-y-4 border-t border-border pt-8 text-sm">
            <div>
              <dt className="eyebrow text-muted-foreground">Matière</dt>
              <dd className="mt-1">{product.material}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Composition</dt>
              <dd className="mt-1">{product.composition}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Entretien</dt>
              <dd className="mt-1">{product.care}</dd>
            </div>
          </dl>

          <details className="mt-8 border-t border-border pt-6">
            <summary className="eyebrow cursor-pointer">Guide des tailles</summary>
            <table className="mt-4 w-full text-sm">
              <thead className="text-muted-foreground text-left">
                <tr>
                  <th className="py-2">Taille</th>
                  <th className="py-2">FR</th>
                  <th className="py-2">Poitrine</th>
                  <th className="py-2">Taille</th>
                </tr>
              </thead>
              <tbody>
                {GUIDE.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell) => (
                      <td key={cell} className="py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-display text-2xl">Avis clients</h2>
        <div className="hairline my-5 w-24" />
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aucun avis publié pour cette pièce.
          </p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="border border-border p-6">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="text-gold size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
                <p className="text-muted-foreground mt-3 text-xs">
                  {r.author_name ?? "Cliente"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {similar.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl">Pièces similaires</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}