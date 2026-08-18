import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { BRAND, formatPrice, waProduct } from "@/lib/brand";
import {
  colors,
  primaryImage,
  secondaryImage,
  sizes,
  totalStock,
  type Product,
} from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { user } = useSession();
  const stock = totalStock(product);
  const productSizes = sizes(product);
  const productColors = colors(product);

  async function toggleFavorite() {
    if (!user) {
      toast.error("Connectez-vous pour enregistrer vos favoris.");
      return;
    }
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, product_id: product.id });
    if (error) toast.info("Cette pièce est déjà dans vos favoris.");
    else toast.success("Ajouté à vos favoris.");
  }

  function addToCart() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage(product),
      size: productSizes[0] ?? "Unique",
      color: productColors[0] ?? null,
      price: product.price_xof,
      quantity: 1,
    });
    toast.success(`${product.name} ajouté au panier.`);
  }

  return (
    <article className="group">
      <Link
        to="/produit/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-4/5 overflow-hidden bg-sand"
      >
        <img
          src={primaryImage(product)}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1280}
          className="absolute inset-0 size-full object-cover transition-opacity duration-700 group-hover:opacity-0"
        />
        <img
          src={secondaryImage(product)}
          alt={`${product.name} – détail`}
          loading="lazy"
          width={1024}
          height={1280}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_new && <span className="eyebrow bg-background/90 px-2 py-1">Nouveau</span>}
          {product.compare_price_xof && (
            <span className="eyebrow bg-terracotta text-terracotta-foreground px-2 py-1">
              Promotion
            </span>
          )}
          {stock === 0 && !product.is_made_to_measure && (
            <span className="eyebrow bg-primary text-primary-foreground px-2 py-1">Épuisé</span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            void toggleFavorite();
          }}
          aria-label="Ajouter aux favoris"
          className="bg-background/90 absolute top-3 right-3 p-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Heart className="size-4" />
        </button>
      </Link>

      <div className="pt-4">
        <p className="text-muted-foreground text-xs">{product.material}</p>
        <h3 className="font-display mt-1 text-lg">
          <Link to="/produit/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm">
          {formatPrice(product.price_xof)}
          {product.compare_price_xof && (
            <span className="text-muted-foreground ml-2 line-through">
              {formatPrice(product.compare_price_xof)}
            </span>
          )}
        </p>
        <p className="text-muted-foreground mt-2 text-xs">
          {productSizes.join(" · ")}
          {productColors.length > 0 && ` — ${productColors.join(", ")}`}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {product.is_made_to_measure
            ? "Réalisation sur mesure"
            : stock > 0
              ? "Disponible"
              : "Sur commande"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={addToCart}
            className="eyebrow bg-primary text-primary-foreground flex items-center gap-2 px-3 py-2"
          >
            <ShoppingBag className="size-3.5" /> Panier
          </button>
          <a
            href={waProduct(product.name, productSizes[0])}
            target="_blank"
            rel="noreferrer"
            className="eyebrow border border-primary px-3 py-2"
            title={`Commander sur WhatsApp – ${BRAND.name}`}
          >
            WhatsApp
          </a>
          <Link
            to="/produit/$slug"
            params={{ slug: product.slug }}
            className="eyebrow px-3 py-2 underline underline-offset-4"
          >
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
