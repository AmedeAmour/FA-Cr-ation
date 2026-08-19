import { createFileRoute, Link } from "@tanstack/react-router";
import atelierImage from "@/assets/atelier.jpg";
import { BRAND } from "@/lib/brand";

const TITLE = "La Maison — Niss mode & couture";
const DESC =
  "Découvrez Niss mode & couture, maison de couture à Fifadji pour vos projets de confection, nouvelles collections et urgences de tenues.";

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
    text: "Chaque projet part de vos mesures, de votre événement et du style que vous souhaitez porter.",
  },
  {
    title: "Couture express",
    text: "Pour les urgences, l'atelier vérifie la possibilité d'une confection en 24h selon le modèle.",
  },
  {
    title: "Finitions soignées",
    text: "Les coupes, reprises et détails sont travaillés pour une tenue élégante et confortable.",
  },
  {
    title: "Livraison partout",
    text: "Les commandes peuvent être suivies par appel ou WhatsApp, avec livraison et expédition.",
  },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <p className="eyebrow text-terracotta">La Maison</p>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">{BRAND.name}</h1>
        <div className="woven-rule mx-auto my-8 w-32" />
        <p className="text-muted-foreground leading-relaxed">
          Niss mode & couture est une maison de couture et de mode située à Fifadji. L'atelier
          confectionne des tenues pour vos événements, propose de nouvelles collections disponibles
          en boutique et répond aux urgences de tenues quand le délai le permet.
        </p>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:grid-cols-2 md:px-8">
          <img
            src={atelierImage}
            alt="Atelier de couture Niss mode & couture"
            loading="lazy"
            width={1600}
            height={1104}
            className="aspect-4/3 w-full object-cover"
          />
          <div>
            <p className="eyebrow text-terracotta">Notre atelier</p>
            <h2 className="font-display mt-3 text-3xl">Confiez-nous votre projet</h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Robe, ensemble, tenue de cérémonie, ajustement ou création personnalisée : l'atelier
              échange avec vous sur le modèle, les mesures, le délai et les finitions attendues.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Pour les urgences, contactez directement le {BRAND.phones[0]} par appel ou WhatsApp afin
              de confirmer la faisabilité d'une confection express en 24h.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <p className="eyebrow text-terracotta">Nos engagements</p>
        <h2 className="font-display mt-3 text-3xl">Une couture professionnelle</h2>
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
        <h2 className="font-display text-3xl">Venez à l'atelier</h2>
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
