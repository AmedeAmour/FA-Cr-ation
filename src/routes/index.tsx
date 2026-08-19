import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero.jpg";
import atelierImage from "@/assets/atelier.jpg";
import { BRAND } from "@/lib/brand";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

const TITLE = "Niss mode & couture — Confection sur mesure à Fifadji";
const DESC =
  "Maison de couture et de mode à Fifadji : nouvelles collections, couture express en 24h, robes, tenues événementielles, livraison et expédition partout.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/" },
      {
        name: "keywords",
        content:
          "Niss mode couture, couture Fifadji, couture express Cotonou, robe sur mesure Bénin, maison de couture Cotonou, confection dame, tenue événementielle, livraison couture Bénin",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { data: products = [] } = useQuery(productsQuery());
  const { data: categories = [] } = useQuery(categoriesQuery());
  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  const showcase = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <>
      <section className="relative">
        <div className="relative grid min-h-[86vh] items-center md:grid-cols-2">
          <div className="order-2 px-6 py-16 md:order-1 md:px-16">
            <p className="eyebrow text-terracotta">Maison de couture — Fifadji</p>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-7xl">
              Niss mode
              <br />
              & couture.
            </h1>
            <div className="woven-rule my-8 w-32" />
            <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
              Confiez-nous vos projets de confection pour tout événement. L'atelier réalise vos
              tenues sur mesure, propose une couture express en 24h selon modèle, et expédie partout.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/boutique" className="eyebrow bg-primary text-primary-foreground px-8 py-4">
                Découvrir les créations
              </Link>
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="eyebrow border border-primary px-8 py-4"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </div>
          <div className="order-1 h-[60vh] md:order-2 md:h-[86vh]">
            <img
              src={heroImage}
              alt="Création de mode Niss mode & couture"
              width={1600}
              height={1920}
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-terracotta">Collections</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Nos services couture</h2>
          </div>
          <Link to="/collections" className="eyebrow underline underline-offset-4">
            Tout voir
          </Link>
        </div>
        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/boutique"
              search={{ categorie: c.slug }}
              className="bg-background group p-8 transition-colors hover:bg-sand"
            >
              <h3 className="font-display text-2xl">{c.name}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{c.description}</p>
              <span className="eyebrow text-terracotta mt-6 inline-block">Explorer</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="eyebrow text-terracotta">Nouveautés</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Disponibles et sur commande</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="eyebrow text-gold">Urgence couture</p>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">
            Une tenue urgente ? Contactez l'atelier
          </h2>
          <p className="text-primary-foreground/70 mx-auto mt-5 max-w-xl leading-relaxed">
            La couture express peut être réalisée en 24h selon le modèle, la matière et la charge de
            l'atelier. Envoyez votre demande au {BRAND.phones[0]}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`${BRAND.whatsappUrl}?text=${encodeURIComponent("Bonjour Niss mode & couture, j'ai une urgence de tenue et je souhaite vérifier la possibilité d'une confection en 24h.")}`}
              target="_blank"
              rel="noreferrer"
              className="eyebrow bg-gold text-gold-foreground px-8 py-4"
            >
              Demander en urgence
            </a>
            <Link to="/contact" className="eyebrow border border-primary-foreground/40 px-8 py-4">
              Demander des informations
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:px-8">
        <img
          src={atelierImage}
          alt="Atelier de couture et confection sur mesure"
          loading="lazy"
          width={1600}
          height={1104}
          className="aspect-4/3 w-full object-cover"
        />
        <div>
          <p className="eyebrow text-terracotta">Savoir-faire</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Une tenue pensée pour vous</h2>
          <div className="hairline my-6 w-24" />
          <p className="text-muted-foreground leading-relaxed">
            Du choix du modèle à la finition, Niss mode & couture vous accompagne pour créer une
            pièce élégante, bien ajustée et adaptée à votre événement. Appelez ou écrivez sur
            WhatsApp pour vérifier les disponibilités.
          </p>
          <Link to="/a-propos" className="eyebrow mt-8 inline-block underline underline-offset-4">
            La Maison
          </Link>
        </div>
      </section>
    </>
  );
}
