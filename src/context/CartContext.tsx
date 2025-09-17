"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CartItem {
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextProps {
  items: CartItem[];
  initialized: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (title: string) => void;
  clearCart: () => void;
  incrementQuantity: (title: string) => void;
  decrementQuantity: (title: string) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);
const MAX_QUANTITY = 100;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // --- Load cart from Firebase when user changes ---
  useEffect(() => {
    if (userLoading) return;

    const loadUserCart = async () => {
      setInitialized(false);
      
      if (!user) {
        // No user → clear local cart but DON'T touch Firebase
        setItems([]);
        setInitialized(true);
        return;
      }

      try {
        const docRef = doc(db, "carts", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firebaseCart: CartItem[] = docSnap.data().items || [];
          setItems(firebaseCart);
        } else {
          // If no doc exists, create it with current local items (or empty)
          // But don't clear existing items if we're just loading
          await setDoc(docRef, { items, userId: user.uid });
          // Keep local items as they are, don't set to empty
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        // Don't clear items on error, keep local state
      } finally {
        setInitialized(true);
      }
    };

    loadUserCart();
  }, [user, userLoading]); // This should trigger on any user change

  // --- Save cart to Firebase whenever items change ---
  useEffect(() => {
    if (!user || !initialized) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", user.uid);
        await setDoc(docRef, { items, userId: user.uid }, { merge: true });
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };

    // Add a small delay to avoid rapid firestore writes
    const timeoutId = setTimeout(saveCart, 300);
    return () => clearTimeout(timeoutId);
  }, [items, user, initialized]);

  // --- Cart actions ---
  const addToCart = (item: CartItem) => {
    const safeQuantity = Math.min(item.quantity, MAX_QUANTITY);
    setItems((prev) => {
      const existing = prev.find((p) => p.title === item.title);
      if (existing) {
        return prev.map((p) =>
          p.title === item.title
            ? { ...p, quantity: Math.min(p.quantity + safeQuantity, MAX_QUANTITY) }
            : p
        );
      }
      return [...prev, { ...item, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (title: string) =>
    setItems((prev) => prev.filter((p) => p.title !== title));

  const clearCart = () => setItems([]);

  const incrementQuantity = (title: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.title === title
          ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
          : item
      )
    );

  const decrementQuantity = (title: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.title === title
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );

  return (
    <CartContext.Provider
      value={{
        items,
        initialized,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}