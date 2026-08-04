import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string | null;
  price: number | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  hasMadeToMeasure: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mmy-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const i = prev.findIndex(
        (l) => l.productId === line.productId && l.size === line.size,
      );
      if (i === -1) return [...prev, line];
      const next = [...prev];
      const existing = prev[i]!;
      next[i] = { ...existing, quantity: existing.quantity + line.quantity };
      return next;
    });
  }, []);

  const remove = useCallback((productId: string, size: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size)),
    );
  }, []);

  const setQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId && l.size === size
          ? { ...l, quantity: Math.max(1, quantity) }
          : l,
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      add,
      remove,
      setQuantity,
      clear,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + (l.price ?? 0) * l.quantity, 0),
      hasMadeToMeasure: lines.some((l) => l.price == null),
    }),
    [lines, add, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}