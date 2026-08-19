import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

const TITLE = "Atelier à Fifadji — Niss mode & couture";
const DESC =
  "Retrouvez Niss mode & couture à Fifadji. Confection sur mesure, couture express, nouvelles collections, livraison et expédition partout.";

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
    name: "Atelier Niss mode & couture",
    city: "Fifadji, Cotonou",
    address: BRAND.boutique.address,
    hours: "Contactez l'atelier par appel ou WhatsApp avant votre passage",
  },
  {
    name: "Couture express",
    city: "Urgences de tenues",
    address:
      "Confection possible en 24h selon le modèle, les matières disponibles et la charge de l'atelier.",
    hours: `Renseignements au ${BRAND.phones[0]}`,
  },
  {
    name: "Livraison et expédition",
    city: "Partout",
    address:
      "Commandes et renseignements par WhatsApp, avec livraison et expédition selon votre localisation.",
    hours: "Suivi par appel ou WhatsApp",
  },
];

function Stores() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Atelier</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Nous trouver</h1>
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
          title="Carte de l'atelier Niss mode & couture à Fifadji"
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
