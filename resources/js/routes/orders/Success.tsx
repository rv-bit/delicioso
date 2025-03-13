import { Head } from "@inertiajs/react";

import RootLayout from "@/layouts/root-layout";

export default function Success() {
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
