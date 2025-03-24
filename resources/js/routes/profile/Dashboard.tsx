import { Head, usePage } from "@inertiajs/react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

export default function Dashboard() {
	const user = usePage().props.auth.user;

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2"></div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}
