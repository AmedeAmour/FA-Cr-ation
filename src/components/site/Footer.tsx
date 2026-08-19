import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <Link to="/" className="inline-flex" aria-label={BRAND.name}>
            <img
              src="/logo-footer.png"
              alt={BRAND.name}
              className="h-16 w-auto object-contain"
              width={860}
              height={420}
            />
          </Link>
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
              <Link to="/nos-boutiques">Atelier</Link>
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
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
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
          <p className="eyebrow text-gold">Notre atelier</p>
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
          © {new Date().getFullYear()} {BRAND.name}. Maison de couture et de mode.
        </p>
      </div>
    </footer>
  );
}


