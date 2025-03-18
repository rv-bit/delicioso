import { Head, usePage } from "@inertiajs/react";
import React from "react";

import { Price, Product } from "@/types/stripe";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

import PricesTable from "./tables/prices-table";
import ProductsTable from "./tables/products-table";

type ComponentItem = {
	isHidden: boolean;
	element: React.JSX.Element;
};

export default function Dashboard({ products, prices }: { products: Product[]; prices: Price[] }) {
	const user = usePage().props.auth.user;

	const componentItems: ComponentItem[] = React.useMemo(
		() => [
			{
				isHidden: !user?.permissions?.includes("manage_items"),
				element: <ProductsTable products={products} />,
			},
			{
				isHidden: !user?.permissions?.includes("manage_prices"),
				element: <PricesTable prices={prices} />,
			},
		],
		[products, prices],
	);

	const componentItemsWhichAreHidden = componentItems.filter((item) => item.isHidden);

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					{componentItemsWhichAreHidden.length === componentItems.length && (
						<div className="flex max-h-[50rem] flex-col gap-3 overflow-auto bg-white p-5 shadow-sm">
							<header>
								<h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Items Available</h1>
							</header>
						</div>
					)}

					{componentItems.map((item, index) => {
						if (item.isHidden) return null;

						return <React.Fragment key={index}>{item.element}</React.Fragment>;
					})}
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
