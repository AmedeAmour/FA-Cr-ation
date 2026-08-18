export const BRAND = {
  name: "Abikè",
  tagline: "L'élégance du tissé béninois.",
  site: "facebook.com/Abikè",
  facebook: "https://web.facebook.com/profile.php?id=100063839619382",
  phones: ["01 62 48 25 25", "01 67 64 80 45"],
  whatsapp: "2290162482525",
  whatsappUrl: "https://wa.me/2290162482525",
  maps: "https://www.google.com/maps/search/?api=1&query=Abomey-Calavi%2C%20B%C3%A9nin",
  mapsEmbed: "https://www.google.com/maps?q=Abomey-Calavi%2C%20B%C3%A9nin&output=embed",
  boutique: {
    label: "Abomey-Calavi, Bénin",
    address: "Maison de mode Abikè, Abomey-Calavi, Bénin. Livraison disponible partout au Bénin.",
  },
} as const;

export function wa(message: string) {
  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function waProduct(productName: string, size?: string | null) {
  const sizeText = size ? ` Taille souhaitée : ${size}.` : "";
  return wa(
    `Bonjour ${BRAND.name}, je suis intéressé(e) par ${productName}.${sizeText} Est-il disponible ?`,
  );
}

export function formatPrice(price?: number | null) {
  if (price == null) return "Sur mesure";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}
