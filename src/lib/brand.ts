export const BRAND = {
  name: "FA Creation",
  displayName: "FA Création",
  shortName: "FA",
  tagline: "Votre style, notre savoir-faire.",
  site: "Page Facebook FA Creation",
  facebook: "https://web.facebook.com/search/top?q=FA%20Creation",
  email: "facreation23@gmail.com",
  phones: ["01 40 36 78 18"],
  whatsapp: "22940367818",
  whatsappUrl: "https://wa.me/22940367818",
  maps: "https://www.google.com/maps/search/?api=1&query=Cotonou%2C%20B%C3%A9nin",
  mapsEmbed: "https://www.google.com/maps?q=Cotonou%2C%20B%C3%A9nin&output=embed",
  boutique: {
    label: "Cotonou, Bénin",
    address:
      "Atelier FA Creation, Cotonou. Confection sur mesure, livraison en 72h et express 24h selon le modèle.",
  },
} as const;

export function wa(message: string) {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function waProduct(productName: string, size?: string | null) {
  const sizeText = size ? ` Taille souhaitée : ${size}.` : "";
  return wa(
    `Bonjour ${BRAND.name}, je suis intéressé(e) par ${productName}.${sizeText} Est-ce disponible ?`,
  );
}

export function formatPrice(price?: number | null) {
  if (price == null) return "Sur devis";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}

