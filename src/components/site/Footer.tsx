import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo-pied-de-page.png" alt="Logo" className="h-12 w-auto object-contain" />
            <p className="font-display text-xl tracking-[0.14em] uppercase">
              Maison
              <br />
              Abikè
            </p>
          </div>
          <div className="woven-rule my-5 w-24" />
          <p className="text-primary-foreground/70 text-sm leading-relaxed">{BRAND.tagline}</p>
        </div>

        <div>
          <p className="eyebrow text-gold">Maison</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            <li>
              <Link to="/boutique">Boutique</Link>
            </li>
            <li>
              <Link to="/collections">Collections</Link>
            </li>
            <li>
              <Link to="/a-propos">La Maison</Link>
            </li>
            <li>
              <Link to="/nos-boutiques">Nos boutiques</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">Nous joindre</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            {BRAND.phones.map((p) => (
              <li key={p}>
                <a href={`tel:+229${p.replace(/\D/g, "")}`}>{p}</a>
              </li>
            ))}
            <li>
              <a href={BRAND.whatsappUrl} target="_blank" rel="noreferrer">
                Commander sur WhatsApp
              </a>
            </li>
            <li>
              <a href={BRAND.facebook} target="_blank" rel="noreferrer">
                Page Facebook
              </a>
            </li>
            <li>{BRAND.site}</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">Notre boutique</p>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
            {BRAND.boutique.label}
            <br />
            {BRAND.boutique.address}
          </p>
          <a
            href={BRAND.maps}
            target="_blank"
            rel="noreferrer"
            className="eyebrow text-gold mt-4 inline-block"
          >
            Itinéraire
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-6 text-center">
        <p className="text-primary-foreground/50 text-xs">
          © {new Date().getFullYear()} {BRAND.name}. Artisanat textile béninois.
        </p>
      </div>
    </footer>
  );
}
