import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/auth";
import { deliveryZonesQuery } from "@/lib/catalog";
import { BRAND, formatPrice, wa } from "@/lib/brand";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Finaliser la commande — Maison Michèle Yakice" },
      {
        name: "description",
        content:
          "Renseignez vos coordonnées de livraison et choisissez votre mode de règlement : Mobile Money, virement ou paiement en boutique.",
      },
      { property: "og:title", content: "Finaliser la commande — Maison Michèle Yakice" },
      { property: "og:description", content: "Commande Maison Michèle Yakice." },
      { property: "og:url", content: "/commande" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/commande" }],
  }),
  component: Checkout,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  phone: z.string().trim().min(8, "Numéro de téléphone invalide.").max(30),
  email: z.string().trim().email("E-mail invalide.").max(255).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Indiquez une adresse.").max(300),
  note: z.string().trim().max(500).optional(),
});

const PAYMENTS = [
  { id: "mobile_money", label: "Mobile Money (Orange, MTN, Moov, Wave)" },
  { id: "bank_transfer", label: "Virement bancaire" },
  { id: "in_store", label: "Paiement en boutique / à la livraison" },
];

function Checkout() {
  const { lines, subtotal, clear, hasMadeToMeasure } = useCart();
  const { user } = useSession();
  const { data: zones = [] } = useQuery(deliveryZonesQuery());
  const [zoneId, setZoneId] = useState<string>("");
  const [payment, setPayment] = useState(PAYMENTS[0]!.id);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  const zone = (zones as { id: string; name: string; fee_xof: number }[]).find(
    (z) => z.id === zoneId,
  );
  const shipping = zone?.fee_xof ?? 0;
  const total = subtotal + shipping;

  const field =
    "mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }
    setSaving(true);
    const d = parsed.data;
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: d.full_name,
        customer_phone: d.phone,
        customer_email: d.email || null,
        delivery_address: d.address,
        delivery_zone_id: zoneId || null,
        payment_method: payment,
        note: d.note ?? null,
        subtotal_xof: subtotal,
        delivery_fee_xof: shipping,
        total_xof: total,
      })
      .select("id")
      .maybeSingle();

    if (error || !order) {
      setSaving(false);
      toast.error("La commande n'a pas pu être enregistrée. Contactez-nous sur WhatsApp.");
      return;
    }

    await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        product_name: l.name,
        size: l.size,
        color: l.color,
        unit_price_xof: l.price,
        quantity: l.quantity,
      })),
    );

    const message = wa(
      `Bonjour ${BRAND.name}, je viens de passer une commande.\n` +
        `Nom : ${d.full_name}\nTéléphone : ${d.phone}\nAdresse : ${d.address}\n` +
        `Livraison : ${zone?.name ?? "à préciser"}\nRèglement : ${PAYMENTS.find((p) => p.id === payment)?.label}\n\n` +
        lines.map((l) => `• ${l.name} — taille ${l.size} × ${l.quantity}`).join("\n") +
        `\n\nTotal : ${total > 0 ? formatPrice(total) : "sur devis"}`,
    );

    clear();
    setSaving(false);
    toast.success("Commande enregistrée. Un conseiller vous confirme la suite.");
    window.open(message, "_blank", "noopener");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <p className="eyebrow text-terracotta">Commande</p>
      <h1 className="font-display mt-3 text-4xl">Finaliser</h1>
      <div className="woven-rule my-8 w-32" />

      {lines.length === 0 ? (
        <div>
          <p className="text-muted-foreground text-sm">Votre panier est vide.</p>
          <Link to="/boutique" className="eyebrow mt-6 inline-block underline">
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div>
              <label className="eyebrow text-muted-foreground" htmlFor="full_name">
                Nom complet
              </label>
              <input
                id="full_name"
                value={form.full_name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={field}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="eyebrow text-muted-foreground" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  id="phone"
                  value={form.phone}
                  maxLength={30}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground" htmlFor="email">
                  E-mail (optionnel)
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
            </div>
            <div>
              <label className="eyebrow text-muted-foreground" htmlFor="address">
                Adresse de livraison
              </label>
              <input
                id="address"
                value={form.address}
                maxLength={300}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground" htmlFor="zone">
                Zone de livraison
              </label>
              <select
                id="zone"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className={field}
              >
                <option value="">À préciser avec un conseiller</option>
                {(zones as { id: string; name: string; fee_xof: number }[]).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {formatPrice(z.fee_xof)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Mode de règlement</p>
              <div className="mt-3 space-y-2 text-sm">
                {PAYMENTS.map((p) => (
                  <label key={p.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === p.id}
                      onChange={() => setPayment(p.id)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground" htmlFor="note">
                Note (optionnel)
              </label>
              <textarea
                id="note"
                rows={4}
                value={form.note}
                maxLength={500}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className={field}
              />
            </div>
          </div>

          <aside className="h-fit border border-border p-6">
            <h2 className="font-display text-xl">Récapitulatif</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {l.name} × {l.quantity}
                  </span>
                  <span>{formatPrice(l.price)}</span>
                </li>
              ))}
            </ul>
            <div className="hairline my-5" />
            <p className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{subtotal > 0 ? formatPrice(subtotal) : "Sur devis"}</span>
            </p>
            <p className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{zone ? formatPrice(shipping) : "À confirmer"}</span>
            </p>
            <p className="mt-4 flex justify-between">
              <span className="eyebrow">Total</span>
              <span className="font-display text-lg">
                {total > 0 ? formatPrice(total) : "Sur devis"}
              </span>
            </p>
            {hasMadeToMeasure && (
              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                Pièces sur mesure incluses : le montant final vous sera confirmé
                après prise de mesures.
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="eyebrow bg-primary text-primary-foreground mt-6 w-full px-6 py-4 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Valider la commande"}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}