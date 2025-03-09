import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";

export default function Success() {
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
					Success
				</h2>
			}
		>
			<Head title="Success" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-xs sm:rounded-lg dark:bg-gray-800">
						<div className="p-6 text-gray-900 dark:text-gray-100">
							Well done you have successfully placed an order!
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
