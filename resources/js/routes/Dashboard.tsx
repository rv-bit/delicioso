import { Head, Link } from "@inertiajs/react";
import React from "react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

export default function Dashboard() {
	React.useEffect(() => {
		fetch("/api/test", { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	}, []);

	return (
		<RootLayout>
			<AuthenticatedLayout
				header={
					<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
						Dashboard
					</h2>
				}
			>
				<Head title="Dashboard" />

				<div className="py-12">
					<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="overflow-hidden bg-white shadow-xs sm:rounded-lg dark:bg-gray-800">
							<div className="p-6 text-gray-900 dark:text-gray-100">
								You're logged in!
							</div>
						</div>
					</div>
				</div>

				<div className="py-12">
					<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="overflow-hidden bg-white shadow-xs sm:rounded-lg dark:bg-gray-800">
							<div className="w-full p-6 text-gray-900 dark:text-gray-100">
								<Link
									href={route("checkout", {
										item: "price_1R0Y8NIv1F2scOeLeyADFSsM",
										// quantity: "1",
									})}
								>
									Checkout
								</Link>
							</div>
						</div>
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
