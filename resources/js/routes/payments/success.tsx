import { Head } from "@inertiajs/react";
import React from "react";

import { CartProduct } from "@/types/cart";

import { useLocalStorage } from "@/hooks/use-local-storage";

import RootLayout from "@/layouts/root-layout";

export default function Success({ sessionItems }: { sessionItems: { priceId: string }[] }) {
	const [currentCart, setCurrentCart] = useLocalStorage<CartProduct[]>("cart", []);

	React.useEffect(() => {
		if (sessionItems?.length > 0) {
			setCurrentCart((prevCart) => {
				const newCart = prevCart.filter((item) => !sessionItems.some((sessionItem) => sessionItem.priceId === item.price_id));
				return newCart;
			});
		}
	}, [sessionItems, setCurrentCart]);

	return (
		<RootLayout>
			<Head title="Success" />

			<div className="mx-auto max-w-7xl px-2">
				<div className="overflow-hidden bg-white shadow-xs sm:rounded-lg dark:bg-gray-800">
					<div className="p-6 text-gray-900 dark:text-gray-100">Well done you have successfully placed an order!</div>
				</div>
			</div>
		</RootLayout>
	);
}
