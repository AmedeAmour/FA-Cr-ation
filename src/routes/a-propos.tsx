import { createFileRoute, Link } from "@tanstack/react-router";
import atelierImage from "@/assets/atelier.jpg";
import { BRAND } from "@/lib/brand";

const TITLE = "La Maison - FA Creation";
const DESC =
  "Découvrez FA Creation, atelier de couture sur mesure à Cotonou pour costumes, chemises, pantalons, agbada, good luck et tenues prêtes en 72h.";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/a-propos" },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: About,
});

const VALUES = [
  {
    title: "Sur mesure",
    text: "Chaque tenue part de vos mesures, de votre style et de l'occasion pour laquelle vous voulez vous démarquer.",
  },
  {
    title: "Tout fourni",
    text: "L'atelier peut vous accompagner sur le choix du tissu, la coupe, la confection et les finitions.",
  },
  {
    title: "Finitions impeccables",
    text: "Les détails, broderies, coupes et reprises sont travaillés pour un rendu propre et élégant.",
  },
  {
    title: "72h & express 24h",
    text: "Livraison en 72h et express 24h selon le modèle, les matières disponibles et la charge de l'atelier.",
  },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <p className="eyebrow text-terracotta">La Maison</p>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">{BRAND.displayName}</h1>
        <div className="woven-rule mx-auto my-8 w-32" />
        <p className="text-muted-foreground leading-relaxed">
          FA Creation est un atelier de mode et de couture sur mesure basé à Cotonou. La maison
          réalise des costumes, chemises, pantalons, agbada, good luck et tenues modernes ou
          traditionnelles pour les clients qui veulent être élégants sans stress.
        </p>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:grid-cols-2 md:px-8">
          <img
            src={atelierImage}
            alt="Atelier de couture FA Creation"
            loading="lazy"
            width={1600}
            height={1104}
            className="aspect-4/3 w-full object-cover"
          />
          <div>
            <p className="eyebrow text-terracotta">Notre atelier</p>
            <h2 className="font-display mt-3 text-3xl">Votre style, notre savoir-faire</h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Vous venez avec une envie, une occasion ou une inspiration. FA Creation vous guide sur
              le choix du tissu, les mesures, la coupe, les détails et le délai de confection.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Pour les urgences, contactez directement le {BRAND.phones[0]} par appel ou WhatsApp afin
              de confirmer la faisabilité d'une confection express 24h ou d'une livraison en 72h.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <p className="eyebrow text-terracotta">Nos engagements</p>
        <h2 className="font-display mt-3 text-3xl">Une élégance faite pour vous</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title}>
              <div className="hairline mb-5 w-12" />
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="font-display text-3xl">Passez votre commande</h2>
        <p className="text-primary-foreground/70 mt-4 text-sm">{BRAND.boutique.label}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nos-boutiques" className="eyebrow bg-gold text-gold-foreground px-8 py-4">
            Notre atelier
          </Link>
          <Link to="/contact" className="eyebrow border border-primary-foreground/40 px-8 py-4">
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}

