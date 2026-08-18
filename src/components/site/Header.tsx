import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/boutique", label: "Boutique" },
  { to: "/collections", label: "Collections" },
  { to: "/a-propos", label: "La Maison" },
  { to: "/nos-boutiques", label: "Nos boutiques" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/boutique", search: query ? { q: query } : {} });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background">
      <div className="bg-primary py-2 text-center text-primary-foreground">
        <p className="eyebrow px-4">{BRAND.tagline}</p>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="mr-auto flex items-center gap-3 md:mr-0">
          <img src="/logo-accueil.png" alt="Logo" className="h-12 w-auto object-contain" />
          <div>
            <span className="font-display block text-lg leading-none tracking-[0.16em] uppercase md:text-xl">
              Maison
            </span>
            <span className="font-display block text-lg leading-none tracking-[0.16em] uppercase md:text-xl">
              Abikè
            </span>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="eyebrow text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "eyebrow text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden lg:block">
          <label className="flex items-center gap-2 border-b border-border pb-1">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher"
              className="w-28 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Rechercher un vêtement"
            />
          </label>
        </form>

        <div className="flex items-center gap-3">
          <a href={user ? "/compte" : "/auth"} aria-label="Espace client" className="p-1">
            <User className="size-5" />
          </a>
          <Link to="/panier" aria-label="Panier" className="relative p-1">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="bg-terracotta text-terracotta-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-6 md:hidden">
          <form onSubmit={submitSearch} className="py-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un vêtement"
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none"
            />
          </form>
          <nav className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="eyebrow">
                {item.label}
              </Link>
            ))}
          </nav>
          <Button asChild variant="outline" className="mt-6 w-full">
            <a href={BRAND.whatsappUrl} target="_blank" rel="noreferrer">
              Commander sur WhatsApp
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
