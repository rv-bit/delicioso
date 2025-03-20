import { Head, Link, usePage } from "@inertiajs/react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

export default function Dashboard() {
	const user = usePage().props.auth.user;

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="overflow-hidden rounded-sm bg-white shadow-sm">
						<div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!</div>
					</div>

					<div className="overflow-hidden rounded-sm bg-white shadow-sm">
						<div className="w-full p-6 text-gray-900 dark:text-gray-100">
							<Link
								href={route("payment.checkout", {
									product: "price_1R4luvIv1F2scOeLrcK4LC8D",
								})}
							>
								Test Checkout
							</Link>
						</div>
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
