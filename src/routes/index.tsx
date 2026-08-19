import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero.jpg";
import atelierImage from "@/assets/atelier.jpg";
import { BRAND } from "@/lib/brand";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

const TITLE = "FA Creation - Costumes et tenues sur mesure à Cotonou";
const DESC =
  "FA Creation confectionne vos costumes, chemises, pantalons, agbada et tenues sur mesure à Cotonou. Livraison 72h et express 24h selon le modèle.";

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
          "FA Creation, FA Création, costume sur mesure Cotonou, couture homme Bénin, agbada Cotonou, chemise sur mesure, pantalon sur mesure, livraison couture 72h",
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
            <p className="eyebrow text-terracotta">Couture sur mesure - Cotonou</p>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-7xl">
              FA Creation,
              <br />
              soyez chics.
            </h1>
            <div className="woven-rule my-8 w-32" />
            <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
              Votre style, notre savoir-faire. Costumes, chemises, pantalons, agbada et tenues
              modernes ou traditionnelles, confectionnés sur mesure avec des finitions impeccables.
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
          <div className="order-1 h-[60vh] bg-primary md:order-2 md:h-[86vh]">
            <img
              src={heroImage}
              alt="Création sur mesure FA Creation"
              width={1600}
              height={1920}
              className="size-full object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-terracotta">Collections</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Nos spécialités</h2>
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
          <p className="eyebrow text-terracotta">Sur commande</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Pièces phares FA Creation</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="eyebrow text-gold">Livraison 72h - express 24h</p>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">
            Une tenue urgente ? Écrivez à l'atelier
          </h2>
          <p className="text-primary-foreground/70 mx-auto mt-5 max-w-xl leading-relaxed">
            FA Creation peut gérer le choix du tissu, la confection et la livraison. Le délai express
            24h dépend du modèle, des matières disponibles et de la charge de l'atelier.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`${BRAND.whatsappUrl}?text=${encodeURIComponent("Bonjour FA Creation, j'ai une tenue urgente et je souhaite vérifier la possibilité d'une confection express 24h ou livraison 72h.")}`}
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
          alt="Atelier de couture et confection FA Creation"
          loading="lazy"
          width={1600}
          height={1104}
          className="aspect-4/3 w-full object-cover"
        />
        <div>
          <p className="eyebrow text-terracotta">Savoir-faire</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Tout fourni, sur mesure, impeccable</h2>
          <div className="hairline my-6 w-24" />
          <p className="text-muted-foreground leading-relaxed">
            FA Creation vous accompagne sans stress : choix du tissu, coupe, mesures, confection,
            finitions et livraison. Vous recevez une tenue prête à porter, fidèle à votre style.
          </p>
          <Link to="/a-propos" className="eyebrow mt-8 inline-block underline underline-offset-4">
            La Maison
          </Link>
        </div>
      </section>
    </>
  );
}

