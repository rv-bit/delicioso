import React, { createContext, useContext } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { CartProduct } from "@/types/cart";

interface CartContextProps {
	cart: CartProduct[];
	setCart: React.Dispatch<React.SetStateAction<CartProduct[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useLocalStorage<CartProduct[]>("cart", []);

	return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
