export const BRAND = {
  name: "Maison Michèle Yakice",
  tagline: "Le pagne tissé autrement – vous allez vous aimer.",
  email: "micheleyakice28@gmail.com",
  site: "micheleyakice.com",
  phones: ["+225 0758430221", "+225 0758213810"],
  whatsapp: "2250758430221",
  whatsappUrl: "https://wa.me/2250758430221",
  maps: "https://maps.app.goo.gl/N2wx2oLpcNczpJdp6",
  mapsEmbed:
    "https://www.google.com/maps?q=Angr%C3%A9%208%C3%A8me%20Tranche%20Star%2011%20Cocody%20Abidjan&output=embed",
  boutique: {
    label: "Angré 8ème Tranche – Cocody, Abidjan",
    address:
      "Star 11, voie del hôtel Belle côte, même bâtiment que l'école internationale de formation professionnelle Michèle Yakice, face programme 6, Cocody, Abidjan, Côte d'Ivoire, 07 bp 227 Abidjan 07.",
  },
} as const;

export function wa(message: string) {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function waProduct(productName: string, size?: string | null) {
  return wa(
    `Bonjour ${BRAND.name}, je suis intéressé par le modèle ${productName}. Est-il disponible en taille ${size ?? "..."} ?`,
  );
}

export function formatPrice(price?: number | null) {
  if (price == null) return "Sur mesure";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}