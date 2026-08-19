export const BRAND = {
  name: "Niss mode & couture",
  shortName: "Niss",
  tagline: "Maison de couture et de mode à Fifadji.",
  site: "Page Facebook Niss mode & couture",
  facebook: "https://web.facebook.com/search/top?q=Niss%20mode%20%26%20couture",
  email: "venglele1402@gmail.com",
  phones: ["01 96 65 27 27"],
  whatsapp: "2290196652727",
  whatsappUrl: "https://wa.me/2290196652727",
  maps: "https://www.google.com/maps/search/?api=1&query=Fifadji%2C%20Cotonou%2C%20B%C3%A9nin",
  mapsEmbed: "https://www.google.com/maps?q=Fifadji%2C%20Cotonou%2C%20B%C3%A9nin&output=embed",
  boutique: {
    label: "Fifadji, Cotonou",
    address:
      "Atelier Niss mode & couture, Fifadji, Cotonou. Livraison et expédition partout.",
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
