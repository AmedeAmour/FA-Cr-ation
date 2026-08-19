import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { categoriesQuery, colors, productsQuery, sizes, totalStock } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

type Search = {
  q?: string;
  categorie?: string;
  tri?: string;
};

const TITLE = "Boutique — Couture, sur mesure & collections | Niss mode & couture";
const DESC =
  "Parcourez la boutique en ligne : robes, ensembles, tenues hommes, modèles disponibles et créations sur mesure. Livraison à Fifadji et partout au Bénin.";

export const Route = createFileRoute("/boutique")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const out: Search = {};
    if (typeof search["q"] === "string" && search["q"]) out.q = search["q"];
    if (typeof search["categorie"] === "string" && search["categorie"])
      out.categorie = search["categorie"];
    if (typeof search["tri"] === "string" && search["tri"]) out.tri = search["tri"];
    return out;
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/boutique" },
    ],
    links: [{ rel: "canonical", href: "/boutique" }],
  }),
  component: Boutique,
});

function Boutique() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const { data: categories = [] } = useQuery(categoriesQuery());

  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(false);

  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => sizes(p)))], [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => colors(p)))], [products]);

  const categoryId = categories.find((c) => c.slug === search.categorie)?.id;

  const filtered = useMemo(() => {
    let list = products;
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.material, p.short_description, p.description]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q)),
      );
    }
    if (categoryId) list = list.filter((p) => p.category_id === categoryId);
    if (size) list = list.filter((p) => sizes(p).includes(size));
    if (color) list = list.filter((p) => colors(p).includes(color));
    if (onlyAvailable) list = list.filter((p) => totalStock(p) > 0);
    if (onlyNew) list = list.filter((p) => p.is_new);
    if (onlyPromo) list = list.filter((p) => p.compare_price_xof != null);

    const sorted = [...list];
    if (search.tri === "prix-asc")
      sorted.sort((a, b) => (a.price_xof ?? Infinity) - (b.price_xof ?? Infinity));
    if (search.tri === "prix-desc")
      sorted.sort((a, b) => (b.price_xof ?? -1) - (a.price_xof ?? -1));
    if (search.tri === "nouveautes")
      sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (search.tri === "popularite")
      sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return sorted;
  }, [products, search.q, search.tri, categoryId, size, color, onlyAvailable, onlyNew, onlyPromo]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Boutique</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Toutes nos créations</h1>
      <div className="woven-rule my-8 w-32" />

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="space-y-8">
            <div>
              <label className="eyebrow text-muted-foreground">Recherche</label>
              <input
                value={search.q ?? ""}
                onChange={(e) =>
                  navigate({
                    search: (prev: Search) => {
                      const next: Search = { ...prev };
                      if (e.target.value) next.q = e.target.value;
                      else delete next.q;
                      return next;
                    },
                  })
                }
                placeholder="Robe, ensemble, express…"
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none"
              />
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Catégories</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <button
                    className={!search.categorie ? "underline underline-offset-4" : ""}
                    onClick={() =>
                      navigate({
                        search: (prev: Search) => {
                          const next: Search = { ...prev };
                          delete next.categorie;
                          return next;
                        },
                      })
                    }
                  >
                    Toutes
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      className={search.categorie === c.slug ? "underline underline-offset-4" : ""}
                      onClick={() =>
                        navigate({
                          search: (prev: Search) => ({ ...prev, categorie: c.slug }),
                        })
                      }
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Taille</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? "" : s)}
                    className={`border px-3 py-1 text-xs ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {allColors.length > 0 && (
              <div>
                <p className="eyebrow text-muted-foreground">Couleur</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(color === c ? "" : c)}
                      className={`border px-3 py-1 text-xs ${color === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Disponible
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                />
                Nouveautés
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                />
                Promotions
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <p className="text-muted-foreground text-sm">
              {filtered.length} pièce{filtered.length > 1 ? "s" : ""}
            </p>
            <select
              value={search.tri ?? ""}
              onChange={(e) =>
                navigate({
                  search: (prev: Search) => {
                    const next: Search = { ...prev };
                    if (e.target.value) next.tri = e.target.value;
                    else delete next.tri;
                    return next;
                  },
                })
              }
              className="border border-border bg-transparent px-3 py-2 text-sm"
              aria-label="Trier"
            >
              <option value="">Trier par</option>
              <option value="nouveautes">Nouveautés</option>
              <option value="popularite">Popularité</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground py-16 text-sm">Chargement…</p>
          ) : filtered.length === 0 ? (
            <div className="py-16">
              <p className="text-muted-foreground text-sm">
                Aucune pièce ne correspond à votre recherche.
              </p>
              <Link to="/boutique" className="eyebrow mt-4 inline-block underline">
                Réinitialiser
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


