import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getAccountCart, saveAccountCart } from "@/lib/cart.functions";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CART_STORAGE_KEY = "afromart-cart:guest";
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const owner = isLoading ? "loading" : user?.id ?? "guest";
  return <ScopedCartProvider key={owner} owner={owner}>{children}</ScopedCartProvider>;
}

function ScopedCartProvider({ children, owner }: { children: ReactNode; owner: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [revision, setRevision] = useState(0);
  const pending = useRef<Array<(items: CartItem[]) => CartItem[]>>([]);
  const getCart = useServerFn(getAccountCart);
  const saveCart = useServerFn(saveAccountCart);
  const writes = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (owner === "loading") return;
    let cancelled = false;
    const load = async () => {
      let saved: CartItem[] = [];
      if (owner === "guest") {
        try {
          // The legacy shared cart has no trustworthy owner; never import it.
          localStorage.removeItem("afromart-cart");
          const raw = localStorage.getItem(CART_STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) saved = parsed.filter((item) => item && typeof item.productId === "string" && Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0);
        } catch { /* Guest cart remains usable without browser storage. */ }
      } else {
        saved = await getCart();
      }
      if (cancelled) return;
      setItems(pending.current.reduce((cart, update) => update(cart), saved));
      pending.current = [];
      setLoaded(true);
    };
    void load().catch(() => {
      if (!cancelled) toast.error("Your cart couldn't be loaded. Please refresh before making changes.");
    });
    return () => { cancelled = true; };
  }, [owner, getCart]);

  useEffect(() => {
    if (!loaded || revision === 0) return;
    if (owner === "guest") {
      try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); } catch { /* Keep the cart usable when storage is unavailable. */ }
      return;
    }
    writes.current = writes.current.catch(() => undefined).then(() => saveCart({ data: { expectedUserId: owner, items } }));
    void writes.current.catch(() => toast.error("Your cart couldn't be saved. Please try again."));
  }, [items, loaded, owner, revision, saveCart]);

  const changeItems = (update: (items: CartItem[]) => CartItem[]) => {
    if (owner === "loading") return;
    if (!loaded) pending.current.push(update);
    setItems(update);
    setRevision((value) => value + 1);
  };

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    changeItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    changeItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const removeItem = (productId: string) => {
    changeItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => changeItems(() => []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
