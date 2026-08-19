import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery, primaryImage, productsQuery } from "@/lib/catalog";

const TITLE = "Collections - Costumes, agbada & sur mesure | FA Creation";
const DESC =
  "Découvrez les collections FA Creation : costumes, chemises, pantalons, agbada, good luck, couture express et créations sur mesure.";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: Collections,
});

function Collections() {
  const { data: categories = [] } = useQuery(categoriesQuery());
  const { data: products = [] } = useQuery(productsQuery());

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Collections</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Nos collections</h1>
      <div className="woven-rule my-8 w-32" />

      <div className="grid gap-12 md:grid-cols-2">
        {categories.map((c) => {
          const items = products.filter((p) => p.category_id === c.id);
          const cover = items[0] ? primaryImage(items[0]) : "/images/products/detail-1.jpg";
          return (
            <Link key={c.id} to="/boutique" search={{ categorie: c.slug }} className="group block">
              <div className="aspect-3/2 overflow-hidden bg-sand">
                <img
                  src={cover}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h2 className="font-display mt-5 text-2xl">{c.name}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{c.description}</p>
              <p className="eyebrow text-terracotta mt-4">
                {items.length} pièce{items.length > 1 ? "s" : ""}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}




