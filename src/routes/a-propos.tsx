import { createFileRoute, Link } from "@tanstack/react-router";
import atelierImage from "@/assets/atelier.jpg";
import { BRAND } from "@/lib/brand";

const TITLE = "La Maison — Artisanat textile ivoirien | Maison Michèle Yakice";
const DESC =
  "L'histoire de Maison Michèle Yakice : un artisanat textile ivoirien durable, des teintures naturelles et un atelier qui valorise le savoir-faire des femmes.";

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
    title: "Traçabilité",
    text: "Nous connaissons l'origine de chaque fil et le nom de chaque artisan qui le travaille.",
  },
  {
    title: "Teintures naturelles",
    text: "Nos couleurs viennent de pigments végétaux, sans procédés chimiques agressifs.",
  },
  {
    title: "Artisanat équitable",
    text: "Des rémunérations justes, une majorité de femmes artisanes, une transmission continue.",
  },
  {
    title: "Pièces durables",
    text: "Coupes intemporelles et finitions solides, pensées pour être portées des années.",
  },
];

function About() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <p className="eyebrow text-terracotta">La Maison</p>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">
          {BRAND.tagline}
        </h1>
        <div className="woven-rule mx-auto my-8 w-32" />
        <p className="text-muted-foreground leading-relaxed">
          Maison Michèle Yakice est née à Abidjan d'une conviction simple : le
          pagne tissé mérite les codes du luxe. Nous dessinons des vêtements
          pour femme et homme en pagne tissé, lin et batik, réalisés dans notre
          atelier de Cocody par des artisans dont le geste se transmet de
          génération en génération.
        </p>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:grid-cols-2 md:px-8">
          <img
            src={atelierImage}
            alt="Artisane tissant du pagne dans l'atelier de la Maison"
            loading="lazy"
            width={1600}
            height={1104}
            className="aspect-4/3 w-full object-cover"
          />
          <div>
            <p className="eyebrow text-terracotta">Notre atelier</p>
            <h2 className="font-display mt-3 text-3xl">
              Le temps long du tissage
            </h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Un métier à tisser ne se presse pas. Chaque bande de pagne demande
              des heures d'attention avant d'être assemblée, coupée puis
              finie à la main. C'est ce temps qui donne à nos pièces leur
              tenue, leur tombé et leur caractère.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Notre atelier accueille également l'école internationale de
              formation professionnelle Michèle Yakice, où les jeunes couturières
              apprennent la coupe, le montage et la valorisation des matières
              locales.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <p className="eyebrow text-terracotta">Nos engagements</p>
        <h2 className="font-display mt-3 text-3xl">Une mode qui tient</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title}>
              <div className="hairline mb-5 w-12" />
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="font-display text-3xl">Venez nous rencontrer</h2>
        <p className="text-primary-foreground/70 mt-4 text-sm">
          {BRAND.boutique.label}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nos-boutiques" className="eyebrow bg-gold text-gold-foreground px-8 py-4">
            Nos boutiques
          </Link>
          <Link
            to="/contact"
            className="eyebrow border border-primary-foreground/40 px-8 py-4"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}