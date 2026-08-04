import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { BRAND, wa } from "@/lib/brand";

const TITLE = "Contact — Maison Michèle Yakice, Abidjan";
const DESC =
  "Contactez Maison Michèle Yakice : WhatsApp, téléphone, e-mail et adresse de la boutique d'Angré 8ème Tranche à Cocody, Abidjan.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  email: z.string().trim().email("Adresse e-mail invalide.").max(255),
  subject: z.string().trim().min(2, "Indiquez un objet.").max(150),
  message: z.string().trim().min(10, "Votre message est trop court.").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }
    const d = parsed.data;
    window.open(
      wa(
        `Bonjour ${BRAND.name},\nNom : ${d.name}\nE-mail : ${d.email}\nObjet : ${d.subject}\n\n${d.message}`,
      ),
      "_blank",
      "noopener",
    );
    toast.success("Votre message est prêt à être envoyé sur WhatsApp.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  const field =
    "mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Contact</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">Écrivez-nous</h1>
      <div className="woven-rule my-8 w-32" />

      <div className="grid gap-14 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="eyebrow text-muted-foreground" htmlFor="name">
              Nom complet
            </label>
            <input
              id="name"
              value={form.name}
              maxLength={100}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              maxLength={255}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground" htmlFor="subject">
              Objet
            </label>
            <input
              id="subject"
              value={form.subject}
              maxLength={150}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={form.message}
              maxLength={1000}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={field}
            />
          </div>
          <button
            type="submit"
            className="eyebrow bg-primary text-primary-foreground px-8 py-4"
          >
            Envoyer
          </button>
        </form>

        <div className="space-y-8">
          <div className="flex gap-4">
            <MapPin className="text-terracotta mt-1 size-5 shrink-0" />
            <div>
              <p className="eyebrow">Boutique</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {BRAND.boutique.address}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="text-terracotta mt-1 size-5 shrink-0" />
            <div>
              <p className="eyebrow">Téléphone</p>
              {BRAND.phones.map((p) => (
                <p key={p} className="text-muted-foreground mt-1 text-sm">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="text-terracotta mt-1 size-5 shrink-0" />
            <div>
              <p className="eyebrow">E-mail</p>
              <a
                href={`mailto:${BRAND.email}`}
                className="text-muted-foreground mt-1 block text-sm"
              >
                {BRAND.email}
              </a>
            </div>
          </div>
          <div className="aspect-4/3 w-full overflow-hidden border border-border">
            <iframe
              title="Carte de la boutique Maison Michèle Yakice"
              src={BRAND.mapsEmbed}
              loading="lazy"
              className="size-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}