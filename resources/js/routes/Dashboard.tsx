import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Dashboard() {
	React.useEffect(() => {
		fetch("/api/test", { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	}, []);

	return (
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
		</AuthenticatedLayout>
	);
}
