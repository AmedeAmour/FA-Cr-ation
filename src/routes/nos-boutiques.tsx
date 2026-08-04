import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

const TITLE = "Nos boutiques à Abidjan — Maison Michèle Yakice";
const DESC =
  "Retrouvez Maison Michèle Yakice à Angré 8ème Tranche (Cocody), au Palais de la Culture de Treichville et à Yamoussoukro. Horaires, adresses et itinéraire.";

export const Route = createFileRoute("/nos-boutiques")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/nos-boutiques" },
    ],
    links: [{ rel: "canonical", href: "/nos-boutiques" }],
  }),
  component: Stores,
});

const STORES = [
  {
    name: "Boutique Angré 8ème Tranche",
    city: "Cocody, Abidjan",
    address: BRAND.boutique.address,
    hours: "Lundi – Samedi, 9h – 19h",
  },
  {
    name: "Palais de la Culture",
    city: "Treichville, Abidjan",
    address: "Palais de la Culture de Treichville, Abidjan, Côte d'Ivoire.",
    hours: "Lundi – Samedi, 10h – 18h",
  },
  {
    name: "Boutique Yamoussoukro",
    city: "Yamoussoukro",
    address: "Yamoussoukro, Côte d'Ivoire.",
    hours: "Lundi – Samedi, 9h – 18h",
  },
];

function Stores() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Points de vente</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Nos boutiques</h1>
      <div className="woven-rule my-8 w-32" />

      <div className="grid gap-10 md:grid-cols-3">
        {STORES.map((s) => (
          <div key={s.name} className="border border-border p-8">
            <h2 className="font-display text-2xl">{s.name}</h2>
            <p className="eyebrow text-terracotta mt-2">{s.city}</p>
            <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
              {s.address}
            </p>
            <p className="mt-5 text-sm">{s.hours}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 aspect-16/9 w-full overflow-hidden border border-border">
        <iframe
          title="Carte de la boutique Angré 8ème Tranche"
          src={BRAND.mapsEmbed}
          loading="lazy"
          className="size-full"
        />
      </div>

      <a
        href={BRAND.maps}
        target="_blank"
        rel="noreferrer"
        className="eyebrow mt-6 inline-block underline underline-offset-4"
      >
        Ouvrir l'itinéraire
      </a>
    </div>
  );
}