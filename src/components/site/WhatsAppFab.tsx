import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function WhatsAppFab() {
  return (
    <a
      href={BRAND.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter un conseiller sur WhatsApp"
      className="bg-terracotta text-terracotta-foreground fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-[var(--shadow-elegant)] transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="eyebrow hidden sm:inline">WhatsApp</span>
    </a>
  );
}