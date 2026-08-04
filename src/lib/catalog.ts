import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProductImage = { id: string; url: string; alt: string | null; position: number };
export type ProductVariant = {
  id: string;
  size: string;
  color: string | null;
  stock: number;
};
export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  composition: string | null;
  care: string | null;
  gender: string;
  price_xof: number | null;
  compare_price_xof: number | null;
  is_made_to_measure: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
};
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
};

const PRODUCT_SELECT =
  "*, product_images(id,url,alt,position), product_variants(id,size,color,stock)";

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Product) ?? null;
    },
  });

export const deliveryZonesQuery = () =>
  queryOptions({
    queryKey: ["delivery_zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("*")
        .eq("is_active", true)
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });

export const reviewsQuery = (productId: string) =>
  queryOptions({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export function primaryImage(p: Product) {
  const sorted = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position);
  return sorted[0]?.url ?? "/images/products/detail-1.jpg";
}

export function secondaryImage(p: Product) {
  const sorted = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position);
  return sorted[1]?.url ?? primaryImage(p);
}

export function totalStock(p: Product) {
  return (p.product_variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
}

export function sizes(p: Product) {
  return [...new Set((p.product_variants ?? []).map((v) => v.size))];
}

export function colors(p: Product) {
  return [...new Set((p.product_variants ?? []).map((v) => v.color).filter(Boolean))] as string[];
}