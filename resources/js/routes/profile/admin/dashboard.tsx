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

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="overflow-hidden rounded-sm bg-white shadow-sm dark:bg-gray-800">
						<div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!, and found the admin dashboard</div>
					</div>

					{componentItems.map((item, index) => {
						if (item.isHidden) return null;

						return <React.Fragment key={index}>{item.element}</React.Fragment>;
					})}
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
