import { Head, usePage } from "@inertiajs/react";
import React from "react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

export default function Dashboard() {
	const user = usePage().props.auth.user;

	React.useEffect(() => {
		fetch("/api/test", { method: "GET" })
			.then((res) => res.json())
			.then((data) => {
				console.log(data, user);
			});
	}, []);

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="overflow-hidden rounded-sm bg-white shadow-sm dark:bg-gray-800">
						<div className="p-6 text-gray-900 dark:text-gray-100">You're logged in!, and found the admin dashboard</div>
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
