import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

const TITLE = "Nos boutiques au Bénin — Abikè";
const DESC =
  "Retrouvez Abikè à Abomey-Calavi et au centre de la coopérative à Parakou. Horaires, adresses et itinéraire.";

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
    name: "Boutique Abomey-Calavi",
    city: "Abomey-Calavi, Bénin",
    address: BRAND.boutique.address,
    hours: "Lundi – Samedi, 9h – 19h",
  },
  {
    name: "Coopérative Abikè",
    city: "Parakou, Bénin",
    address: "Centre de la coopérative Abikè, Parakou, Bénin.",
    hours: "Lundi – Samedi, 10h – 18h",
  },
  {
    name: "Livraison nationale",
    city: "Partout au Bénin",
    address:
      "Commandes et renseignements par WhatsApp, avec livraison disponible partout au Bénin.",
    hours: "Renseignements aux heures d'ouverture",
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
            <p className="text-muted-foreground mt-5 text-sm leading-relaxed">{s.address}</p>
            <p className="mt-5 text-sm">{s.hours}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 aspect-16/9 w-full overflow-hidden border border-border">
        <iframe
          title="Carte de la boutique Abikè à Abomey-Calavi"
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
