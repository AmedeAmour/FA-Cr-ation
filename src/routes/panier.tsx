import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND, formatPrice, wa } from "@/lib/brand";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier - Niss mode & couture" },
      {
        name: "description",
        content:
          "Vérifiez vos pièces sélectionnées puis finalisez votre commande : livraison à Fifadji, retrait en boutique ou commande sur WhatsApp.",
      },
      { property: "og:title", content: "Votre panier - Niss mode & couture" },
      {
        property: "og:description",
        content: "Finalisez votre commande Niss mode & couture.",
      },
      { property: "og:url", content: "/panier" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/panier" }],
  }),
  component: Panier,
});

function Panier() {
  const { lines, remove, setQuantity, subtotal, hasMadeToMeasure } = useCart();

  const waMessage = wa(
    `Bonjour ${BRAND.name}, je souhaite commander :\n` +
      lines.map((l) => `• ${l.name} - taille ${l.size} × ${l.quantity}`).join("\n"),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Commande</p>
      <h1 className="font-display mt-3 text-4xl">Votre panier</h1>
      <div className="woven-rule my-8 w-32" />

      {lines.length === 0 ? (
        <div>
          <p className="text-muted-foreground text-sm">Votre panier est vide.</p>
          <Link
            to="/boutique"
            className="eyebrow bg-primary text-primary-foreground mt-8 inline-block px-8 py-4"
          >
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex gap-5 py-6">
                <Link to="/produit/$slug" params={{ slug: l.slug }} className="w-24 shrink-0">
                  <img
                    src={l.image}
                    alt={l.name}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <h2 className="font-display text-lg">{l.name}</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Taille {l.size}
                    {l.color ? ` - ${l.color}` : ""}
                  </p>
                  <p className="mt-2 text-sm">{formatPrice(l.price)}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      value={l.quantity}
                      onChange={(e) => setQuantity(l.productId, l.size, Number(e.target.value))}
                      className="w-16 border border-border bg-transparent px-2 py-1 text-sm"
                      aria-label="Quantité"
                    />
                    <button
                      onClick={() => remove(l.productId, l.size)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Retirer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-end gap-3">
            <p className="text-sm">
              Sous-total :{" "}
              <span className="font-display text-lg">
                {subtotal > 0 ? formatPrice(subtotal) : "Sur devis"}
              </span>
            </p>
            {hasMadeToMeasure && (
              <p className="text-muted-foreground max-w-md text-right text-xs">
                Votre panier contient des pièces sur mesure : le montant vous sera confirmé par un
                conseiller avant règlement.
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-3">
              <a
                href={waMessage}
                target="_blank"
                rel="noreferrer"
                className="eyebrow border border-primary px-8 py-4"
              >
                Commander sur WhatsApp
              </a>
              <Link to="/commande" className="eyebrow bg-primary text-primary-foreground px-8 py-4">
                Passer commande
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
